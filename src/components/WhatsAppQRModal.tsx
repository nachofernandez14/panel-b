'use client'

import { useEffect, useState } from 'react'
import { apiService } from '../lib/apiService'

interface WhatsAppQRModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function WhatsAppQRModal({ isOpen, onClose, onSuccess }: WhatsAppQRModalProps) {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [eventSource, setEventSource] = useState<EventSource | null>(null)

  useEffect(() => {
    if (isOpen && !eventSource) {
      setQrCode(null)
      setIsConnected(false)
      setLoading(true)
      setError(null)

      const source = apiService.bot.createWhatsAppQRStream()
      
      source.onmessage = (event) => {
        const data = JSON.parse(event.data)
        
        if (data.error) {
          setError(data.error)
          setLoading(false)
          source.close()
          return
        }

        setQrCode(data.qr)
        setIsConnected(data.connected)
        
        if (data.connected) {
          setLoading(false)
          source.close()
        }
      }

      source.onerror = () => {
        setError('Error de conexión')
        setLoading(false)
        source.close()
      }

      setEventSource(source)
    }

    return () => {
      if (eventSource) {
        eventSource.close()
        setEventSource(null)
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (isConnected) {
      if (onSuccess) {
        onSuccess()
      }
      
      const timer = setTimeout(() => {
        onClose()
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [isConnected, onSuccess, onClose])

  const handleClose = () => {
    if (eventSource) {
      eventSource.close()
      setEventSource(null)
    }
    onClose()
  }

  const handleRetry = () => {
    if (eventSource) {
      eventSource.close()
      setEventSource(null)
    }
    
    setQrCode(null)
    setIsConnected(false)
    setLoading(true)
    setError(null)

    setTimeout(() => {
      const source = apiService.bot.createWhatsAppQRStream()
      
      source.onmessage = (event) => {
        const data = JSON.parse(event.data)
        
        if (data.error) {
          setError(data.error)
          setLoading(false)
          source.close()
          return
        }

        setQrCode(data.qr)
        setIsConnected(data.connected)
        
        if (data.connected) {
          setLoading(false)
          source.close()
        }
      }

      source.onerror = () => {
        setError('Error de conexión')
        setLoading(false)
        source.close()
      }

      setEventSource(source)
    }, 100)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            📱 Conectar WhatsApp
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="text-center">
          {loading && !qrCode && !isConnected && (
            <div className="py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Generando código QR...</p>
            </div>
          )}

          {error && (
            <div className="py-4">
              <div className="text-red-500 text-4xl mb-2">❌</div>
              <p className="text-red-600 mb-4">Error: {error}</p>
              <button
                onClick={handleRetry}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Reintentar
              </button>
            </div>
          )}

          {qrCode && !isConnected && (
            <div className="py-4">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4">
                <img
                  src={qrCode}
                  alt="Código QR de WhatsApp"
                  className="mx-auto max-w-full h-auto"
                  style={{ maxWidth: '256px', maxHeight: '256px' }}
                />
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="font-medium">📲 Sigue estos pasos:</p>
                <ol className="text-left space-y-1">
                  <li>1. Abre WhatsApp en tu teléfono</li>
                  <li>2. Toca Menú o Configuración</li>
                  <li>3. Toca "Dispositivos vinculados"</li>
                  <li>4. Toca "Vincular un dispositivo"</li>
                  <li>5. Apunta tu teléfono a esta pantalla para escanear el código</li>
                </ol>
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700 text-xs">
                  ⏱️ El código QR se actualiza automáticamente cada pocos segundos
                </p>
              </div>
            </div>
          )}

          {isConnected && (
            <div className="py-8">
              <div className="text-green-500 text-4xl mb-2">✅</div>
              <p className="text-green-600 font-medium mb-2">¡Conectado exitosamente!</p>
              <p className="text-gray-600 text-sm">WhatsApp Bot está listo para usar</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={handleClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}