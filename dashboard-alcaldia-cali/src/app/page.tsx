'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import StatsCards from '@/components/StatsCards'
import BudgetChart from '@/components/BudgetChart'
import ChoroplethMapLeaflet from '@/components/ChoroplethMapLeaflet'
import MapComponent from '@/components/MapComponent'
import ProjectsTable, { Project } from '@/components/ProjectsTable'
import ProjectsUnitsTable, { ProjectUnit } from '@/components/ProjectsUnitsTable'
import UnifiedFilters, { FilterState } from '@/components/UnifiedFilters'
import { 
  BarChart3, 
  Map as MapIcon, 
  Table, 
  Filter,
  TrendingUp,
  PieChart,
  Grid3X3,
  FileText,
  Activity,
  Package
} from 'lucide-react'

type ActiveTab = 'overview' | 'projects' | 'project_units' | 'contracts' | 'activities' | 'products'

// Datos de proyectos mock
const mockProjects: Project[] = [
  {
    id: '1',
    bpin: '2024000001',
    name: 'Mejoramiento de Vías en Terrón Colorado',
    status: 'En Ejecución',
    comuna: 'Comuna 1',
    barrio: 'Terrón Colorado',
    budget: 2500000000,
    executed: 1250000000,
    pagado: 1100000000,
    beneficiaries: 15000,
    startDate: '2024-01-15',
    endDate: '2024-12-30',
    responsible: 'Secretaría de Infraestructura',
    progress: 50,
    unidadesDeProyecto: 3,
    descripcion: 'Proyecto integral de mejoramiento vial que incluye pavimentación, señalización y construcción de andenes en el sector de Terrón Colorado.',
    texto1: 'El proyecto contempla la intervención de 15 kilómetros de vías principales y secundarias, beneficiando directamente a más de 15,000 habitantes del sector.',
    texto2: 'Incluye obras complementarias como sistemas de drenaje, iluminación LED y mobiliario urbano para mejorar la calidad de vida de los residentes.'
  },
  {
    id: '2',
    bpin: '2024000002',
    name: 'Construcción de Parque en Aguablanca',
    status: 'Planificación',
    comuna: 'Comuna 7',
    barrio: 'Aguablanca',
    budget: 1800000000,
    executed: 0,
    pagado: 0,
    beneficiaries: 8500,
    startDate: '2024-06-01',
    endDate: '2025-03-31',
    responsible: 'Secretaría de Bienestar Social',
    progress: 10,
    unidadesDeProyecto: 2,
    descripcion: 'Construcción de un parque metropolitano con áreas recreativas, deportivas y culturales para el fortalecimiento del tejido social comunitario.',
    texto1: 'El parque contará con canchas deportivas, zona de juegos infantiles, teatro al aire libre y senderos ecológicos en un área de 5 hectáreas.',
    texto2: 'Se incluyen programas de apropiación social del territorio y formación en liderazgo comunitario para la sostenibilidad del proyecto.'
  },
  {
    id: '3',
    bpin: '2024000003',
    name: 'Red de Acueducto en Siloé',
    status: 'En Ejecución',
    comuna: 'Comuna 20',
    barrio: 'Siloé',
    budget: 4200000000,
    executed: 2940000000,
    pagado: 2650000000,
    beneficiaries: 22000,
    startDate: '2023-09-01',
    endDate: '2024-08-31',
    responsible: 'EMCALI',
    progress: 70,
    unidadesDeProyecto: 5,
    descripcion: 'Ampliación y mejoramiento de la red de acueducto para garantizar el acceso al agua potable en la ladera occidental de Cali.',
    texto1: 'La obra incluye la instalación de 25 kilómetros de tubería, construcción de 3 tanques de almacenamiento y modernización de la planta de tratamiento.',
    texto2: 'Se implementa tecnología de telemetría para el monitoreo en tiempo real del sistema y se capacita a la comunidad en el uso responsable del agua.'
  },
  {
    id: '4',
    bpin: '2024000004',
    name: 'Centro de Salud en Ciudad Jardín',
    status: 'Completado',
    comuna: 'Comuna 17',
    barrio: 'Ciudad Jardín',
    budget: 3100000000,
    executed: 3100000000,
    pagado: 3100000000,
    beneficiaries: 18000,
    startDate: '2023-03-01',
    endDate: '2024-02-29',
    responsible: 'Secretaría de Salud',
    progress: 100,
    unidadesDeProyecto: 1,
    descripcion: 'Centro de atención primaria en salud con servicios especializados de medicina general, odontología, laboratorio clínico y farmacia.',
    texto1: 'El centro cuenta con 15 consultorios médicos, 2 salas de procedimientos menores, área de hospitalización y unidad de urgencias básicas.',
    texto2: 'Incluye programas de promoción y prevención en salud, telemedicina para especialidades y atención 24 horas los 7 días de la semana.'
  },
  {
    id: '5',
    bpin: '2024000005',
    name: 'Pavimentación en La Flora',
    status: 'En Ejecución',
    comuna: 'Comuna 7',
    barrio: 'La Flora',
    budget: 1900000000,
    executed: 950000000,
    pagado: 760000000,
    beneficiaries: 12000,
    startDate: '2024-02-01',
    endDate: '2024-11-30',
    responsible: 'Secretaría de Infraestructura',
    progress: 50,
    unidadesDeProyecto: 4,
    descripcion: 'Proyecto de pavimentación en concreto rígido de vías locales y construcción de infraestructura peatonal en el barrio La Flora.',
    texto1: 'Contempla la pavimentación de 8 calles principales, construcción de 4 kilómetros de andenes y 150 rampas de accesibilidad universal.',
    texto2: 'Se incluye la renovación del sistema de alcantarillado pluvial y la implementación de un sistema de recolección de aguas lluvias para riego de zonas verdes.'
  }
]

