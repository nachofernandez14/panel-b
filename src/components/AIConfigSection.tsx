'use client'

import { useState, useEffect } from 'react'

interface AIConfig {
    model: string
    temperature: number
    maxTokens: number
    systemPrompt: string
}

export default function AIConfigSection() {
    const [config, setConfig] = useState<AIConfig>({
        model: 'gemini-2.5-flash',
        temperature: 0.7,
        maxTokens: 1000,
        systemPrompt: ''
    })
    
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    // Cargar configuración al montar
    useEffect(() => {
        fetchConfig()
    }, [])

    const fetchConfig = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/config/ai-config')
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

    const handleSave = async () => {
        setSaving(true)
        setMessage(null)
        
        try {
            const response = await fetch('http://localhost:3001/api/config/ai-config', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(config)
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

    const handleReset = () => {
        setConfig({
            model: 'gemini-2.5-flash',
            temperature: 0.7,
            maxTokens: 1000,
            systemPrompt: `Eres un agente virtual de Bit And Brain Software.
- Solo responde sobre la empresa
- Respuestas concisas y naturales
- Siempre en español
- No salgas de tu papel`
        })
    }

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">🤖 Configuración del Agente IA</h2>
                    <p className="text-sm text-gray-600 mt-1">Personaliza el comportamiento del agente virtual</p>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        🟢 Gemini 2.5 Flash
                    </div>
                </div>
            </div>

            {message && (
                <div className={`mb-4 p-4 rounded-lg ${
                    message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                    {message.text}
                </div>
            )}

            <div className="space-y-6">
                {/* Prompt del Sistema */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        📝 Prompt del Sistema
                        <span className="ml-2 text-xs font-normal text-gray-500">(Define la personalidad del agente)</span>
                    </label>
                    <textarea
                        value={config.systemPrompt}
                        onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
                        rows={8}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-mono text-sm"
                        placeholder="Ej: Eres un asistente amable y profesional..."
                    />
                    <p className="mt-2 text-xs text-gray-500">
                        💡 Tip: Sé específico sobre cómo debe responder el agente. Usa viñetas para instrucciones claras.
                    </p>
                </div>

                {/* Parámetros del Modelo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Temperatura */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            🌡️ Temperatura
                            <span className="ml-2 text-xs font-normal text-gray-500">(Creatividad: 0-1)</span>
                        </label>
                        <div className="flex items-center space-x-4">
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={config.temperature}
                                onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="w-12 text-center font-mono text-sm font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                {config.temperature}
                            </span>
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                            <span>🎯 Preciso</span>
                            <span>🎨 Creativo</span>
                        </div>
                    </div>

                    {/* Max Tokens */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            📏 Longitud Máxima
                            <span className="ml-2 text-xs font-normal text-gray-500">(Tokens)</span>
                        </label>
                        <input
                            type="number"
                            min="100"
                            max="4000"
                            step="100"
                            value={config.maxTokens}
                            onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-mono"
                        />
                        <p className="mt-2 text-xs text-gray-500">
                            💡 Aproximadamente {Math.round(config.maxTokens * 0.75)} palabras
                        </p>
                    </div>
                </div>

                {/* Modelo (solo lectura por ahora) */}
                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                🧠 Modelo de IA
                            </label>
                            <p className="text-sm text-gray-600">Google Gemini 2.5 Flash</p>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-500">Velocidad</div>
                            <div className="text-sm font-semibold text-green-600">⚡ Ultra rápido</div>
                        </div>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
                    <button
                        onClick={handleReset}
                        className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                    >
                        🔄 Restaurar por defecto
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                        {saving ? '⏳ Guardando...' : '💾 Guardar Configuración'}
                    </button>
                </div>
            </div>
        </div>
    )
}
