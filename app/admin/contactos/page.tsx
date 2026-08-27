'use client'

import { useState, useEffect } from 'react'
import { 
  MessageSquare, 
  Search, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Eye,
  Trash2,
  Loader2,
  CheckCircle,
  Clock,
  X
} from 'lucide-react'

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  city: string | null
  service: { title: string } | null
  message: string
  source_url: string | null
  is_read: boolean
  is_contacted: boolean
  notes: string | null
  created_at: string
  contact_type?: string | null
  company?: string | null
  referral_source?: string | null
}

export default function ContactosPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread' | 'contacted'>('all')
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    try {
      const response = await fetch('/api/admin/contacts')
      const data = await response.json()
      if (data.success) {
        setContacts(data.contacts)
      }
    } catch (error) {
      console.error('Error cargando contactos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_read: true }),
      })
      
      setContacts(contacts.map(c => 
        c.id === id ? { ...c, is_read: true } : c
      ))
    } catch (error) {
      console.error('Error marcando como leído:', error)
    }
  }

  const markAsContacted = async (id: string) => {
    try {
      await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_contacted: true }),
      })
      
      setContacts(contacts.map(c => 
        c.id === id ? { ...c, is_contacted: true } : c
      ))
    } catch (error) {
      console.error('Error marcando como contactado:', error)
    }
  }

  const deleteContact = async (id: string) => {
    if (!confirm('¿Eliminar este contacto?')) return
    
    try {
      await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' })
      setContacts(contacts.filter(c => c.id !== id))
      if (selectedContact?.id === id) setSelectedContact(null)
    } catch (error) {
      console.error('Error eliminando contacto:', error)
    }
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' 
      || (filter === 'unread' && !contact.is_read)
      || (filter === 'contacted' && contact.is_contacted)
    return matchesSearch && matchesFilter
  })

  const unreadCount = contacts.filter(c => !c.is_read).length

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal flex items-center gap-2">
          <MessageSquare className="w-7 h-7 text-gold" />
          Contactos
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
              {unreadCount} sin leer
            </span>
          )}
        </h1>
        <p className="text-gray-600 mt-1">
          Gestiona los leads y solicitudes de contacto
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-charcoal text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todos ({contacts.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'unread' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Sin leer ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('contacted')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'contacted' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Contactados
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contacts List */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No hay contactos</p>
            </div>
          ) : (
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => {
                    setSelectedContact(contact)
                    if (!contact.is_read) markAsRead(contact.id)
                  }}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedContact?.id === contact.id 
                      ? 'bg-gold/10' 
                      : 'hover:bg-gray-50'
                  } ${!contact.is_read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {!contact.is_read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      )}
                      <div>
                        <p className={`font-medium ${!contact.is_read ? 'text-charcoal' : 'text-gray-700'}`}>
                          {contact.name}
                        </p>
                        <p className="text-sm text-gray-500">{contact.email}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {contact.service?.title || 'Sin especificar'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-gray-400">
                        {new Date(contact.created_at).toLocaleDateString('es-ES')}
                      </p>
                      {contact.is_contacted && (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-1">
                          <CheckCircle className="w-3 h-3" />
                          Contactado
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Detail */}
        <div className="bg-white rounded-lg shadow-sm">
          {selectedContact ? (
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-charcoal text-lg">
                  {selectedContact.name}
                </h3>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <a 
                  href={`mailto:${selectedContact.email}`}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gold"
                >
                  <Mail className="w-4 h-4" />
                  {selectedContact.email}
                </a>
                {selectedContact.phone && (
                  <a 
                    href={`tel:${selectedContact.phone}`}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gold"
                  >
                    <Phone className="w-4 h-4" />
                    {selectedContact.phone}
                  </a>
                )}
                {selectedContact.city && (
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {selectedContact.city}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  Tipo: {selectedContact.contact_type === 'professional' ? 'Profesional' : 'Particular'}
                </p>
                {selectedContact.company && (
                  <p className="text-sm text-gray-600">Empresa: {selectedContact.company}</p>
                )}
                {selectedContact.referral_source && (
                  <p className="text-sm text-gray-600">Origen: {selectedContact.referral_source}</p>
                )}
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {new Date(selectedContact.created_at).toLocaleString('es-ES')}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Mensaje</h4>
                <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                  {selectedContact.message}
                </div>
              </div>

              {selectedContact.source_url && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Origen</h4>
                  <p className="text-xs text-gray-500 truncate">
                    {selectedContact.source_url}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                {!selectedContact.is_contacted && (
                  <button
                    onClick={() => markAsContacted(selectedContact.id)}
                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Marcar como contactado
                  </button>
                )}
                <button
                  onClick={() => deleteContact(selectedContact.id)}
                  className="w-full px-4 py-2 border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full py-12 text-gray-500">
              <div className="text-center">
                <Eye className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Selecciona un contacto</p>
                <p className="text-sm">para ver los detalles</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
