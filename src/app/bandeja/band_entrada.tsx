'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Layout } from "@/components"
import { MessageService, Chat as ApiChat } from '@/lib/apiService'

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
  platform: string
  platformIcon: string
  platformColor: string
  tags: string[]
  messages?: any[]
}

interface Message {
  id: string
  text: string
  timestamp: string
  sender: 'me' | 'other'
  status: 'sent' | 'delivered' | 'read'
}

export default function BandEntrada() {
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<string>('')
  const [newMessage, setNewMessage] = useState('')
  const [platformFilter, setPlatformFilter] = useState<string>('all')
  const [tagFilter, setTagFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Cargar conversaciones desde el backend
  useEffect(() => {
    const cargarConversaciones = async () => {
      try {
        const response = await MessageService.getConversaciones()
        
        console.log('Response from backend:', response)
        
        if (response.success && response.data && response.data.conversaciones) {
          const conversaciones = response.data.conversaciones
          console.log('Conversaciones recibidas:', conversaciones.length)
          
          setChats(conversaciones)
          
          // Seleccionar primera conversación si hay alguna
          if (conversaciones.length > 0 && !selectedChat) {
            setSelectedChat(conversaciones[0].id)
          }
        } else {
          setChats([])
        }
      } catch (error) {
        console.error('Error cargando conversaciones:', error)
        setChats([])
      } finally {
        setIsLoading(false)
      }
    }

    cargarConversaciones()
    
    // Actualizar cada 5 segundos
    const interval = setInterval(cargarConversaciones, 5000)
    return () => clearInterval(interval)
  }, [selectedChat])

  const currentChat = chats.find(chat => chat.id === selectedChat)
  const currentMessages = currentChat?.messages || []
  
  // Función para filtrar chats con etiquetas
  const getFilteredChats = () => {
    let filtered = chats

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
  const handleSendMessage = async () => {
    if (newMessage.trim() && currentChat) {
      const mensajeAEnviar = newMessage.trim()
      setNewMessage('') // Limpiar input inmediatamente
      
      try {
        const response = await fetch('http://localhost:3001/api/enviar-mensaje', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            platform: currentChat.platform,
            chatId: currentChat.id,
            texto: mensajeAEnviar
          })
        })

        const data = await response.json()
        
        if (data.success) {
          console.log('✅ Mensaje enviado exitosamente')
          // El mensaje se agregará automáticamente cuando el backend lo guarde y el polling lo detecte
        } else {
          console.error('❌ Error enviando mensaje:', data.error)
          alert(`Error: ${data.error}`)
          setNewMessage(mensajeAEnviar) // Restaurar mensaje si falló
        }
      } catch (error) {
        console.error('❌ Error de red:', error)
        alert('Error de conexión con el servidor')
        setNewMessage(mensajeAEnviar) // Restaurar mensaje si falló
      }
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
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p>Cargando conversaciones...</p>
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-lg font-medium">No hay conversaciones</p>
                <p className="text-sm mt-2">Conecta tus bots para recibir mensajes</p>
              </div>
            ) : (
              filteredChats.map((chat) => (
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
              ))
            )}
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
                {currentMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <div className="text-5xl mb-3">💬</div>
                      <p className="text-lg">No hay mensajes aún</p>
                      <p className="text-sm mt-2">Los mensajes aparecerán aquí cuando lleguen</p>
                    </div>
                  </div>
                ) : (
                  currentMessages.map((message: any) => (
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
                  ))
                )}
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