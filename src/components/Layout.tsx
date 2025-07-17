import { ReactNode } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { 
  Home, 
  Mic, 
  Users, 
  FileText, 
  Settings,
  Globe,
  Moon,
  Sun,
  User,
  LogOut
} from 'lucide-react'
import { blink } from '../blink/client'
import { Button } from './ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { useState, useEffect } from 'react'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const [isDark, setIsDark] = useState(false)
  const [isUzbek, setIsUzbek] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const navItems = [
    { 
      path: '/', 
      icon: Home, 
      label: isUzbek ? 'Bosh sahifa' : 'Home' 
    },
    { 
      path: '/record', 
      icon: Mic, 
      label: isUzbek ? 'Yozib olish' : 'Record' 
    },
    { 
      path: '/patients', 
      icon: Users, 
      label: isUzbek ? 'Bemorlar' : 'Patients' 
    },
    { 
      path: '/templates', 
      icon: FileText, 
      label: isUzbek ? 'Shablonlar' : 'Templates' 
    },
    { 
      path: '/settings', 
      icon: Settings, 
      label: isUzbek ? 'Sozlamalar' : 'Settings' 
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Mic className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">Historia AI</h1>
          </div>

          <div className="flex items-center space-x-2">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsUzbek(!isUzbek)}
              className="flex items-center space-x-1"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm">{isUzbek ? 'UZ' : 'EN'}</span>
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDark(!isDark)}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user?.email?.split('@')[0] || 'User'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  {isUzbek ? 'Profil' : 'Profile'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => blink.auth.logout()}
                  className="text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {isUzbek ? 'Chiqish' : 'Logout'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation - Desktop */}
        <nav className="hidden md:flex w-64 bg-card border-r border-border min-h-[calc(100vh-73px)]">
          <div className="w-full p-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-73px)]">
          {children}
        </main>
      </div>

      {/* Bottom Navigation - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex-1 flex flex-col items-center py-2 px-1 transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}