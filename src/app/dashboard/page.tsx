'use client'

import EtiquetasManager from './etiquetas_manager'
import Layout from '../../components/Layout'

export default function DashboardPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-100">
        <EtiquetasManager />
      </div>
    </Layout>
  )
}