'use client'

import { useState } from 'react'
import Layout from '../../components/Layout'

interface Tag {
  id: string
  name: string
  color: string
  description: string
}

// Interfaz local para mostrar información adicional
interface EtiquetaWithStats extends Tag {
  conversacionesAsignadas: number
}

// Etiquetas iniciales estáticas (locales a este componente)
const etiquetasIniciales: EtiquetaWithStats[] = [
  {
    id: '1',
    name: 'Cliente Potencial',
    color: 'bg-green-200',
    description: 'Contactos que muestran interés en nuestros productos/servicios',
    conversacionesAsignadas: 5
  },
  {
    id: '2',
    name: 'Venta Cerrada',
    color: 'bg-blue-200',
    description: 'Clientes que han completado una compra exitosamente',
    conversacionesAsignadas: 3
  },
  {
    id: '3',
    name: 'Urgente',
    color: 'bg-red-200',
    description: 'Conversaciones que requieren atención inmediata',
    conversacionesAsignadas: 2
  },
  {
    id: '4',
    name: 'Seguimiento',
    color: 'bg-yellow-200',
    description: 'Contactos que necesitan seguimiento posterior',
    conversacionesAsignadas: 7
  },
  {
    id: '5',
    name: 'Soporte Técnico',
    color: 'bg-purple-200',
    description: 'Consultas relacionadas con problemas técnicos',
    conversacionesAsignadas: 4
  },
  {
    id: '6',
    name: 'Cotización',
    color: 'bg-orange-200',
    description: 'Solicitudes de presupuestos y cotizaciones',
    conversacionesAsignadas: 6
  }
]

const coloresDisponibles = [
  'bg-red-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 
  'bg-purple-200', 'bg-pink-200', 'bg-orange-200', 'bg-indigo-200',
  'bg-teal-200', 'bg-gray-200', 'bg-rose-200', 'bg-emerald-200',
  'bg-sky-200', 'bg-violet-200', 'bg-amber-200', 'bg-lime-200'
]

export default function EtiquetasManager() {
  const [etiquetas, setEtiquetas] = useState<EtiquetaWithStats[]>(etiquetasIniciales)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState({
    name: '',
    color: 'bg-blue-200',
    description: ''
  })
  const [busqueda, setBusqueda] = useState('')
  const [etiquetaEditando, setEtiquetaEditando] = useState<string | null>(null)

  const etiquetasFiltradas = etiquetas.filter(etiqueta =>
    etiqueta.name.toLowerCase().includes(busqueda.toLowerCase()) ||
    etiqueta.description.toLowerCase().includes(busqueda.toLowerCase())
  )

  const handleCrearEtiqueta = () => {
    if (nuevaEtiqueta.name.trim()) {
      const nueva: EtiquetaWithStats = {
        id: Date.now().toString(),
        name: nuevaEtiqueta.name,
        color: nuevaEtiqueta.color,
        description: nuevaEtiqueta.description,
        conversacionesAsignadas: 0
      }
      setEtiquetas([...etiquetas, nueva])
      setNuevaEtiqueta({ name: '', color: 'bg-blue-200', description: '' })
      setMostrarFormulario(false)
    }
  }

  const handleEliminarEtiqueta = (id: string) => {
    setEtiquetas(etiquetas.filter(etiqueta => etiqueta.id !== id))
  }

  const handleEditarEtiqueta = (id: string) => {
    const etiqueta = etiquetas.find(e => e.id === id)
    if (etiqueta) {
      setNuevaEtiqueta({
        name: etiqueta.name,
        color: etiqueta.color,
        description: etiqueta.description
      })
      setEtiquetaEditando(id)
      setMostrarFormulario(true)
    }
  }

  const handleGuardarEdicion = () => {
    if (etiquetaEditando && nuevaEtiqueta.name.trim()) {
      setEtiquetas(etiquetas.map(etiqueta =>
        etiqueta.id === etiquetaEditando
          ? { ...etiqueta, name: nuevaEtiqueta.name, color: nuevaEtiqueta.color, description: nuevaEtiqueta.description }
          : etiqueta
      ))
      setNuevaEtiqueta({ name: '', color: 'bg-blue-200', description: '' })
      setEtiquetaEditando(null)
      setMostrarFormulario(false)
    }
  }

  const cancelarFormulario = () => {
    setNuevaEtiqueta({ name: '', color: 'bg-blue-200', description: '' })
    setEtiquetaEditando(null)
    setMostrarFormulario(false)
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Etiquetas</h1>
            <p className="text-gray-600">Organiza tus conversaciones con etiquetas personalizadas</p>
          </div>

          {/* Barra de búsqueda y botón de nueva etiqueta */}
          <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Buscar etiquetas..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setMostrarFormulario(true)}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              + Nueva Etiqueta
            </button>
          </div>

          {/* Formulario de nueva etiqueta */}
          {mostrarFormulario && (
            <div className="mb-6 bg-white p-6 border-2 border-gray-800 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                {etiquetaEditando ? 'Editar Etiqueta' : 'Crear Nueva Etiqueta'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la etiqueta
                  </label>
                  <input
                    type="text"
                    value={nuevaEtiqueta.name}
                    onChange={(e) => setNuevaEtiqueta({ ...nuevaEtiqueta, name: e.target.value })}
                    placeholder="Ej: Cliente Potencial"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {coloresDisponibles.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNuevaEtiqueta({ ...nuevaEtiqueta, color })}
                        className={`w-8 h-8 ${color} rounded-full border-2 ${
                          nuevaEtiqueta.color === color ? 'border-gray-300' : 'border-gray-300'
                        } hover:scale-110 transition-transform`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={nuevaEtiqueta.description}
                  onChange={(e) => setNuevaEtiqueta({ ...nuevaEtiqueta, description: e.target.value })}
                  placeholder="Describe cuándo usar esta etiqueta..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={etiquetaEditando ? handleGuardarEdicion : handleCrearEtiqueta}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  {etiquetaEditando ? 'Guardar Cambios' : 'Crear Etiqueta'}
                </button>
                <button
                  onClick={cancelarFormulario}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Grid de etiquetas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {etiquetasFiltradas.map((etiqueta) => (
              <div
                key={etiqueta.id}
                className="bg-white p-6 border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 ${etiqueta.color} rounded-full`}></div>
                    <h3 className="text-lg font-semibold text-gray-800">{etiqueta.name}</h3>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditarEtiqueta(etiqueta.id)}
                      className="text-blue-500 hover:text-blue-700 p-1 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                      title="Editar"
                    >
                      <img src="icons/edit.png" alt="Editar" className='inline-block w-6 h-6 cursor-pointer hover:scale-110 transition-transform' />
                    </button>
                    <button
                      onClick={() => handleEliminarEtiqueta(etiqueta.id)}
                      className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors cursor-pointer"
                      title="Eliminar"
                    >
                      <img src="icons/delete.png" alt="Eliminar" className='inline-block w-6 h-6 cursor-pointer hover:scale-110 transition-transform' />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {etiqueta.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {etiqueta.conversacionesAsignadas} conversaciones
                  </span>
                </div>
              </div>
            ))}
          </div>

          {etiquetasFiltradas.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏷️</div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                No se encontraron etiquetas
              </h3>
              <p className="text-gray-600">
                {busqueda ? 'Intenta con otros términos de búsqueda' : 'Crea tu primera etiqueta para comenzar'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}