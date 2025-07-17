import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { 
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Calendar,
  User,
  FileText,
  Mic
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import { blink } from '../blink/client'

interface Appointment {
  id: string
  patientName: string
  time: string
  status: 'scheduled' | 'completed' | 'cancelled'
  type: string
}

interface CalendarDay {
  date: number
  month: string
  dayName: string
  isToday: boolean
  isSelected: boolean
  appointments: Appointment[]
}

export function HomePage() {
  const [user, setUser] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentWeek, setCurrentWeek] = useState<CalendarDay[]>([])
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      if (state.user) {
        loadAppointments()
      }
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    generateWeekCalendar()
  }, [generateWeekCalendar])

  const generateWeekCalendar = useCallback(() => {
    const today = new Date()
    const startOfWeek = new Date(selectedDate)
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay() + 1) // Start from Monday

    const week: CalendarDay[] = []
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
    const days = ['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak']

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      
      const isToday = date.toDateString() === today.toDateString()
      const isSelected = date.toDateString() === selectedDate.toDateString()
      
      week.push({
        date: date.getDate(),
        month: months[date.getMonth()],
        dayName: days[date.getDay()],
        isToday,
        isSelected,
        appointments: isSelected ? todayAppointments : []
      })
    }
    
    setCurrentWeek(week)
  }, [selectedDate, todayAppointments])

  const loadAppointments = async () => {
    try {
      // Mock data - replace with actual database calls
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          patientName: 'Gulnora Azizova',
          time: '15:30',
          status: 'scheduled',
          type: 'Yangi'
        },
        {
          id: '2',
          patientName: 'Ahmadjon Karimov',
          time: '14:15',
          status: 'completed',
          type: 'Takroriy'
        },
        {
          id: '3',
          patientName: 'Malika Tosheva',
          time: '16:45',
          status: 'scheduled',
          type: 'Konsultatsiya'
        }
      ]
      
      setTodayAppointments(mockAppointments)
    } catch (error) {
      console.error('Error loading appointments:', error)
    }
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate)
    newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 7 : -7))
    setSelectedDate(newDate)
  }

  const selectDate = (day: CalendarDay) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(day.date)
    setSelectedDate(newDate)
  }

  const getMonthYearDisplay = () => {
    const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr']
    return `${selectedDate.getDate()}-${selectedDate.getDate() + 6} ${months[selectedDate.getMonth()]}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-orange-100 text-orange-600">
                👋
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Xayrli kech, Dr. Rashid
              </h1>
              <p className="text-sm text-gray-500">Bugungi jadvalingiz</p>
            </div>
          </div>
          <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">
            <Plus className="w-4 h-4 mr-1" />
            Yangi
          </Button>
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateWeek('prev')}
            className="p-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <h2 className="text-lg font-semibold text-gray-900">
            {getMonthYearDisplay()}
          </h2>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateWeek('next')}
            className="p-2"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Week Calendar */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {currentWeek.slice(0, 5).map((day, index) => (
            <button
              key={index}
              onClick={() => selectDate(day)}
              className={`p-3 rounded-lg text-center transition-all ${
                day.isSelected
                  ? 'bg-red-500 text-white shadow-lg'
                  : day.isToday
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="text-xs font-medium mb-1">{day.month}</div>
              <div className="text-lg font-semibold">{day.date}</div>
              <div className="text-xs">{day.dayName}</div>
            </button>
          ))}
        </div>

        {/* New Appointment Button */}
        <Button 
          className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl mb-6"
          asChild
        >
          <Link to="/record">
            <Mic className="w-5 h-5 mr-2" />
            Yangi bemor qo'shish
          </Link>
        </Button>

        {/* Today's Appointments */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Bugungi bemorlar</h3>
          
          {todayAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Bugun uchun bemorlar yo'q</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {appointment.patientName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {appointment.patientName}
                        </h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{appointment.time}</span>
                          <span>•</span>
                          <span>{appointment.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : appointment.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {appointment.status === 'completed' ? 'Tugallangan' : 
                         appointment.status === 'scheduled' ? 'Rejalashtirilgan' : 'Bekor qilingan'}
                      </span>
                      <div className="text-xs text-red-500 mt-1">Ko'rish</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Navigation Space */}
        <div className="h-20"></div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-3 max-w-md mx-auto">
          <Link
            to="/"
            className="flex flex-col items-center py-3 text-red-500"
          >
            <Calendar className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Bosh sahifa</span>
          </Link>
          
          <Link
            to="/patients"
            className="flex flex-col items-center py-3 text-gray-400"
          >
            <FileText className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Yozuvlar</span>
          </Link>
          
          <Link
            to="/settings"
            className="flex flex-col items-center py-3 text-gray-400"
          >
            <User className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Profil</span>
          </Link>
        </div>
      </div>
    </div>
  )
}