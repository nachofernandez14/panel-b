'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Layout } from "@/components"

interface Tag {
  id: string
  name: string
  color: string
  description: string
}

// Etiquetas estáticas (locales a este componente)
const etiquetasEstaticas: Tag[] = [
  { 
    id: '1', 
    name: 'Cliente Potencial', 
    color: 'bg-green-200', 
    description: 'Contactos que muestran interés en nuestros productos/servicios' 
  },
  { 
    id: '2', 
    name: 'Venta Cerrada', 
    color: 'bg-blue-200', 
    description: 'Clientes que han completado una compra exitosamente' 
  },
  { 
    id: '3', 
    name: 'Urgente', 
    color: 'bg-red-200', 
    description: 'Conversaciones que requieren atención inmediata' 
  },
  { 
    id: '4', 
    name: 'Seguimiento', 
    color: 'bg-yellow-200', 
    description: 'Contactos que necesitan seguimiento posterior' 
  },
  { 
    id: '5', 
    name: 'Soporte Técnico', 
    color: 'bg-purple-200', 
    description: 'Consultas relacionadas con problemas técnicos' 
  },
  { 
    id: '6', 
    name: 'Cotización', 
    color: 'bg-orange-200', 
    description: 'Solicitudes de presupuestos y cotizaciones' 
  }
]

// Función helper local para obtener etiquetas por IDs
const getTagsByIds = (ids: string[]): Tag[] => {
  return etiquetasEstaticas.filter(tag => ids.includes(tag.id))
}

interface Chat {
  id: string
  name: string
  lastMessage: string
  timestamp: string
  avatar: string
  unreadCount: number
  isOnline: boolean
  platform: 'whatsapp' | 'instagram' | 'facebook' | 'telegram'
  platformIcon: string
  platformColor: string
  tags: string[]
}

interface Message {
  id: string
  text: string
  timestamp: string
  sender: 'me' | 'other'
  status: 'sent' | 'delivered' | 'read'
}

const mockChats: Chat[] = [
  {
    id: '1',
    name: 'María García',
    lastMessage: 'Hola, ¿cómo estás?',
    timestamp: '10:30',
    avatar: '👩‍💼',
    unreadCount: 2,
    isOnline: true,
    platform: 'whatsapp',
    platformIcon: '/icons/whatsapp.png',
    platformColor: 'bg-white',
    tags: ['1'] // Cliente Potencial
  },
  {
    id: '2',
    name: 'Carlos López',
    lastMessage: 'Perfecto, nos vemos mañana',
    timestamp: '09:15',
    avatar: '👨‍💻',
    unreadCount: 0,
    isOnline: false,
    platform: 'instagram',
    platformIcon: '/icons/instagram.png',
    platformColor: 'bg-white',
    tags: ['2'] // Venta Cerrada
  },
  {
    id: '3',
    name: 'Ana Martínez',
    lastMessage: 'Gracias por la información',
    timestamp: 'Ayer',
    avatar: '👩‍🎨',
    unreadCount: 1,
    isOnline: true,
    platform: 'facebook',
    platformIcon: '/icons/facebook.png',
    platformColor: 'bg-white',
    tags: ['4'] // Seguimiento
  },
  {
    id: '4',
    name: 'Pedro Rodríguez',
    lastMessage: '¿Tienes el reporte listo?',
    timestamp: 'Ayer',
    avatar: '👨‍🔧',
    unreadCount: 0,
    isOnline: false,
    platform: 'telegram',
    platformIcon: '/icons/telegram.png',
    platformColor: 'bg-white',
    tags: ['5'] // Soporte Técnico
  }
]

const mockMessages: { [chatId: string]: Message[] } = {
  '1': [
    { id: '1', text: 'Hola, ¿cómo estás?', timestamp: '10:25', sender: 'other', status: 'read' },
    { id: '2', text: '¿Tienes tiempo para una reunión?', timestamp: '10:30', sender: 'other', status: 'delivered' }
  ],
  '2': [
    { id: '1', text: 'Me gusta tu última publicación 📷', timestamp: '09:10', sender: 'other', status: 'read' },
    { id: '2', text: 'Perfecto, nos vemos mañana', timestamp: '09:15', sender: 'other', status: 'read' }
  ],
  '3': [
    { id: '1', text: 'Te envío la información solicitada', timestamp: 'Ayer', sender: 'me', status: 'read' },
    { id: '2', text: 'Gracias por la información', timestamp: 'Ayer', sender: 'other', status: 'read' }
  ],
  '4': [
    { id: '1', text: '¿Tienes el reporte listo?', timestamp: 'Ayer', sender: 'other', status: 'read' }
  ]
}

