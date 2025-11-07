'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface BotConfig {
    enabled: boolean
    autoReply: boolean
    replyDelay: number
    typingSimulation: boolean
}

interface BotsConfig {
    whatsapp: BotConfig
    instagram: BotConfig
    telegram: BotConfig
    facebook: BotConfig
}

const platformsInfo = {
    whatsapp: {
        name: 'WhatsApp',
        icon: '/icons/whatsapp.png',
        color: 'bg-green-100',
        textColor: 'text-green-700',
        borderColor: 'border-green-200'
    },
    instagram: {
        name: 'Instagram',
        icon: '/icons/instagram.png',
        color: 'bg-pink-100',
        textColor: 'text-pink-700',
        borderColor: 'border-pink-200'
    },
    telegram: {
        name: 'Telegram',
        icon: '/icons/telegram.png',
        color: 'bg-blue-100',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200'
    },
    facebook: {
        name: 'Facebook',
        icon: '/icons/facebook.png',
        color: 'bg-blue-100',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200'
    }
}

export default function BotsConfigSection() {
    const [config, setConfig] = useState<BotsConfig>({
        whatsapp: { enabled: true, autoReply: true, replyDelay: 1500, typingSimulation: true },
        instagram: { enabled: true, autoReply: true, replyDelay: 2000, typingSimulation: true },
        telegram: { enabled: true, autoReply: true, replyDelay: 1000, typingSimulation: false },
        facebook: { enabled: false, autoReply: true, replyDelay: 1500, typingSimulation: true }
    })
    
    const [loading, setLoading] = useState(true)
    const [savingPlatform, setSavingPlatform] = useState<string | null>(null)
    const [messages, setMessages] = useState<Record<string, { type: 'success' | 'error', text: string }>>({})

    useEffect(() => {
        fetchConfig()
    }, [])

    const fetchConfig = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/config/bots-config')
            if (response.ok) {
                const data = await response.json()
                if (data.success) {
                    setConfig(data.config)
                }
            }
        } catch (error) {
            console.error('Error cargando configuración:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSavePlatform = async (platform: keyof BotsConfig) => {
        setSavingPlatform(platform)
        
        try {
            // Obtener config completa actual
            const response = await fetch('http://localhost:3001/api/config/bots-config')
            if (!response.ok) throw new Error('Error obteniendo config')
            
            const { config: currentConfig } = await response.json()
            
            // Actualizar solo la plataforma específica
            const updatedConfig = {
                ...currentConfig,
                [platform]: config[platform]
            }
            
            const saveResponse = await fetch('http://localhost:3001/api/config/bots-config', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ config: updatedConfig })
            })

            const data = await saveResponse.json()
            
            if (data.success) {
                setMessages(prev => ({
                    ...prev,
                    [platform]: { type: 'success', text: '✅ Guardado' }
                }))
                setTimeout(() => {
                    setMessages(prev => {
                        const newMessages = { ...prev }
                        delete newMessages[platform]
                        return newMessages
                    })
                }, 3000)
            } else {
                setMessages(prev => ({
                    ...prev,
                    [platform]: { type: 'error', text: '❌ Error al guardar' }
                }))
            }
        } catch (error) {
            console.error('Error guardando configuración:', error)
            setMessages(prev => ({
                ...prev,
                [platform]: { type: 'error', text: '❌ Error de conexión' }
            }))
        } finally {
            setSavingPlatform(null)
        }
    }

    const updateBotConfig = (platform: keyof BotsConfig, field: keyof BotConfig, value: any) => {
        setConfig(prev => ({
            ...prev,
            [platform]: {
                ...prev[platform],
                [field]: value
            }
        }))
    }

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-20 bg-gray-200 rounded"></div>
                        <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">⚙️ Configuración de Bots</h2>
                    <p className="text-sm text-gray-600 mt-1">Personaliza el comportamiento de cada bot por plataforma</p>
                </div>
            </div>

            <div className="space-y-4">
                {Object.entries(config).map(([platform, botConfig]) => {
                    const info = platformsInfo[platform as keyof typeof platformsInfo]
                    const platformMessage = messages[platform]
                    
                    return (
                        <div 
                            key={platform}
                            className={`border-2 ${info.borderColor} rounded-lg p-5 ${info.color} transition-all duration-200`}
                        >
                            {/* Mensaje de éxito/error por plataforma */}
                            {platformMessage && (
                                <div className={`mb-3 p-2 rounded text-sm ${
                                    platformMessage.type === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                                }`}>
                                    {platformMessage.text}
                                </div>
                            )}
                            
                            {/* Header del bot */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-10 h-10 ${info.color} rounded-full flex items-center justify-center p-2 shadow-sm`}>
                                        <Image
                                            src={info.icon}
                                            alt={info.name}
                                            width={24}
                                            height={24}
                                            className="w-6 h-6 object-contain"
                                        />
                                    </div>
                                    <h3 className={`text-lg font-bold ${info.textColor}`}>{info.name}</h3>
                                </div>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <span className="text-sm font-medium text-gray-700">Habilitado</span>
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={botConfig.enabled}
                                            onChange={(e) => updateBotConfig(platform as keyof BotsConfig, 'enabled', e.target.checked)}
                                            className="sr-only"
                                        />
                                        <div className={`block w-12 h-6 rounded-full ${botConfig.enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${botConfig.enabled ? 'transform translate-x-6' : ''}`}></div>
                                    </div>
                                </label>
                            </div>

                            {/* Configuración del bot */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white rounded-lg p-4">
                                {/* Auto-respuesta */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">🤖 Auto-respuesta</label>
                                        <p className="text-xs text-gray-500">Responder automáticamente</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={botConfig.autoReply}
                                        onChange={(e) => updateBotConfig(platform as keyof BotsConfig, 'autoReply', e.target.checked)}
                                        disabled={!botConfig.enabled}
                                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                                    />
                                </div>

                                {/* Delay de respuesta */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1">
                                        ⏱️ Retraso (ms)
                                    </label>
                                    <input
                                        type="number"
                                        min="500"
                                        max="5000"
                                        step="100"
                                        value={botConfig.replyDelay}
                                        onChange={(e) => updateBotConfig(platform as keyof BotsConfig, 'replyDelay', parseInt(e.target.value))}
                                        disabled={!botConfig.enabled}
                                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:bg-gray-100"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{(botConfig.replyDelay / 1000).toFixed(1)}s</p>
                                </div>

                                {/* Simulación de escritura */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">⌨️ "Escribiendo..."</label>
                                        <p className="text-xs text-gray-500">Simular escritura</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={botConfig.typingSimulation}
                                        onChange={(e) => updateBotConfig(platform as keyof BotsConfig, 'typingSimulation', e.target.checked)}
                                        disabled={!botConfig.enabled}
                                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                                    />
                                </div>
                            </div>
                            
                            {/* Botón guardar individual */}
                            <div className="mt-4 pt-4 border-t border-gray-300">
                                <button
                                    onClick={() => handleSavePlatform(platform as keyof BotsConfig)}
                                    disabled={savingPlatform === platform}
                                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {savingPlatform === platform ? '⏳ Guardando...' : '💾 Guardar ' + info.name}
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
