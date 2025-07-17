import { useState, useEffect } from 'react'
import { 
  Search, 
  Plus, 
  User, 
  Calendar,
  FileText,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'
import { blink } from '../blink/client'

interface Patient {
  id: string
  name: string
  age: number
  gender: string
  phone: string
  lastVisit: string
  recordsCount: number
  status: 'active' | 'inactive'
}

export function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPatients()
  }, [])

  const loadPatients = async () => {
    try {
      // Mock data - replace with actual database calls
      const mockPatients: Patient[] = [
        {
          id: '1',
          name: 'Ahmadjon Karimov',
          age: 45,
          gender: 'Erkak',
          phone: '+998 90 123 45 67',
          lastVisit: '2024-01-15',
          recordsCount: 5,
          status: 'active'
        },
        {
          id: '2',
          name: 'Malika Tosheva',
          age: 32,
          gender: 'Ayol',
          phone: '+998 91 234 56 78',
          lastVisit: '2024-01-14',
          recordsCount: 3,
          status: 'active'
        },
        {
          id: '3',
          name: 'Bobur Rahimov',
          age: 28,
          gender: 'Erkak',
          phone: '+998 93 345 67 89',
          lastVisit: '2024-01-10',
          recordsCount: 2,
          status: 'active'
        },
        {
          id: '4',
          name: 'Nodira Abdullayeva',
          age: 55,
          gender: 'Ayol',
          phone: '+998 94 456 78 90',
          lastVisit: '2023-12-20',
          recordsCount: 8,
          status: 'inactive'
        }
      ]
      
      setPatients(mockPatients)
    } catch (error) {
      console.error('Error loading patients:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bemorlar</h1>
          <p className="text-muted-foreground">
            Bemorlar ro'yxati va ularning ma'lumotlari
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Yangi bemor</span>
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Bemor nomi yoki telefon raqami bo'yicha qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Jami bemorlar</p>
                <p className="text-2xl font-bold">{patients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Faol bemorlar</p>
                <p className="text-2xl font-bold">
                  {patients.filter(p => p.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Jami yozuvlar</p>
                <p className="text-2xl font-bold">
                  {patients.reduce((sum, p) => sum + p.recordsCount, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Bugun</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patients List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{patient.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {patient.age} yosh, {patient.gender}
                    </p>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Tahrirlash
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      O'chirish
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Telefon:</span>
                  <span className="font-medium">{patient.phone}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">So'nggi tashrif:</span>
                  <span className="font-medium">{formatDate(patient.lastVisit)}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Yozuvlar soni:</span>
                  <Badge variant="secondary">{patient.recordsCount}</Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Holat:</span>
                  <Badge 
                    variant={patient.status === 'active' ? 'default' : 'secondary'}
                    className={patient.status === 'active' ? 'bg-green-500' : ''}
                  >
                    {patient.status === 'active' ? 'Faol' : 'Nofaol'}
                  </Badge>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button size="sm" className="flex-1">
                  <FileText className="w-4 h-4 mr-1" />
                  Yozuvlar
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Plus className="w-4 h-4 mr-1" />
                  Yangi
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Bemorlar topilmadi
            </h3>
            <p className="text-muted-foreground mb-4">
              Qidiruv shartlariga mos bemor topilmadi
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Yangi bemor qo'shish
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Mobile spacing */}
      <div className="md:hidden h-20"></div>
    </div>
  )
}