export default function BandEntrada() {
  const [selectedChat, setSelectedChat] = useState<string>('1')
  const [newMessage, setNewMessage] = useState('')
  const [platformFilter, setPlatformFilter] = useState<'all' | 'whatsapp' | 'instagram' | 'facebook' | 'telegram'>('all')
  const [tagFilter, setTagFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('') // ✅ Nuevo estado para búsqueda

  const currentChat = mockChats.find(chat => chat.id === selectedChat)
  const currentMessages = mockMessages[selectedChat] || []
  
  // Función para filtrar chats con etiquetas
  const getFilteredChats = () => {
    let filtered = mockChats

    // Filtro por termino de busqueda
    if(searchTerm.trim()){
      filtered = filtered.filter(chat => 
        chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por plataforma
    if (platformFilter !== 'all') {
      filtered = filtered.filter(chat => chat.platform === platformFilter)
    }

    // Filtro por etiqueta
    if (tagFilter !== 'all') {
      filtered = filtered.filter(chat => chat.tags.includes(tagFilter))
    }

    return filtered
  }

  const filteredChats = getFilteredChats()

  const clearSearch = () => {
    setSearchTerm('')
  }
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Aquí agregarías la lógica para enviar el mensaje
      console.log('Enviando mensaje:', newMessage)
      setNewMessage('')
    }
  }

  return (
    <Layout>
      <div className="flex h-screen bg-white">
        {/* Lista de Chats - Sidebar Izquierdo */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col bg-white">
          {/* Header de la lista de chats */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
            <div className="mt-2 space-y-2">
              {/* ✅ Input de búsqueda mejorado */}
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar conversaciones..."
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {/* Botón para limpiar búsqueda */}
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setPlatformFilter('all')
                    setTagFilter('all')
                  }}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Todas
                </button>
                
                {/* Select con icono de filtro */}
                <div className="relative flex items-center">
                  <Image
                    src="/icons/filter.png"
                    alt="Filter"
                    width={16}
                    height={16}
                    className="absolute left-2 w-4 h-4 text-gray-400 pointer-events-none z-10"
                  />
                  <select 
                    value={tagFilter}
                    onChange={(e) => setTagFilter(e.target.value)}
                    className="pl-7 pr-6 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  >
                    <option value="all">Todas las Etiquetas</option>
                    {etiquetasEstaticas.map(tag => (
                      <option key={tag.id} value={tag.id}>
                        {tag.name}
                      </option>
                    ))}
                  </select>
                  {/* Flecha del select */}
                  <svg 
                    className="absolute right-2 w-4 h-4 text-gray-400 pointer-events-none" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {/* Mostrar filtros activos */}
              {(platformFilter !== 'all' || tagFilter !== 'all') && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {platformFilter !== 'all' && (
                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded capitalize">
                      {platformFilter}
                    </span>
                  )}
                  {tagFilter !== 'all' && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                      {etiquetasEstaticas.find(t => t.id === tagFilter)?.name}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Lista de chats */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors shadow-sm ${
                  selectedChat === chat.id ? 'bg-blue-100 border-blue-500' : 'bg-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl">
                      {chat.avatar}
                    </div>
                    {/* Badge de la plataforma */}
                    <div className={`absolute -top-1 -left-1 w-6 h-6 ${chat.platformColor} rounded-full flex items-center justify-center p-0.5`}>
                      <Image
                        src={chat.platformIcon}
                        alt={chat.platform}
                        width={20}
                        height={20}
                        className="w-5 h-5 object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900 truncate">{chat.name}</h3>
                        <span className="text-xs text-gray-400 capitalize">
                          {chat.platform}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{chat.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-1">{chat.lastMessage}</p>
                    
                    {/* Mostrar etiquetas del chat */}
                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                      {getTagsByIds(chat.tags).slice(0, 2).map(tag => (
                        <span 
                          key={tag.id}
                          className={`px-2 py-1 text-xs rounded text-gray-800 ${tag.color}`}
                        >
                          {tag.name}
                        </span>
                      ))}
                      {getTagsByIds(chat.tags).length > 2 && (
                        <span className="text-xs text-gray-500">+{getTagsByIds(chat.tags).length - 2}</span>
                      )}
                    </div>
                  </div>
                  {chat.unreadCount > 0 && (
                    <div className="bg-blue-500 text-white text-sm font-medium rounded-xl px-3 py-1 min-w-[24px] flex items-center justify-center">
                      {chat.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area - Lado Derecho */}
        <div className="flex-1 flex flex-col">
          {currentChat ? (
            <>
              {/* Header del chat activo */}
              <div className="p-4 bg-gray-200 border-b border-gray-300 flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {currentChat.avatar}
                  </div>
                  <div className={`absolute -top-1 -left-1 w-5 h-5 ${currentChat.platformColor} rounded-full flex items-center justify-center p-0.5`}>
                    <Image
                      src={currentChat.platformIcon}
                      alt={currentChat.platform}
                      width={16}
                      height={16}
                      className="w-4 h-4 object-contain"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900">{currentChat.name}</h3>
                    
                  </div>
                  
                  {/* Mostrar etiquetas del chat activo */}
                  <div className="flex items-center gap-1 mt-1 flex-wrap">
                    {getTagsByIds(currentChat.tags).map(tag => (
                      <span 
                        key={tag.id}
                        className={`px-2 py-1 text-xs rounded text-gray-800 ${tag.color}`}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Información adicional de la plataforma */}
                <div className="text-right">
                  <p className="text-xs text-gray-500">Conversación desde</p>
                  <p className="text-sm font-medium text-gray-700 capitalize">{currentChat.platform}</p>
                </div>
              </div>

              {/* Área de mensajes */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100">
                {currentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'me'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <p>{message.text}</p>
                      <div className={`text-xs mt-1 ${
                        message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp}
                        {message.sender === 'me' && (
                          <span className="ml-1">
                            {message.status === 'sent' && '✓'}
                            {message.status === 'delivered' && '✓✓'}
                            {message.status === 'read' && '✓✓'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input para escribir mensajes */}
              <div className="p-4 border-t border-gray-200 bg-gray-100">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  Selecciona una conversación
                </h3>
                <p className="text-gray-600">
                  Elige un chat de la lista para comenzar a conversar
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}