'use client'

import { useState, useEffect } from 'react'
import { Layout } from "@/components"
import Image from 'next/image'

interface HumanAgent {
    id: string
    name: string
    email: string
    avatar?: string
    isActive: boolean
    chatsAssigned: number
    responseTime: number // en minutos
    availability: 'available' | 'busy' | 'offline'
}

interface TransferRule {
    id: string
    name: string
    condition: 'keyword' | 'sentiment' | 'time' | 'manual'
    value: string
    enabled: boolean
    priority: number
}

export default function HumanAgentConfigPage() {
    const [agents, setAgents] = useState<HumanAgent[]>([])
    const [transferRules, setTransferRules] = useState<TransferRule[]>([])
    const [autoTransfer, setAutoTransfer] = useState(true)
    const [notifyAgents, setNotifyAgents] = useState(true)
    const [maxChatsPerAgent, setMaxChatsPerAgent] = useState(5)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    useEffect(() => {
        fetchConfig()
    }, [])

    const fetchConfig = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/config/human-agent-config')
            if (response.ok) {
                const data = await response.json()
                if (data.success && data.config) {
                    setAutoTransfer(data.config.autoTransfer ?? true)
                    setNotifyAgents(data.config.notifyAgents ?? true)
                    setMaxChatsPerAgent(data.config.maxChatsPerAgent ?? 5)
                    setAgents(data.config.agents || [])
                    setTransferRules(data.config.transferRules || [])
                }
            }
        } catch (error) {
            console.error('Error cargando configuración:', error)
        } finally {
            setLoading(false)
        }
    }

    const saveConfig = async () => {
        setSaving(true)
        setMessage(null)
        
        try {
            const config = {
                autoTransfer,
                notifyAgents,
                maxChatsPerAgent,
                agents,
                transferRules
            }

            const response = await fetch('http://localhost:3001/api/config/human-agent-config', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ config })
            })

            const data = await response.json()
            
            if (data.success) {
                setMessage({ type: 'success', text: '✅ Configuración guardada correctamente' })
                setTimeout(() => setMessage(null), 3000)
            } else {
                setMessage({ type: 'error', text: '❌ Error al guardar configuración' })
            }
        } catch (error) {
            console.error('Error guardando configuración:', error)
            setMessage({ type: 'error', text: '❌ Error de conexión' })
        } finally {
            setSaving(false)
        }
    }

    const toggleRule = (id: string) => {
        setTransferRules(prev =>
            prev.map(rule =>
                rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
            )
        )
        // Auto-guardar después de cambiar
        setTimeout(() => saveConfig(), 500)
    }

    const handleAutoTransferChange = (value: boolean) => {
        setAutoTransfer(value)
        setTimeout(() => saveConfig(), 500)
    }

    const handleNotifyAgentsChange = (value: boolean) => {
        setNotifyAgents(value)
        setTimeout(() => saveConfig(), 500)
    }

    const handleMaxChatsChange = (value: number) => {
        setMaxChatsPerAgent(value)
        setTimeout(() => saveConfig(), 1000)
    }

    if (loading) {
        return (
            <Layout>
                <div className="p-6 bg-gray-100 min-h-screen">
                    <div className="max-w-4xl mx-auto">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                            <div className="space-y-4">
                                <div className="h-40 bg-gray-200 rounded"></div>
                                <div className="h-40 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }

    const getAvailabilityColor = (availability: HumanAgent['availability']) => {
        switch (availability) {
            case 'available':
                return 'bg-green-500'
            case 'busy':
                return 'bg-yellow-500'
            case 'offline':
                return 'bg-gray-500'
            default:
                return 'bg-gray-500'
        }
    }

    const getAvailabilityText = (availability: HumanAgent['availability']) => {
        switch (availability) {
            case 'available':
                return 'Disponible'
            case 'busy':
                return 'Ocupado'
            case 'offline':
                return 'Desconectado'
            default:
                return 'Desconocido'
        }
    }

    return (
        <Layout>
            <div className="p-6 bg-gray-100 min-h-screen">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">👤 Agentes Humanos</h1>
                        <p className="text-gray-600">Gestiona la transferencia de chats a agentes humanos</p>
                    </div>

                    {/* Mensaje de éxito/error */}
                    {message && (
                        <div className={`mb-4 p-4 rounded-lg ${
                            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                            {message.text}
                        </div>
                    )}

                    {/* Configuración General */}
                    <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">⚙️ Configuración General</h2>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <h3 className="font-semibold text-gray-800">Transferencia Automática</h3>
                                    <p className="text-sm text-gray-600">Transferir chats automáticamente según reglas</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={autoTransfer}
                                        onChange={(e) => handleAutoTransferChange(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <h3 className="font-semibold text-gray-800">Notificar Agentes</h3>
                                    <p className="text-sm text-gray-600">Enviar notificación cuando se asigna un chat</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifyAgents}
                                        onChange={(e) => handleNotifyAgentsChange(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <label className="block font-semibold text-gray-800 mb-2">
                                    Máximo de Chats por Agente
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={maxChatsPerAgent}
                                    onChange={(e) => handleMaxChatsChange(parseInt(e.target.value))}
                                    className="w-32 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                />
                                <p className="text-sm text-gray-600 mt-2">
                                    Número máximo de conversaciones simultáneas por agente
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Lista de Agentes */}
                    <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-800">👥 Agentes Activos</h2>
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                                + Agregar Agente
                            </button>
                        </div>

                        <div className="space-y-3">
                            {agents.map((agent) => (
                                <div
                                    key={agent.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                {agent.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className={`absolute bottom-0 right-0 w-4 h-4 ${getAvailabilityColor(agent.availability)} border-2 border-white rounded-full`}></div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{agent.name}</h3>
                                            <p className="text-sm text-gray-600">{agent.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-6">
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">Estado</p>
                                            <p className="font-medium text-gray-800">{getAvailabilityText(agent.availability)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">Chats</p>
                                            <p className="font-medium text-gray-800">{agent.chatsAssigned}/{maxChatsPerAgent}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">Tiempo Resp.</p>
                                            <p className="font-medium text-gray-800">{agent.responseTime} min</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reglas de Transferencia */}
                    <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-800">🔄 Reglas de Transferencia</h2>
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                                + Nueva Regla
                            </button>
                        </div>

                        <div className="space-y-3">
                            {transferRules.map((rule) => (
                                <div
                                    key={rule.id}
                                    className={`p-4 rounded-lg border-2 ${
                                        rule.enabled ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={rule.enabled}
                                                    onChange={() => toggleRule(rule.id)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                            </label>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{rule.name}</h3>
                                                <p className="text-sm text-gray-600">
                                                    Condición: <span className="font-mono bg-gray-200 px-2 py-1 rounded">{rule.condition}</span>
                                                    {rule.value && ` → ${rule.value}`}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600">Prioridad: {rule.priority}</span>
                                            <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                                                ⚙️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info adicional */}
                    <div className="bg-blue-100 rounded-lg shadow-sm p-4">
                        <h3 className='font-bold mb-3'>💡 ¿Cómo funciona la transferencia?</h3>
                        <div className='space-y-2'>
                            <p className='font-medium text-gray-700'>
                                <span className="font-bold">1. Detección:</span> El sistema detecta cuando se cumple una regla (palabra clave, sentimiento negativo, etc.)
                            </p>
                            <p className='font-medium text-gray-700'>
                                <span className="font-bold">2. Asignación:</span> El chat se asigna automáticamente al agente con menos carga
                            </p>
                            <p className='font-medium text-gray-700'>
                                <span className="font-bold">3. Notificación:</span> El agente recibe una notificación para tomar el control
                            </p>
                            <p className='font-medium text-gray-700'>
                                <span className="font-bold">4. Control Manual:</span> El agente humano puede responder directamente desde el panel
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
