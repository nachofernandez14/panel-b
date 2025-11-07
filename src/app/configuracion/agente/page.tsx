'use client'

import { Layout } from "@/components"
import AIConfigSection from '../../../components/AIConfigSection'
import BotsConfigSection from '../../../components/BotsConfigSection'

export default function AgentConfigPage() {
    return (
        <Layout>
            <div className="p-6 bg-gray-100 min-h-screen">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">🤖 Configuración del Agente IA</h1>
                        <p className="text-gray-600">Personaliza el comportamiento del agente virtual y los bots por plataforma</p>
                    </div>
                    
                    {/* Configuración del Agente IA */}
                    <AIConfigSection />
                    
                    {/* Configuración de Bots */}
                    <BotsConfigSection />

                    {/* Info adicional */}
                    <div className="bg-blue-100 rounded-lg shadow-sm p-4">
                        <h3 className='font-bold mb-3'>💡 ¿Cómo funciona?</h3>
                        <div className='space-y-2'>
                            <p className='font-medium text-gray-700'>
                                <span className="font-bold">🤖 Agente IA:</span> Define la personalidad y comportamiento del asistente virtual usando el prompt del sistema.
                            </p>
                            <p className='font-medium text-gray-700'>
                                <span className="font-bold">⚙️ Bots:</span> Configura parámetros técnicos como velocidad de respuesta y simulación de escritura por plataforma.
                            </p>
                            <p className='font-medium text-gray-700'>
                                <span className="font-bold">💾 Guardado:</span> Los cambios se guardan automáticamente en la base de datos y se aplican inmediatamente.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
