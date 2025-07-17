import { useState, useEffect } from 'react'
import { 
  Search, 
  Plus, 
  FileText, 
  Copy,
  Edit,
  Trash2,
  MoreVertical,
  Star,
  Clock
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'

interface Template {
  id: string
  title: string
  category: string
  mkbCode: string
  content: string
  isFavorite: boolean
  usageCount: number
  lastUsed: string
  createdAt: string
}

export function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      // Mock data - replace with actual database calls
      const mockTemplates: Template[] = [
        {
          id: '1',
          title: 'Yurak aritmiyasi',
          category: 'Kardiologiya',
          mkbCode: 'I49.9',
          content: `**Shikoyatlar:**
Yurak urishi tartibsizligi, ko'krak qafasida og'riq

**Anamnez:**
3 kun oldin boshlanган yurak urishi tartibsizligi

**Ko'rik natijalari:**
Yurak tovushlari aritmik, boshqa organlar normal

**Tahlil natijalari:**
EKG: aritmiya belgilari

**Xulosa (MKB-10 kodi bilan):**
Yurak aritmiyasi (I49.9)

**Tavsiyalar:**
Antiaritmik dorilar, kardiomonitoring

**Terapevt imzo joyi:**
_________________`,
          isFavorite: true,
          usageCount: 12,
          lastUsed: '2024-01-15',
          createdAt: '2024-01-01'
        },
        {
          id: '2',
          title: 'Bronxit',
          category: 'Pulmonologiya',
          mkbCode: 'J20.9',
          content: `**Shikoyatlar:**
Yo'tal, balgam chiqarish, nafas qisilishi

**Anamnez:**
5 kun oldin sovuqdan keyin boshlanган

**Ko'rik natijalari:**
O'pkada xirillash eshitiladi

**Tahlil natijalari:**
Qon tahlili: leykositoz

**Xulosa (MKB-10 kodi bilan):**
O'tkir bronxit (J20.9)

**Tavsiyalar:**
Antibiotiklar, ekspektorantlar, ko'p suyuqlik ichish

**Terapevt imzo joyi:**
_________________`,
          isFavorite: false,
          usageCount: 8,
          lastUsed: '2024-01-14',
          createdAt: '2024-01-02'
        },
        {
          id: '3',
          title: 'Gastrit',
          category: 'Gastroenterologiya',
          mkbCode: 'K29.7',
          content: `**Shikoyatlar:**
Oshqozon og'rig'i, ko'ngil aynishi

**Anamnez:**
Noto'g'ri ovqatlanish natijasida

**Ko'rik natijalari:**
Epigastriy sohada og'riq

**Tahlil natijalari:**
Gastroskopiya: gastrit belgilari

**Xulosa (MKB-10 kodi bilan):**
Gastrit (K29.7)

**Tavsiyalar:**
Dieta, antasidlar, proton pompasi inhibitorlari

**Terapevt imzo joyi:**
_________________`,
          isFavorite: true,
          usageCount: 15,
          lastUsed: '2024-01-13',
          createdAt: '2024-01-03'
        }
      ]
      
      setTemplates(mockTemplates)
    } catch (error) {
      console.error('Error loading templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))]

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.mkbCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const favoriteTemplates = templates.filter(t => t.isFavorite)
  const recentTemplates = templates.sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime()).slice(0, 5)

  const toggleFavorite = (templateId: string) => {
    setTemplates(prev => prev.map(t => 
      t.id === templateId ? { ...t, isFavorite: !t.isFavorite } : t
    ))
  }

  const copyTemplate = (template: Template) => {
    navigator.clipboard.writeText(template.content)
    // Show toast notification
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
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
          <h1 className="text-3xl font-bold text-foreground">Diagnoz shablonlari</h1>
          <p className="text-muted-foreground">
            Tayyor diagnoz shablonlari va MKB-10 kodlari
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Yangi shablon</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Shablon nomi, MKB kodi yoki kategoriya bo'yicha qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'Barchasi' : category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Templates Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Barcha shablonlar</TabsTrigger>
          <TabsTrigger value="favorites">Sevimlilar</TabsTrigger>
          <TabsTrigger value="recent">So'nggi ishlatilgan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <TemplateCard 
                key={template.id} 
                template={template} 
                onToggleFavorite={toggleFavorite}
                onCopy={copyTemplate}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="favorites" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteTemplates.map((template) => (
              <TemplateCard 
                key={template.id} 
                template={template} 
                onToggleFavorite={toggleFavorite}
                onCopy={copyTemplate}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="recent" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentTemplates.map((template) => (
              <TemplateCard 
                key={template.id} 
                template={template} 
                onToggleFavorite={toggleFavorite}
                onCopy={copyTemplate}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Shablonlar topilmadi
            </h3>
            <p className="text-muted-foreground mb-4">
              Qidiruv shartlariga mos shablon topilmadi
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Yangi shablon yaratish
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Mobile spacing */}
      <div className="md:hidden h-20"></div>
    </div>
  )
}

interface TemplateCardProps {
  template: Template
  onToggleFavorite: (id: string) => void
  onCopy: (template: Template) => void
}

function TemplateCard({ template, onToggleFavorite, onCopy }: TemplateCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center space-x-2">
              <span>{template.title}</span>
              {template.isFavorite && (
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              )}
            </CardTitle>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary">{template.category}</Badge>
              <Badge variant="outline">{template.mkbCode}</Badge>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onToggleFavorite(template.id)}>
                <Star className="w-4 h-4 mr-2" />
                {template.isFavorite ? 'Sevimlilardan olib tashlash' : 'Sevimlilarga qo\'shish'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onCopy(template)}>
                <Copy className="w-4 h-4 mr-2" />
                Nusxalash
              </DropdownMenuItem>
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
        <div className="text-sm text-muted-foreground line-clamp-3">
          {template.content.split('\n').slice(0, 3).join('\n')}...
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>So'nggi: {formatDate(template.lastUsed)}</span>
          </div>
          <span>{template.usageCount} marta ishlatilgan</span>
        </div>
        
        <div className="flex space-x-2 pt-2">
          <Button size="sm" className="flex-1">
            <FileText className="w-4 h-4 mr-1" />
            Ishlatish
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onCopy(template)}
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}