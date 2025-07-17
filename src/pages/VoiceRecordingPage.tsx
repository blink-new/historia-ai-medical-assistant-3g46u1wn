import { useState, useRef, useEffect } from 'react'
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  RotateCcw,
  FileText,
  Download,
  Save,
  Loader2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Textarea } from '../components/ui/textarea'
import { blink } from '../blink/client'
import { toast } from '../hooks/use-toast'

export function VoiceRecordingPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [transcript, setTranscript] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isGeneratingDiagnosis, setIsGeneratingDiagnosis] = useState(false)
  const [waveformData, setWaveformData] = useState<number[]>(Array(50).fill(0))

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const waveformIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (waveformIntervalRef.current) clearInterval(waveformIntervalRef.current)
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' })
        setAudioBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

      // Start waveform animation
      waveformIntervalRef.current = setInterval(() => {
        setWaveformData(prev => 
          prev.map(() => Math.random() * 100)
        )
      }, 100)

      toast({
        title: "Yozib olish boshlandi",
        description: "Gapiring...",
      })
    } catch (error) {
      console.error('Error starting recording:', error)
      toast({
        title: "Xatolik",
        description: "Mikrofonga kirish imkoni yo'q",
        variant: "destructive"
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      
      if (waveformIntervalRef.current) {
        clearInterval(waveformIntervalRef.current)
        waveformIntervalRef.current = null
      }

      // Reset waveform
      setWaveformData(Array(50).fill(0))

      toast({
        title: "Yozib olish tugadi",
        description: "Audio fayl tayyor",
      })
    }
  }

  const playAudio = () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const resetRecording = () => {
    setAudioBlob(null)
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
    }
    setTranscript('')
    setDiagnosis('')
    setRecordingTime(0)
    setWaveformData(Array(50).fill(0))
    
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const transcribeAudio = async () => {
    if (!audioBlob) return

    setIsTranscribing(true)
    try {
      // Convert blob to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const dataUrl = reader.result as string
          const base64Data = dataUrl.split(',')[1]
          resolve(base64Data)
        }
        reader.onerror = reject
        reader.readAsDataURL(audioBlob)
      })

      // Transcribe using Blink AI
      const result = await blink.ai.transcribeAudio({
        audio: base64,
        language: 'uz' // Uzbek language
      })

      setTranscript(result.text)
      toast({
        title: "Transkripsiya tugadi",
        description: "Matn tayyor",
      })
    } catch (error) {
      console.error('Error transcribing audio:', error)
      toast({
        title: "Xatolik",
        description: "Transkripsiya qilishda xatolik yuz berdi",
        variant: "destructive"
      })
    } finally {
      setIsTranscribing(false)
    }
  }

  const generateDiagnosis = async () => {
    if (!transcript) return

    setIsGeneratingDiagnosis(true)
    try {
      const prompt = `
Ushbu simptom tavsifiga asoslanib, o'zbek tilida tibbiy yozuv yarating. Javobni quyidagi bo'limlarda tuzish:

Simptomlar: "${transcript}"

Quyidagi formatda javob bering:

**Shikoyatlar:**
[Bemorning asosiy shikoyatlari]

**Anamnez:**
[Kasallik tarixi va rivojlanishi]

**Ko'rik natijalari:**
[Fizik ko'rik natijalari]

**Tahlil natijalari:**
[Zarur tahlillar va ularning natijalari]

**Xulosa (MKB-10 kodi bilan):**
[Diagnoz va tegishli MKB-10 kodi]

**Tavsiyalar:**
[Dori-darmonlar, hayot tarzi, nazorat]

**Terapevt imzo joyi:**
[Shifokor imzosi uchun joy]
      `

      const result = await blink.ai.generateText({
        prompt,
        model: 'gpt-4o-mini',
        maxTokens: 1000
      })

      setDiagnosis(result.text)
      toast({
        title: "Diagnoz yaratildi",
        description: "Tibbiy hujjat tayyor",
      })
    } catch (error) {
      console.error('Error generating diagnosis:', error)
      toast({
        title: "Xatolik",
        description: "Diagnoz yaratishda xatolik yuz berdi",
        variant: "destructive"
      })
    } finally {
      setIsGeneratingDiagnosis(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Ovozli yozuv</h1>
        <p className="text-muted-foreground">
          Ovozli yozuv yarating va AI yordamida diagnoz shablonini yarating
        </p>
      </div>

      {/* Recording Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mic className="w-5 h-5" />
            <span>Yozib olish</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Waveform Visualization */}
          <div className="bg-muted/30 rounded-lg p-6">
            <div className="flex items-end justify-center space-x-1 h-24">
              {waveformData.map((height, index) => (
                <div
                  key={index}
                  className={`w-2 bg-primary rounded-t transition-all duration-100 ${
                    isRecording ? 'animate-waveform' : ''
                  }`}
                  style={{ 
                    height: `${Math.max(4, height)}%`,
                    animationDelay: `${index * 50}ms`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Recording Controls */}
          <div className="flex flex-col items-center space-y-4">
            <div className="text-2xl font-mono text-foreground">
              {formatTime(recordingTime)}
            </div>

            <div className="flex items-center space-x-4">
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  size="lg"
                  className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 animate-pulse-red"
                >
                  <Mic className="w-8 h-8" />
                </Button>
              ) : (
                <Button
                  onClick={stopRecording}
                  size="lg"
                  variant="destructive"
                  className="w-16 h-16 rounded-full"
                >
                  <Square className="w-8 h-8" />
                </Button>
              )}

              {audioUrl && (
                <>
                  <Button
                    onClick={playAudio}
                    variant="outline"
                    size="lg"
                    className="w-12 h-12 rounded-full"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </Button>

                  <Button
                    onClick={resetRecording}
                    variant="outline"
                    size="lg"
                    className="w-12 h-12 rounded-full"
                  >
                    <RotateCcw className="w-6 h-6" />
                  </Button>
                </>
              )}
            </div>

            {audioUrl && (
              <div className="flex space-x-2">
                <Button
                  onClick={transcribeAudio}
                  disabled={isTranscribing}
                  className="flex items-center space-x-2"
                >
                  {isTranscribing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  <span>{isTranscribing ? 'Transkripsiya...' : 'Matunga aylantirish'}</span>
                </Button>

                {transcript && (
                  <Button
                    onClick={generateDiagnosis}
                    disabled={isGeneratingDiagnosis}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    {isGeneratingDiagnosis ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                    <span>{isGeneratingDiagnosis ? 'Yaratilmoqda...' : 'Diagnoz yaratish'}</span>
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {(transcript || diagnosis) && (
        <Card>
          <CardHeader>
            <CardTitle>Natijalar</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="transcript" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="transcript">Transkripsiya</TabsTrigger>
                <TabsTrigger value="diagnosis">Diagnoz</TabsTrigger>
              </TabsList>
              
              <TabsContent value="transcript" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ovozli matn:</label>
                  <Textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Transkripsiya natijasi bu yerda ko'rsatiladi..."
                    className="min-h-[200px]"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="diagnosis" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tibbiy hujjat:</label>
                  <Textarea
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="AI tomonidan yaratilgan diagnoz bu yerda ko'rsatiladi..."
                    className="min-h-[400px] font-mono text-sm"
                  />
                </div>
                
                {diagnosis && (
                  <div className="flex space-x-2">
                    <Button className="flex items-center space-x-2">
                      <Save className="w-4 h-4" />
                      <span>Saqlash</span>
                    </Button>
                    <Button variant="outline" className="flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>PDF yuklab olish</span>
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Hidden audio element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}

      {/* Mobile spacing */}
      <div className="md:hidden h-20"></div>
    </div>
  )
}