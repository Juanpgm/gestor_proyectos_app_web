'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { 
  Map as MapIcon, 
  BarChart3, 
  Activity,
  Layers,
  Settings,
  Download
} from 'lucide-react'

// Dynamic imports to prevent SSR issues
const UniversalMapComponent = dynamic(() => import('@/components/UniversalMapComponent'), { ssr: false })
const ChoroplethMap = dynamic(() => import('@/components/UniversalMapComponent').then(mod => mod.ChoroplethMap), { ssr: false })
const ProjectUnitsMap = dynamic(() => import('@/components/UniversalMapComponent').then(mod => mod.ProjectUnitsMap), { ssr: false })
const SimpleMap = dynamic(() => import('@/components/UniversalMapComponent').then(mod => mod.SimpleMap), { ssr: false })

import Header from '@/components/Header'

type DemoTab = 'choropleth' | 'project-units' | 'simple' | 'custom'

export default function DemoUniversalMap() {
  const [activeTab, setActiveTab] = useState<DemoTab>('choropleth')
  const [customConfig, setCustomConfig] = useState({
    interactive: true,
    zoomToData: true,
    showPopups: true,
    height: 600
  })

  const tabs = [
    { id: 'choropleth' as const, label: 'Mapa Coroplético', icon: BarChart3 },
    { id: 'project-units' as const, label: 'Unidades de Proyecto', icon: MapIcon },
    { id: 'simple' as const, label: 'Mapa Simple', icon: Layers },
    { id: 'custom' as const, label: 'Personalizado', icon: Settings }
  ]

  const renderMapDemo = () => {
    switch (activeTab) {
      case 'choropleth':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Mapa Coroplético - Poblacion por Comuna
              </h3>
              <ChoroplethMap
                geoJsonSources={['comunas']}
                dataProperty="POBLACION"
                colorRange={['#fee5d9', '#fcae91', '#fb6a4a', '#cb181d']}
                height={500}
                popup={{
                  enabled: true,
                  template: (props) => `
                    <div class="p-3">
                      <h3 class="font-bold text-lg">${props.NOMBRE_COM || 'Comuna'}</h3>
                      <p><strong>Población:</strong> ${props.POBLACION?.toLocaleString() || 'N/A'}</p>
                      <p><strong>Área:</strong> ${props.AREA_KM2?.toFixed(2) || 'N/A'} km²</p>
                      <p><strong>Densidad:</strong> ${props.DENSIDAD?.toFixed(0) || 'N/A'} hab/km²</p>
                    </div>
                  `
                }}
                legend={{
                  enabled: true,
                  title: 'Población por Comuna',
                  position: 'bottomright'
                }}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200">Características</h4>
                <ul className="text-sm text-blue-600 dark:text-blue-400 mt-2 space-y-1">
                  <li>• Coloración automática por valor</li>
                  <li>• Popup informativo</li>
                  <li>• Leyenda integrada</li>
                  <li>• Auto-zoom a los datos</li>
                </ul>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-200">Uso</h4>
                <pre className="text-xs text-green-600 dark:text-green-400 mt-2 whitespace-pre-wrap">
{`<ChoroplethMap
  geoJsonSources={['comunas']}
  dataProperty="POBLACION"
  colorRange={colors}
/>`}
                </pre>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 dark:text-purple-200">Datos</h4>
                <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">
                  Carga automática de comunas.geojson con procesamiento de coordenadas y cache inteligente.
                </p>
              </div>
            </div>
          </div>
        )

      case 'project-units':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Mapa de Unidades de Proyecto - Equipamientos e Infraestructura
              </h3>
              <ProjectUnitsMap
                geoJsonSources={['barrios']}
                height={500}
                mapStyle={{
                  weight: 2,
                  opacity: 0.9,
                  color: '#1d4ed8',
                  fillColor: '#3b82f6',
                  fillOpacity: 0.4
                }}
                popup={{
                  enabled: true,
                  template: (props) => `
                    <div class="p-3">
                      <h3 class="font-bold text-lg">${props.NOMBRE_BAR || props.nombre || 'Barrio'}</h3>
                      ${props.TIPO ? `<p><strong>Tipo:</strong> ${props.TIPO}</p>` : ''}
                      ${props.ESTADO ? `<p><strong>Estado:</strong> ${props.ESTADO}</p>` : ''}
                      ${props.COMUNA ? `<p><strong>Comuna:</strong> ${props.COMUNA}</p>` : ''}
                    </div>
                  `
                }}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 dark:text-orange-200">Múltiples Fuentes</h4>
                <ul className="text-sm text-orange-600 dark:text-orange-400 mt-2 space-y-1">
                  <li>• Equipamientos: 433.4 KB</li>
                  <li>• Infraestructura vial: 278.5 KB</li>
                  <li>• Carga en paralelo optimizada</li>
                  <li>• Cache automático por archivo</li>
                </ul>
              </div>
              
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-indigo-800 dark:text-indigo-200">Interactividad</h4>
                <ul className="text-sm text-indigo-600 dark:text-indigo-400 mt-2 space-y-1">
                  <li>• Hover effects automáticos</li>
                  <li>• Popups contextuales</li>
                  <li>• Zoom dinámico a contenido</li>
                  <li>• Eventos personalizables</li>
                </ul>
              </div>
            </div>
          </div>
        )

      case 'simple':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Mapa Simple - Solo Visualización
              </h3>
              <SimpleMap
                geoJsonSources={['barrios']}
                height={400}
                mapStyle={{
                  weight: 1,
                  opacity: 0.6,
                  color: '#6b7280',
                  fillColor: '#9ca3af',
                  fillOpacity: 0.1
                }}
                interactive={false}
                zoomToData={true}
                allowZoom={false}
                allowPan={false}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">Configuración</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                  <li>• Sin interacción del usuario</li>
                  <li>• No permite zoom ni pan</li>
                  <li>• Ideal para embeddings</li>
                  <li>• Carga mínima de recursos</li>
                </ul>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">Casos de Uso</h4>
                <ul className="text-sm text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                  <li>• Reportes estáticos</li>
                  <li>• Dashboards de solo lectura</li>
                  <li>• Vistas previas</li>
                  <li>• Presentaciones</li>
                </ul>
              </div>
            </div>
          </div>
        )

      case 'custom':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Configuración Personalizada
              </h3>
              
              {/* Controles de configuración */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Interactivo
                  </label>
                  <input
                    type="checkbox"
                    checked={customConfig.interactive}
                    onChange={(e) => setCustomConfig(prev => ({ ...prev, interactive: e.target.checked }))}
                    className="rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Auto Zoom
                  </label>
                  <input
                    type="checkbox"
                    checked={customConfig.zoomToData}
                    onChange={(e) => setCustomConfig(prev => ({ ...prev, zoomToData: e.target.checked }))}
                    className="rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Popups
                  </label>
                  <input
                    type="checkbox"
                    checked={customConfig.showPopups}
                    onChange={(e) => setCustomConfig(prev => ({ ...prev, showPopups: e.target.checked }))}
                    className="rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Altura: {customConfig.height}px
                  </label>
                  <input
                    type="range"
                    min="300"
                    max="800"
                    value={customConfig.height}
                    onChange={(e) => setCustomConfig(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>
              
              {/* Mapa con configuración personalizada */}
              <UniversalMapComponent
                geoJsonSources={['comunas', 'barrios']}
                height={customConfig.height}
                interactive={customConfig.interactive}
                zoomToData={customConfig.zoomToData}
                allowZoom={customConfig.interactive}
                allowPan={customConfig.interactive}
                mapStyle={{
                  weight: 2,
                  opacity: 0.8,
                  color: '#059669',
                  fillColor: '#10b981',
                  fillOpacity: 0.3
                }}
                popup={customConfig.showPopups ? {
                  enabled: true,
                  template: (props) => `
                    <div class="p-3">
                      <h3 class="font-bold text-lg">${props.NOMBRE_COM || props.NOMBRE_BAR || 'Área'}</h3>
                      <p><strong>Tipo:</strong> ${props.NOMBRE_COM ? 'Comuna' : 'Barrio'}</p>
                      ${props.POBLACION ? `<p><strong>Población:</strong> ${props.POBLACION.toLocaleString()}</p>` : ''}
                    </div>
                  `
                } : { enabled: false }}
                onFeatureClick={(feature, layer) => {
                  console.log('Feature clicked:', feature.properties)
                }}
                onMapReady={(map) => {
                  console.log('Mapa personalizado listo:', map)
                }}
                useCanvas={true}
              />
            </div>
            
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                Configuración Actual
              </h4>
              <pre className="text-xs text-emerald-600 dark:text-emerald-400 whitespace-pre-wrap">
{`<UniversalMapComponent
  geoJsonSources={['comunas', 'barrios']}
  height={${customConfig.height}}
  interactive={${customConfig.interactive}}
  zoomToData={${customConfig.zoomToData}}
  popup={{ enabled: ${customConfig.showPopups} }}
  useCanvas={true}
/>`}
              </pre>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Título principal */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Componente Universal de Mapas
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Un solo componente capaz de renderizar cualquier tipo de mapa con Leaflet. 
            Personalizable, optimizado y con carga inteligente de GeoJSON.
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center space-x-1 bg-white dark:bg-gray-800 rounded-xl p-1 shadow-lg border border-gray-100 dark:border-gray-700 max-w-4xl mx-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {renderMapDemo()}
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <Activity className="w-8 h-8 text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Carga Optimizada
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Sistema inteligente de cache, carga paralela y estrategias por tamaño de archivo. 
              Transformaciones automáticas de coordenadas.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <Settings className="w-8 h-8 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Altamente Configurable
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Presets predefinidos o configuración completa. Eventos, popups, estilos, 
              comportamiento y optimización visual personalizables.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <Download className="w-8 h-8 text-purple-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Arquitectura Unificada
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Reemplaza múltiples componentes con una sola solución. TypeScript completo, 
              hooks optimizados y mejores prácticas.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
