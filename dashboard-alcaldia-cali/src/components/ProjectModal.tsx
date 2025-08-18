'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Calendar, MapPin, DollarSign, TrendingUp, Clock, Building, FolderOpen, Printer, User, BarChart3, PieChart as PieChartIcon, Activity, AreaChart as AreaChartIcon } from 'lucide-react'
import { Project } from './ProjectsTable'
import BudgetChart from './BudgetChart'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  Legend
} from 'recharts'

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  project: Project | null
}

type ChartType = 'bar' | 'pie' | 'line' | 'area'

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, project }) => {
  const [chartType, setChartType] = useState<ChartType>('line')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  if (!project) return null

  const handleExportPDF = () => {
    // Aquí implementaremos la exportación a PDF
    console.log('Exportando ficha a PDF...', project)
    // TODO: Implementar exportación real con jsPDF o similar
    alert('Función de exportación a PDF en desarrollo')
  }

  const handlePrintModal = () => {
    // Función para imprimir el modal
    const printContent = document.getElementById('project-modal-content')
    if (printContent) {
      const printWindow = window.open('', '', 'height=600,width=800')
      printWindow?.document.write('<html><head><title>Ficha de Proyecto</title>')
      printWindow?.document.write('<style>body{font-family:Arial,sans-serif;margin:20px;}</style>')
      printWindow?.document.write('</head><body>')
      printWindow?.document.write(printContent.innerHTML)
      printWindow?.document.write('</body></html>')
      printWindow?.document.close()
      printWindow?.print()
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount).replace('COP', '').trim() + ' COP'
  }

  const formatPercentage = (value: number) => {
    // Si es un número entero, no mostrar decimales
    if (value % 1 === 0) {
      return value.toFixed(0) + '%'
    }
    // Si tiene decimales, mostrar máximo 2 cifras
    return value.toFixed(2).replace(/\.?0+$/, '') + '%'
  }

  // Función para obtener el nombre del centro gestor
  const getCentroGestorName = (bpin: string) => {
    // Simulamos algunos centros gestores basados en el BPIN o proyecto
    const centrosGestores = [
      'Secretaría de Infraestructura y Valorización',
      'Secretaría de Educación Municipal', 
      'Secretaría de Salud Pública',
      'Secretaría de Cultura, Recreación y Deporte',
      'Secretaría de Desarrollo Territorial y Participación',
      'Secretaría de Bienestar Social',
      'Secretaría de Gobierno y Gestión del Territorio',
      'Secretaría de Hacienda Municipal'
    ]
    
    // Usar el BPIN para determinar un centro gestor de forma consistente
    const index = parseInt(bpin.slice(-1)) % centrosGestores.length
    return centrosGestores[index]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En Ejecución':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-700'
      case 'Planificación':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700'
      case 'Completado':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
      case 'Suspendido':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-700'
      case 'En Evaluación':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-700'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
    }
  }

  // Funciones y datos para el análisis presupuestario
  const metricColors = {
    presupuestoTotal: '#3B82F6',
    ejecutado: '#10B981',
    pagado: '#F59E0B',
    pendiente: '#EF4444',
    disponible: '#8B5CF6'
  }

  const formatCurrencyFull = (value: number): string => {
    return `$${value.toLocaleString('de-DE', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    })}`;
  }

  const formatCurrencyShort = (value: number): string => {
    if (value >= 1e9) {
      return `$${(value / 1e9).toLocaleString('de-DE', { 
        minimumFractionDigits: 1, 
        maximumFractionDigits: 1 
      })}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toLocaleString('de-DE', { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0 
      })}M`;
    } else if (value >= 1e3) {
      return `$${(value / 1e3).toLocaleString('de-DE', { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0 
      })}K`;
    } else {
      return `$${value.toLocaleString('de-DE')}`;
    }
  }

  // Generar datos específicos del proyecto para análisis presupuestario
  const generateProjectBudgetData = () => {
    const pendiente = project.budget - project.executed
    const disponible = project.budget - project.pagado
    
    // Datos para gráfico de barras/pie
    const budgetBreakdown = [
      { name: 'Presupuesto Total', value: project.budget, color: metricColors.presupuestoTotal },
      { name: 'Ejecutado', value: project.executed, color: metricColors.ejecutado },
      { name: 'Pagado', value: project.pagado, color: metricColors.pagado },
      { name: 'Pendiente Ejecución', value: pendiente, color: metricColors.pendiente },
      { name: 'Disponible', value: disponible, color: metricColors.disponible }
    ]

    // Generar datos temporales basados en las fechas del proyecto
    const startDate = new Date(project.startDate)
    const endDate = new Date(project.endDate)
    const currentDate = new Date()
    const totalDuration = endDate.getTime() - startDate.getTime()
    const elapsedTime = currentDate.getTime() - startDate.getTime()
    const timeProgress = Math.min(Math.max(elapsedTime / totalDuration, 0), 1)

    const monthlyData = []
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    
    for (let i = 0; i < 8; i++) {
      const progressFactor = (i + 1) / 8
      const executedAmount = project.executed * progressFactor
      const paidAmount = project.pagado * progressFactor
      const monthIndex = (startDate.getMonth() + i) % 12
      
      monthlyData.push({
        month: monthNames[monthIndex],
        presupuestoTotal: project.budget,
        ejecutado: executedAmount,
        pagado: paidAmount,
        pendiente: project.budget - executedAmount,
        disponible: project.budget - paidAmount
      })
    }

    return { budgetBreakdown, monthlyData }
  }

  const { budgetBreakdown, monthlyData } = generateProjectBudgetData()

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrencyShort(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const renderBudgetChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" className="text-sm text-gray-600 dark:text-gray-400" />
              <YAxis 
                className="text-sm text-gray-600 dark:text-gray-400"
                tickFormatter={formatCurrencyShort}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="ejecutado" fill={metricColors.ejecutado} name="Ejecutado" />
              <Bar dataKey="pagado" fill={metricColors.pagado} name="Pagado" />
            </BarChart>
          </ResponsiveContainer>
        )

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={budgetBreakdown.filter(item => item.value > 0)}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {budgetBreakdown.filter(item => item.value > 0).map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke={activeIndex === index ? '#ffffff' : 'none'}
                    strokeWidth={activeIndex === index ? 2 : 0}
                  />
                ))}
              </Pie>
              <Tooltip 
                content={({ active, payload }: any) => {
                  if (active && payload && payload.length) {
                    const data = payload[0];
                    const percentage = ((data.value / project.budget) * 100).toFixed(1);
                    return (
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                        <p className="font-semibold text-gray-900 dark:text-white mb-1">{data.name}</p>
                        <p className="text-sm" style={{ color: data.payload.color }}>
                          Valor: {formatCurrencyFull(data.value)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {percentage}% del Presupuesto Total
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: '11px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" className="text-sm text-gray-600 dark:text-gray-400" />
              <YAxis 
                className="text-sm text-gray-600 dark:text-gray-400"
                tickFormatter={formatCurrencyShort}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="ejecutado" stroke={metricColors.ejecutado} strokeWidth={3} name="Ejecutado" />
              <Line type="monotone" dataKey="pagado" stroke={metricColors.pagado} strokeWidth={3} name="Pagado" />
            </LineChart>
          </ResponsiveContainer>
        )

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" className="text-sm text-gray-600 dark:text-gray-400" />
              <YAxis 
                className="text-sm text-gray-600 dark:text-gray-400"
                tickFormatter={formatCurrencyShort}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="ejecutado" stackId="1" stroke={metricColors.ejecutado} fill={metricColors.ejecutado + '80'} name="Ejecutado" />
              <Area type="monotone" dataKey="pagado" stackId="1" stroke={metricColors.pagado} fill={metricColors.pagado + '80'} name="Pagado" />
            </AreaChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            id="project-modal-content"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white p-6 border-b border-blue-500 dark:border-blue-600">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2 text-white">{project.name}</h2>
                  <div className="flex items-center space-x-4 text-blue-100 dark:text-blue-200 mb-2">
                    <span className="flex items-center">
                      <Building className="w-5 h-5 mr-2" />
                      BPIN: {project.bpin}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="text-blue-200 dark:text-blue-300">
                    <span className="text-sm italic">{getCentroGestorName(project.bpin)}</span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:text-gray-200 dark:hover:text-gray-300 transition-colors p-2 hover:bg-white/10 dark:hover:bg-white/20 rounded-full ml-4"
                  aria-label="Cerrar modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)] bg-white dark:bg-gray-900">
              <div className="p-6 space-y-6">
                {/* Información General */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                      Ubicación
                    </h3>
                    <div className="space-y-2 text-sm">
                      {project.comuna && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Comuna:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{project.comuna}</span>
                        </div>
                      )}
                      {project.barrio && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Barrio:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{project.barrio}</span>
                        </div>
                      )}
                      {project.corregimiento && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Corregimiento:</span>
                          <span className="font-medium text-gray-900 dark:text-white text-right max-w-[200px]">
                            {project.corregimiento}
                          </span>
                        </div>
                      )}
                      {project.vereda && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Vereda:</span>
                          <span className="font-medium text-gray-900 dark:text-white text-right max-w-[200px]">
                            {project.vereda}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                      Información Financiera
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Presupuesto Total:</span>
                        <span className="font-bold text-green-600 dark:text-green-400">{formatCurrency(project.budget)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Ejecutado:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(project.executed)} 
                          <span className="text-blue-600 dark:text-blue-400 ml-2">
                            ({formatPercentage((project.executed / project.budget) * 100)})
                          </span>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Pagado:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(project.pagado)} 
                          <span className="text-green-600 dark:text-green-400 ml-2">
                            ({formatPercentage((project.pagado / project.budget) * 100)})
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cronograma y Responsable */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                      Cronograma
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Fecha de Inicio:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatDate(project.startDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Fecha de Fin:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatDate(project.endDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Progreso:</span>
                        <span className="font-medium text-blue-600 dark:text-blue-400">{formatPercentage(project.progress)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <FolderOpen className="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400" />
                      Información del Proyecto
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Responsable:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{project.responsible}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Beneficiarios:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{project.beneficiaries.toLocaleString('es-CO')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">No. Unidades de Proyecto:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{project.unidadesDeProyecto || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Barra de Progreso Visual */}
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Progreso del Proyecto
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Progreso General</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formatPercentage(project.progress)}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 shadow-inner">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Ejecución Financiera</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatPercentage((project.executed / project.budget) * 100)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 shadow-inner">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                        style={{ width: `${(project.executed / project.budget) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Sección de Descripción */}
                {(project.descripcion || project.texto1 || project.texto2) && (
                  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Building className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                      Descripción del Proyecto
                    </h3>
                    
                    {project.descripcion && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Descripción General</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          {project.descripcion}
                        </p>
                      </div>
                    )}

                    {project.texto1 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Alcance y Beneficios</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          {project.texto1}
                        </p>
                      </div>
                    )}

                    {project.texto2 && (
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Componentes Adicionales</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          {project.texto2}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Análisis Presupuestario */}
              <div className="mt-6">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                    Análisis Presupuestario
                  </h3>
                  <BudgetChart project={project} hideMetricSelector={true} />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800/70">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Ficha generada el {new Date().toLocaleDateString('es-CO')}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handlePrintModal}
                    className="bg-gray-600 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 font-medium shadow-lg hover:shadow-xl"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimir Ficha</span>
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 font-medium shadow-lg hover:shadow-xl"
                  >
                    <Download className="w-4 h-4" />
                    <span>Exportar Ficha</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ProjectModal