// Datos de unidades de proyecto mock
const mockProjectUnits: ProjectUnit[] = [
  {
    id: 'unit-1',
    bpin: '2024000001-U1',
    name: 'Pavimentación Carrera 15',
    status: 'En Ejecución',
    comuna: 'Comuna 1',
    barrio: 'Terrón Colorado',
    budget: 850000000,
    executed: 425000000,
    pagado: 380000000,
    beneficiaries: 5000,
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    responsible: 'Secretaría de Infraestructura',
    progress: 50,
    tipoIntervencion: 'Construcción',
    lat: 3.4516,
    lng: -76.5320,
    descripcion: 'Pavimentación de la Carrera 15 desde la Calle 70 hasta la Calle 80 en Terrón Colorado.'
  },
  {
    id: 'unit-2',
    bpin: '2024000001-U2',
    name: 'Andenes Calle 75',
    status: 'En Ejecución',
    comuna: 'Comuna 1',
    barrio: 'Terrón Colorado',
    budget: 650000000,
    executed: 325000000,
    pagado: 290000000,
    beneficiaries: 3500,
    startDate: '2024-02-01',
    endDate: '2024-07-15',
    responsible: 'Secretaría de Infraestructura',
    progress: 45,
    tipoIntervencion: 'Mejoramiento',
    lat: 3.4526,
    lng: -76.5315,
    descripcion: 'Construcción de andenes y rampas de accesibilidad en la Calle 75.'
  },
  {
    id: 'unit-3',
    bpin: '2024000002-U1',
    name: 'Zona Deportiva Parque',
    status: 'Planificación',
    comuna: 'Comuna 7',
    barrio: 'Aguablanca',
    budget: 900000000,
    executed: 0,
    pagado: 0,
    beneficiaries: 4500,
    startDate: '2024-06-01',
    endDate: '2024-12-31',
    responsible: 'Secretaría de Bienestar Social',
    progress: 5,
    tipoIntervencion: 'Construcción',
    lat: 3.3976,
    lng: -76.5007,
    descripcion: 'Construcción de canchas deportivas y graderías en el nuevo parque de Aguablanca.'
  },
  {
    id: 'unit-4',
    bpin: '2024000003-U1',
    name: 'Tanque de Almacenamiento Norte',
    status: 'En Ejecución',
    comuna: 'Comuna 20',
    barrio: 'Siloé',
    budget: 1200000000,
    executed: 840000000,
    pagado: 750000000,
    beneficiaries: 8000,
    startDate: '2023-09-01',
    endDate: '2024-05-31',
    responsible: 'EMCALI',
    progress: 75,
    tipoIntervencion: 'Construcción',
    lat: 3.4206,
    lng: -76.5533,
    descripcion: 'Construcción de tanque de almacenamiento de 500m³ en la zona norte de Siloé.'
  },
  {
    id: 'unit-5',
    bpin: '2024000004-U1',
    name: 'Centro de Salud Principal',
    status: 'Completado',
    comuna: 'Comuna 17',
    barrio: 'Ciudad Jardín',
    budget: 3100000000,
    executed: 3100000000,
    pagado: 3100000000,
    beneficiaries: 18000,
    startDate: '2023-03-01',
    endDate: '2024-02-29',
    responsible: 'Secretaría de Salud',
    progress: 100,
    tipoIntervencion: 'Construcción',
    lat: 3.4372,
    lng: -76.5225,
    descripcion: 'Centro de salud integral con consultorios, laboratorio y farmacia en Ciudad Jardín.'
  }
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview')
  
  // Estado global para los filtros que se comparten entre todas las pestañas
  const [globalFilters, setGlobalFilters] = useState<FilterState>({
    search: '',
    estado: 'all',
    centroGestor: [],
    comunas: [],
    barrios: [],
    corregimientos: [],
    veredas: [],
    fuentesFinanciamiento: [],
    filtrosPersonalizados: [],
    subfiltrosPersonalizados: [],
    fechaInicio: '',
    fechaFin: ''
  })

  // Lógica de filtrado para proyectos
  const filteredProjects = useMemo(() => {
    return mockProjects.filter(project => {
      // Filtro por búsqueda de texto
      if (globalFilters.search) {
        const searchTerm = globalFilters.search.toLowerCase()
        const searchFields = [
          project.name,
          project.bpin,
          project.responsible,
          project.comuna,
          project.barrio,
          project.corregimiento,
          project.vereda
        ].filter(Boolean).join(' ').toLowerCase()
        
        if (!searchFields.includes(searchTerm)) return false
      }

      // Filtro por estado
      if (globalFilters.estado !== 'all' && project.status !== globalFilters.estado) {
        return false
      }

      // Filtro por centro gestor
      if (globalFilters.centroGestor.length > 0 && project.responsible) {
        if (!globalFilters.centroGestor.includes(project.responsible)) return false
      }

      // Filtro por comunas
      if (globalFilters.comunas.length > 0 && project.comuna) {
        if (!globalFilters.comunas.includes(project.comuna)) return false
      }

      // Filtro por barrios
      if (globalFilters.barrios.length > 0 && project.barrio) {
        if (!globalFilters.barrios.includes(project.barrio)) return false
      }

      // Filtro por corregimientos
      if (globalFilters.corregimientos.length > 0 && project.corregimiento) {
        if (!globalFilters.corregimientos.includes(project.corregimiento)) return false
      }

      // Filtro por veredas
      if (globalFilters.veredas.length > 0 && project.vereda) {
        if (!globalFilters.veredas.includes(project.vereda)) return false
      }

      // Filtro por fecha de inicio
      if (globalFilters.fechaInicio) {
        if (project.startDate < globalFilters.fechaInicio) return false
      }

      // Filtro por fecha de fin
      if (globalFilters.fechaFin) {
        if (project.endDate > globalFilters.fechaFin) return false
      }

      return true
    })
  }, [globalFilters])

  // Lógica de filtrado para unidades de proyecto
  const filteredProjectUnits = useMemo(() => {
    return mockProjectUnits.filter(unit => {
      // Filtro por búsqueda de texto
      if (globalFilters.search) {
        const searchTerm = globalFilters.search.toLowerCase()
        const searchFields = [
          unit.name,
          unit.bpin,
          unit.responsible,
          unit.comuna,
          unit.barrio,
          unit.corregimiento,
          unit.vereda,
          unit.tipoIntervencion
        ].filter(Boolean).join(' ').toLowerCase()
        
        if (!searchFields.includes(searchTerm)) return false
      }

      // Filtro por estado
      if (globalFilters.estado !== 'all' && unit.status !== globalFilters.estado) {
        return false
      }

      // Filtro por centro gestor
      if (globalFilters.centroGestor.length > 0 && unit.responsible) {
        if (!globalFilters.centroGestor.includes(unit.responsible)) return false
      }

      // Filtro por comunas
      if (globalFilters.comunas.length > 0 && unit.comuna) {
        if (!globalFilters.comunas.includes(unit.comuna)) return false
      }

      // Filtro por barrios
      if (globalFilters.barrios.length > 0 && unit.barrio) {
        if (!globalFilters.barrios.includes(unit.barrio)) return false
      }

      // Filtro por corregimientos
      if (globalFilters.corregimientos.length > 0 && unit.corregimiento) {
        if (!globalFilters.corregimientos.includes(unit.corregimiento)) return false
      }

      // Filtro por veredas
      if (globalFilters.veredas.length > 0 && unit.vereda) {
        if (!globalFilters.veredas.includes(unit.vereda)) return false
      }

      // Filtro por fecha de inicio
      if (globalFilters.fechaInicio) {
        if (unit.startDate < globalFilters.fechaInicio) return false
      }

      // Filtro por fecha de fin
      if (globalFilters.fechaFin) {
        if (unit.endDate > globalFilters.fechaFin) return false
      }

      return true
    })
  }, [globalFilters])

  const tabs = [
    { id: 'overview' as const, label: 'Vista General', icon: BarChart3 },
    { id: 'projects' as const, label: 'Proyectos', icon: Table },
    { id: 'project_units' as const, label: 'Unidades de Proyecto', icon: MapIcon },
    { id: 'activities' as const, label: 'Actividades', icon: Activity },
    { id: 'products' as const, label: 'Productos', icon: Package },
    { id: 'contracts' as const, label: 'Contratos', icon: FileText, disabled: true }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Stats Cards */}
            <StatsCards />
            
            {/* Charts Row */}
            <div className="w-full">
              <BudgetChart />
            </div>
            
            {/* Mapa Coroplético Principal */}
            <div className="w-full">
              <ChoroplethMapLeaflet />
            </div>
          </div>
        )

      case 'projects':
        return (
          <div className="space-y-8">
            <ProjectsTable projects={mockProjects} filteredProjects={filteredProjects} />
          </div>
        )

      case 'project_units':
        return (
          <div className="space-y-8">
            <div className="w-full">
              <MapComponent className="w-full" />
            </div>
            <div className="w-full">
              <ProjectsUnitsTable 
                projectUnits={mockProjectUnits} 
                filteredProjectUnits={filteredProjectUnits} 
              />
            </div>
          </div>
        )

      case 'contracts':
        return (
          <div className="space-y-8">
            <div className="w-full">
              <BudgetChart />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <ChoroplethMapLeaflet />
              </div>
              <div>
                <StatsCards />
              </div>
            </div>
          </div>
        )

      case 'activities':
        return (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Activity className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Actividades</h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 dark:text-white">Filtros Activos:</h3>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      <li>Búsqueda: {globalFilters.search || 'Sin filtro'}</li>
                      <li>Estado: {globalFilters.estado === 'all' ? 'Todos' : globalFilters.estado}</li>
                      <li>Comunas: {globalFilters.comunas.length > 0 ? globalFilters.comunas.join(', ') : 'Todas'}</li>
                      <li>Barrios: {globalFilters.barrios.length > 0 ? globalFilters.barrios.join(', ') : 'Todos'}</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-800 dark:text-blue-200">Total Actividades</h3>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">245</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h3 className="font-medium text-green-800 dark:text-green-200">Completadas</h3>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">189</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Lista de actividades que se actualizarán automáticamente según los filtros seleccionados.
                </p>
              </div>
            </div>
          </div>
        )

      case 'products':
        return (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Package className="w-6 h-6 text-purple-500" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Productos</h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 dark:text-white">Filtros Activos:</h3>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      <li>Búsqueda: {globalFilters.search || 'Sin filtro'}</li>
                      <li>Estado: {globalFilters.estado === 'all' ? 'Todos' : globalFilters.estado}</li>
                      <li>Fecha inicio: {globalFilters.fechaInicio || 'Sin fecha'}</li>
                      <li>Fecha fin: {globalFilters.fechaFin || 'Sin fecha'}</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <h3 className="font-medium text-purple-800 dark:text-purple-200">Total Productos</h3>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">156</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                    <h3 className="font-medium text-orange-800 dark:text-orange-200">En Desarrollo</h3>
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">67</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Catálogo de productos que se actualizarán automáticamente según los filtros seleccionados.
                </p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      
      <main className={`px-6 py-8 ${activeTab === 'project_units' ? 'max-w-none mx-4' : 'container mx-auto'}`}>
        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-xl p-1 shadow-lg border border-gray-100 dark:border-gray-700">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isDisabled = tab.disabled
              
              return (
                <button
                  key={tab.id}
                  onClick={() => !isDisabled && setActiveTab(tab.id)}
                  disabled={isDisabled}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isDisabled
                      ? 'text-gray-400 dark:text-gray-600 opacity-50 cursor-not-allowed'
                      : activeTab === tab.id
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  title={isDisabled ? 'Disponible próximamente' : ''}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  {isDisabled && (
                    <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full ml-1">
                      Próximamente
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Filtros Transversales - Aparecen en todas las pestañas */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <UnifiedFilters 
            filters={globalFilters}
            onFiltersChange={setGlobalFilters}
          />
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {renderContent()}
        </motion.div>
      </main>
    </div>
  )
}