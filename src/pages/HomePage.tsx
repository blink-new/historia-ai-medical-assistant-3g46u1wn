import { useState, useEffect } from 'react'
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
    const generateWeekCalendar = () => {
      const today = new Date()
      const startOfWeek = new Date(selectedDate)
      startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay() + 1) // Start from Monday

      const week: CalendarDay[] = []
      const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
      const days = ['Sesh', 'Chor', 'Pay', 'Jum', 'Shan']

      for (let i = 0; i < 5; i++) { // Only show 5 days like in reference
        const date = new Date(startOfWeek)
        date.setDate(startOfWeek.getDate() + i + 1) // Start from Tuesday (index 1)
        
        const isToday = date.toDateString() === today.toDateString()
        const isSelected = date.toDateString() === selectedDate.toDateString()
        
        week.push({
          date: date.getDate(),
          month: months[date.getMonth()],
          dayName: days[i],
          isToday,
          isSelected
        })
      }
      
      setCurrentWeek(week)
    }
    
    generateWeekCalendar()
  }, [selectedDate])

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
    return `17-21 ${months[3]}` // Fixed to match reference "17-21 Aprel"
  }

  return (
    <div className="min-h-screen bg-slate-800">
      <div className="bg-white min-h-screen max-w-md mx-auto relative">
        {/* Header */}
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">👋</div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Xayrli kech, Dr. Rashid
                </h1>
                <p className="text-sm text-gray-500">Bugungi jadvalingiz</p>
              </div>
            </div>
          </div>

          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateWeek('prev')}
              className="p-2 hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </Button>
            
            <h2 className="text-lg font-medium text-gray-900">
              {getMonthYearDisplay()}
            </h2>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateWeek('next')}
              className="p-2 hover:bg-gray-100"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </Button>
          </div>

          {/* Week Calendar */}
          <div className="grid grid-cols-5 gap-3 mb-8">
            {currentWeek.map((day, index) => (
              <button
                key={index}
                onClick={() => selectDate(day)}
                className={`p-4 rounded-2xl text-center transition-all ${
                  day.isSelected
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="text-sm font-medium mb-1">{day.month}</div>
                <div className="text-2xl font-bold mb-1">{day.date}</div>
                <div className="text-xs">{day.dayName}</div>
              </button>
            ))}
          </div>

          {/* New Appointment Button */}
          <Button 
            className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl mb-8 text-base font-medium"
            asChild
          >
            <Link to="/record">
              Yangi bemor qo'shish
            </Link>
          </Button>

          {/* Today's Appointments */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Bugungi bemorlar</h3>
            
            {todayAppointments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-base">Bugun uchun bemorlar yo'q</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-base">
                            {appointment.patientName}
                          </h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{appointment.time}</span>
                            <span>•</span>
                            <span>{appointment.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-red-500 font-medium">Ko'rish</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Navigation Space */}
          <div className="h-24"></div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200">
          <div className="grid grid-cols-3">
            <Link
              to="/"
              className="flex flex-col items-center py-4 text-red-500"
            >
              <div className="w-6 h-6 mb-1">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  <polyline points="9,22 9,12 15,12 15,22"/>
                </svg>
              </div>
              <span className="text-xs font-medium">Bosh sahifa</span>
            </Link>
            
            <Link
              to="/patients"
              className="flex flex-col items-center py-4 text-gray-400"
            >
              <FileText className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Yozuvlar</span>
            </Link>
            
            <Link
              to="/settings"
              className="flex flex-col items-center py-4 text-gray-400"
            >
              <User className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Profil</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}