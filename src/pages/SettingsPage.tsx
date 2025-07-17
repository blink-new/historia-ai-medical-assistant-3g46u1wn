import { useState, useEffect } from 'react'
import { 
  User, 
  Globe, 
  Moon, 
  Sun,
  Bell,
  Shield,
  Database,
  Mic,
  Volume2,
  Wifi,
  WifiOff,
  Download,
  Trash2,
  Info
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Switch } from '../components/ui/switch'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { Separator } from '../components/ui/separator'
import { Badge } from '../components/ui/badge'
import { blink } from '../blink/client'
import { toast } from '../hooks/use-toast'

export function SettingsPage() {
  const [user, setUser] = useState(null)
  const [settings, setSettings] = useState({
    language: 'uz',
    darkMode: false,
    notifications: true,
    autoSave: true,
    offlineMode: false,
    microphoneGain: 50,
    playbackVolume: 70,
    autoTranscribe: true,
    saveAudioFiles: true
  })
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [storageUsed, setStorageUsed] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
    })

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      unsubscribe()
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    
    // Apply theme change immediately
    if (key === 'darkMode') {
      if (value) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
    
    toast({
      title: "Sozlama saqlandi",
      description: "O'zgarish muvaffaqiyatli saqlandi",
    })
  }

  const clearCache = async () => {
    setLoading(true)
    try {
      // Clear browser cache
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map(name => caches.delete(name)))
      }
      
      // Clear localStorage
      localStorage.clear()
      
      toast({
        title: "Kesh tozalandi",
        description: "Barcha vaqtinchalik fayllar o'chirildi",
      })
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Keshni tozalashda xatolik yuz berdi",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const exportData = async () => {
    setLoading(true)
    try {
      // Mock data export
      const data = {
        user: user,
        settings: settings,
        exportDate: new Date().toISOString()
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `historia-ai-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast({
        title: "Ma'lumotlar eksport qilindi",
        description: "Backup fayli yuklab olindi",
      })
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Eksport qilishda xatolik yuz berdi",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Sozlamalar</h1>
        <p className="text-muted-foreground">
          Ilova sozlamalari va shaxsiy ma'lumotlar
        </p>
      </div>

      {/* Connection Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isOnline ? (
                <Wifi className="w-5 h-5 text-green-500" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-500" />
              )}
              <div>
                <p className="font-medium">
                  {isOnline ? 'Internetga ulangan' : 'Offline rejim'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isOnline ? 'Barcha xizmatlar mavjud' : 'Cheklangan funksiyalar'}
                </p>
              </div>
            </div>
            <Badge variant={isOnline ? 'default' : 'secondary'}>
              {isOnline ? 'Online' : 'Offline'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Profil sozlamalari</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email manzil</Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ''}
              disabled
              className="bg-muted"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="displayName">Ko'rsatiladigan ism</Label>
            <Input
              id="displayName"
              placeholder="Dr. Ism Familiya"
              value={user?.displayName || ''}
            />
          </div>
          
          <Button size="sm">
            Profilni yangilash
          </Button>
        </CardContent>
      </Card>

      {/* App Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Ilova sozlamalari</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Language */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Til</Label>
              <p className="text-sm text-muted-foreground">Interfeys tili</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={settings.language === 'uz' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSettingChange('language', 'uz')}
              >
                O'zbek
              </Button>
              <Button
                variant={settings.language === 'en' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSettingChange('language', 'en')}
              >
                English
              </Button>
            </div>
          </div>

          <Separator />

          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {settings.darkMode ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
              <div>
                <Label>Qorong'u rejim</Label>
                <p className="text-sm text-muted-foreground">Ko'zni himoya qilish uchun</p>
              </div>
            </div>
            <Switch
              checked={settings.darkMode}
              onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
            />
          </div>

          <Separator />

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5" />
              <div>
                <Label>Bildirishnomalar</Label>
                <p className="text-sm text-muted-foreground">Push bildirishnomalar</p>
              </div>
            </div>
            <Switch
              checked={settings.notifications}
              onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
            />
          </div>

          <Separator />

          {/* Auto Save */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Database className="w-5 h-5" />
              <div>
                <Label>Avtomatik saqlash</Label>
                <p className="text-sm text-muted-foreground">Yozuvlarni avtomatik saqlash</p>
              </div>
            </div>
            <Switch
              checked={settings.autoSave}
              onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Audio Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mic className="w-5 h-5" />
            <span>Audio sozlamalari</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Microphone Gain */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Mikrofon sezgirligi</Label>
              <span className="text-sm text-muted-foreground">{settings.microphoneGain}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.microphoneGain}
              onChange={(e) => handleSettingChange('microphoneGain', parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <Separator />

          {/* Playback Volume */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4" />
                <Label>Ijro ovozi</Label>
              </div>
              <span className="text-sm text-muted-foreground">{settings.playbackVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.playbackVolume}
              onChange={(e) => handleSettingChange('playbackVolume', parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <Separator />

          {/* Auto Transcribe */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Avtomatik transkripsiya</Label>
              <p className="text-sm text-muted-foreground">Yozuv tugagach avtomatik matunga aylantirish</p>
            </div>
            <Switch
              checked={settings.autoTranscribe}
              onCheckedChange={(checked) => handleSettingChange('autoTranscribe', checked)}
            />
          </div>

          <Separator />

          {/* Save Audio Files */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Audio fayllarni saqlash</Label>
              <p className="text-sm text-muted-foreground">Asl audio yozuvlarni saqlash</p>
            </div>
            <Switch
              checked={settings.saveAudioFiles}
              onCheckedChange={(checked) => handleSettingChange('saveAudioFiles', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Ma'lumotlar boshqaruvi</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Foydalanilgan xotira</p>
              <p className="text-sm text-muted-foreground">
                {storageUsed} MB / 1000 MB
              </p>
            </div>
            <div className="w-32 bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(storageUsed / 1000) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={clearCache}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Keshni tozalash</span>
            </Button>

            <Button
              variant="outline"
              onClick={exportData}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Ma'lumotlarni eksport qilish</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Maxfiylik va xavfsizlik</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Barcha ma'lumotlar mahalliy qurilmada va xavfsiz bulutda saqlanadi. 
              Tibbiy ma'lumotlar HIPAA standartlariga muvofiq himoyalangan.
            </p>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Info className="w-4 h-4 mr-2" />
              Maxfiylik siyosati
            </Button>
            <Button variant="outline" size="sm">
              <Shield className="w-4 h-4 mr-2" />
              Xavfsizlik sozlamalari
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card>
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <h3 className="font-semibold">Historia AI v1.0.0</h3>
            <p className="text-sm text-muted-foreground">
              Tibbiy ovoz yordamchisi - O'zbekiston shifokorlari uchun
            </p>
            <p className="text-xs text-muted-foreground">
              © 2024 Historia AI. Barcha huquqlar himoyalangan.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Mobile spacing */}
      <div className="md:hidden h-20"></div>
    </div>
  )
}