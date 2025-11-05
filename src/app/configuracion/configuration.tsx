'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { Layout } from "@/components"
import WhatsAppQRModal from '../../components/WhatsAppQRModal'

interface CuentaConectada {
    id: string
    plataforma: 'whatsapp' | 'facebook' | 'instagram' | 'telegram'
    nombreUsuario: string
    nombrePlataforma: string
    conectada: boolean
    fechaConexion?: string
    icono: string
    colorPlataforma: string
    webhook_url?: string
    api_token?: string
    configuracion_extra?: any
}

export default function ConfiguracionPage() {
    const [cuentas, setCuentas] = useState<CuentaConectada[]>([
        {
            id: '1',
            plataforma: 'whatsapp',
            nombreUsuario: 'WhatsApp Bot',
            nombrePlataforma: 'WhatsApp Business',
            conectada: false,
            icono: '/icons/whatsapp.png',
            colorPlataforma: 'bg-green-100'
        },
        {
            id: '2',
            plataforma: 'instagram',
            nombreUsuario: '@instagram_bot',
            nombrePlataforma: 'Instagram',
            conectada: false,
            icono: '/icons/instagram.png',
            colorPlataforma: 'bg-pink-100'
        },
        {
            id: '3',
            plataforma: 'facebook',
            nombreUsuario: 'Facebook Bot',
            nombrePlataforma: 'Facebook',
            conectada: false,
            icono: '/icons/facebook.png',
            colorPlataforma: 'bg-blue-100'
        },
        {
            id: '4',
            plataforma: 'telegram',
            nombreUsuario: '@telegram_bot',
            nombrePlataforma: 'Telegram',
            conectada: false,
            icono: '/icons/telegram.png',
            colorPlataforma: 'bg-blue-100'
        }
    ])
    
    const [loading, setLoading] = useState<string | null>(null)
    const [showWhatsAppQR, setShowWhatsAppQR] = useState(false)

    // Obtener estado real de los bots del backend
    useEffect(() => {
        const fetchBotsStatus = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/bots/status')
                if (response.ok) {
                    const status = await response.json()
                    
                    setCuentas(prev => prev.map(cuenta => {
                        let conectada = false
                        let fechaConexion = undefined
                        
                        if (cuenta.plataforma === 'whatsapp' && status.whatsapp.active) {
                            conectada = true
                            fechaConexion = new Date().toISOString()
                        } else if (cuenta.plataforma === 'instagram' && status.instagram.active) {
                            conectada = true
                            fechaConexion = new Date().toISOString()
                        } else if (cuenta.plataforma === 'facebook' && status.facebook.active) {
                            conectada = true
                            fechaConexion = new Date().toISOString()
                        } else if (cuenta.plataforma === 'telegram' && status.telegram.active) {
                            conectada = true
                            fechaConexion = new Date().toISOString()
                        }
                        
                        return { ...cuenta, conectada, fechaConexion }
                    }))
                }
            } catch (error) {
                console.error('Error obteniendo estado de bots:', error)
            }
        }

        fetchBotsStatus()
        const interval = setInterval(fetchBotsStatus, 5000)
        return () => clearInterval(interval)
    }, [])

    // Función para conectar/desconectar cuenta
    const toggleConexion = useCallback(async (id: string) => {
        const cuenta = cuentas.find(c => c.id === id)
        if (!cuenta) return

        // Para WhatsApp, mostrar modal con QR
        if (cuenta.plataforma === 'whatsapp' && !cuenta.conectada) {
            setShowWhatsAppQR(true)
            return
        }

        setLoading(id)
        
        try {
            const endpoint = cuenta.conectada 
                ? `/bots/${cuenta.plataforma}/stop` 
                : `/bots/${cuenta.plataforma}/start`
            
            const response = await fetch(`http://localhost:3001/api${endpoint}`, {
                method: 'POST'
            })

            if (response.ok) {
                // Actualizar estado después de un breve delay para que el backend se actualice
                setTimeout(async () => {
                    const statusResponse = await fetch('http://localhost:3001/api/bots/status')
                    if (statusResponse.ok) {
                        const status = await statusResponse.json()
                        
                        setCuentas(prev => prev.map(c => {
                            if (c.plataforma === cuenta.plataforma) {
                                const isActive = status[cuenta.plataforma]?.active || false
                                return {
                                    ...c,
                                    conectada: isActive,
                                    fechaConexion: isActive ? new Date().toISOString() : undefined
                                }
                            }
                            return c
                        }))
                    }
                    setLoading(null)
                }, 1000)
            } else {
                setLoading(null)
            }
        } catch (error) {
            console.error('Error al cambiar conexión:', error)
            setLoading(null)
        }
    }, [cuentas])

    const handleWhatsAppSuccess = useCallback(() => {
        // Actualizar estado cuando WhatsApp se conecte exitosamente
        setTimeout(async () => {
            const response = await fetch('http://localhost:3001/api/bots/status')
            if (response.ok) {
                const status = await response.json()
                setCuentas(prev => prev.map(c => {
                    if (c.plataforma === 'whatsapp') {
                        return {
                            ...c,
                            conectada: status.whatsapp.active,
                            fechaConexion: status.whatsapp.active ? new Date().toISOString() : undefined
                        }
                    }
                    return c
                }))
            }
        }, 2000)
    }, [])

    const formatearFecha = (fecha?: string) => {
        if (!fecha) return 'Nunca'
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const cuentasConectadas = cuentas.filter(cuenta => cuenta.conectada).length

    return (
        <Layout>
            <div className="p-6 bg-gray-100 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Conexiones de Redes Sociales</h1>
                    <p className="mb-6 text-gray-600">Gestiona las conexiones de tus redes sociales.</p>                    
                    {/* Resumen */}
                    <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-4 mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Estado de Conexiones</h2>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-600">{cuentasConectadas}</div>
                                <div className="text-sm text-gray-600">Conectadas</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-400">{cuentas.length - cuentasConectadas}</div>
                                <div className="text-sm text-gray-600">Disponibles</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600">{cuentas.length}</div>
                                <div className="text-sm text-gray-600">Total</div>
                            </div>
                        </div>
                    </div>

                    {/* Grid de Cuentas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {cuentas.map((cuenta) => (
                            <div 
                                key={cuenta.id}
                                className={`bg-white rounded-lg shadow-sm border-2 border-gray-200 p-6 ${cuenta.colorPlataforma} transition-all duration-200 hover:shadow-md`}
                            >
                                {/* Header de la tarjeta */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-12 h-12 ${cuenta.colorPlataforma} rounded-full flex items-center justify-center p-2 shadow-sm`}>
                                            <Image
                                                src={cuenta.icono}
                                                alt={cuenta.plataforma}
                                                width={24}
                                                height={24}
                                                className="w-6 h-6 object-contain"
                                            />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800">{cuenta.nombrePlataforma}</h3>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        cuenta.conectada 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {cuenta.conectada ? '🟢' : '🔴'}
                                    </span>
                                </div>

                                {/* Información de la cuenta */}
                                <div className="mb-4">
                                    <p className="text-gray-700 font-medium mb-1">{cuenta.nombreUsuario}</p>
                                    <p className="text-gray-500 text-sm">
                                        Última conexión: {formatearFecha(cuenta.fechaConexion)}
                                    </p>
                                            
                                    {/* Información técnica para cuentas conectadas */}
                                    {cuenta.conectada && (
                                        <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                                            <div className="grid grid-cols-1 gap-2 text-xs">
                                                <div>
                                                    <span className="font-medium text-gray-600">Webhook:</span>
                                                    <p className="text-gray-500 truncate font-mono">{cuenta.webhook_url}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-600">Token:</span>
                                                    <p className="text-gray-500 truncate font-mono">{cuenta.api_token}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Botones de acción */}
                                <div className="flex flex-col space-y-2">
                                    
                                    <button
                                        onClick={() => toggleConexion(cuenta.id)}
                                        disabled={loading === cuenta.id}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                                            cuenta.conectada 
                                                ? 'bg-white text-gray-600 hover:bg-red-200 border-2 border-gray-200 hover:border-red-200' 
                                                : 'bg-white text-gray-600 hover:bg-gray-200 border-2 border-gray-200'
                                        }`}
                                    >
                                        {loading === cuenta.id 
                                            ? '⏳ Procesando...' 
                                            : cuenta.conectada 
                                                ? 'Desconectar' 
                                                : ' + Conectar'
                                        }
                                    </button>
                                </div>

                                {/* Estado detallado para cuentas conectadas */}
                                {cuenta.conectada && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <div className="flex items-center justify-center space-x-4 text-xs">
                                            <div className="flex items-center space-x-1 text-green-600">
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                <span>Activo</span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-blue-600">
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <span>Webhook</span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-purple-600">
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                                </svg>
                                                <span>Sync</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="bg-blue-100 rounded-lg shadow-sm p-4 mb-4 mt-6">
                        <h3 className='font-bold mb-3'>¿Necesitas ayuda para conectar tus cuentas?</h3>
                        <p className='font-medium text-gray-600 mb-1'>Nuestro equipo puede ayudarte a configurar las integraciones con las redes sociales.</p>
                        <p className='font-medium text-gray-600 '>Contacta con el equipo de B&B a traves del boton de feedback para solicitar soporte con las integraciones de redes sociales.</p>
                        
                    </div>
                </div>
            </div>

            {/* Modal de WhatsApp QR */}
            <WhatsAppQRModal 
                isOpen={showWhatsAppQR}
                onClose={() => setShowWhatsAppQR(false)}
                onSuccess={handleWhatsAppSuccess}
            />
        </Layout>
    )
}