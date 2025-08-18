'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
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
import { TrendingUp, DollarSign, Calendar, Filter, BarChart3, PieChart as PieChartIcon, Activity, AreaChart as AreaChartIcon } from 'lucide-react'

type ChartType = 'bar' | 'pie' | 'line' | 'area'
type MetricType = 'movimientos' | 'inversion'

interface BudgetChartProps {
  className?: string
  project?: any // Para recibir datos del proyecto
  hideMetricSelector?: boolean // Para ocultar el selector de métricas
}

const BudgetChart: React.FC<BudgetChartProps> = ({ 
  className = '', 
  project,
  hideMetricSelector = false 
}) => {
  const [chartType, setChartType] = useState<ChartType>('line')
  const [metricType, setMetricType] = useState<MetricType>('movimientos')
  const [timeFrame, setTimeFrame] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  // Definir colores consistentes para cada métrica
  const metricColors = {
    // Movimientos Presupuestales
    presupuestoModificado: '#3B82F6',    // azul
    presupuestoInicial: '#10B981',       // verde
    adiciones: '#F59E0B',                // amarillo/naranja
    reducciones: '#EF4444',              // rojo
    presupuestoDisponible: '#8B5CF6',    // púrpura
    ejecucion: '#06B6D4',                // cyan
    pagos: '#F97316',                    // naranja
    // Sectores de Inversión
    infraestructura: '#3B82F6',          // azul
    educacion: '#10B981',                // verde
    salud: '#F59E0B',                    // amarillo
    movilidad: '#EF4444',                // rojo
    ambiente: '#8B5CF6',                 // púrpura
    deporte: '#06B6D4',                  // cyan
    cultura: '#F97316'                   // naranja
  };

  // Datos de ejemplo para el presupuesto
  const budgetData = [
    { name: 'Infraestructura', asignado: 800000000, ejecutado: 650000000, percentage: 81.25 },
    { name: 'Educación', asignado: 600000000, ejecutado: 580000000, percentage: 96.67 },
    { name: 'Salud', asignado: 500000000, ejecutado: 450000000, percentage: 90.00 },
    { name: 'Movilidad', asignado: 400000000, ejecutado: 320000000, percentage: 80.00 },
    { name: 'Ambiente', asignado: 300000000, ejecutado: 270000000, percentage: 90.00 },
    { name: 'Deporte', asignado: 200000000, ejecutado: 180000000, percentage: 90.00 },
    { name: 'Cultura', asignado: 150000000, ejecutado: 140000000, percentage: 93.33 }
  ]

  // Actualizar datos de series temporales con más métricas
  const timeSeriesData = [
    { month: 'Ene', presupuestoModificado: 280000000, presupuestoInicial: 254520000, adiciones: 25480000, reducciones: 14000000, presupuestoDisponible: 266000000, ejecucion: 250000000, pagos: 212500000 },
    { month: 'Feb', presupuestoModificado: 300000000, presupuestoInicial: 272700000, adiciones: 27300000, reducciones: 15000000, presupuestoDisponible: 285000000, ejecucion: 280000000, pagos: 238000000 },
    { month: 'Mar', presupuestoModificado: 320000000, presupuestoInicial: 290880000, adiciones: 29120000, reducciones: 16000000, presupuestoDisponible: 304000000, ejecucion: 310000000, pagos: 263500000 },
    { month: 'Abr', presupuestoModificado: 350000000, presupuestoInicial: 318150000, adiciones: 31850000, reducciones: 17500000, presupuestoDisponible: 332500000, ejecucion: 330000000, pagos: 280500000 },
    { month: 'May', presupuestoModificado: 380000000, presupuestoInicial: 345420000, adiciones: 34580000, reducciones: 19000000, presupuestoDisponible: 361000000, ejecucion: 360000000, pagos: 306000000 },
    { month: 'Jun', presupuestoModificado: 400000000, presupuestoInicial: 363600000, adiciones: 36400000, reducciones: 20000000, presupuestoDisponible: 380000000, ejecucion: 380000000, pagos: 323000000 },
    { month: 'Jul', presupuestoModificado: 420000000, presupuestoInicial: 381780000, adiciones: 38220000, reducciones: 21000000, presupuestoDisponible: 399000000, ejecucion: 400000000, pagos: 340000000 },
    { month: 'Ago', presupuestoModificado: 450000000, presupuestoInicial: 409050000, adiciones: 40950000, reducciones: 22500000, presupuestoDisponible: 427500000, ejecucion: 430000000, pagos: 365500000 }
  ]

  // Datos por sectores a lo largo del tiempo
  const sectorTimeSeriesData = [
    { 
      month: 'Ene', 
      infraestructura: 45000000, 
      educacion: 38000000, 
      salud: 32000000, 
      movilidad: 28000000, 
      ambiente: 22000000, 
      deporte: 18000000, 
      cultura: 15000000 
    },
    { 
      month: 'Feb', 
      infraestructura: 48000000, 
      educacion: 41000000, 
      salud: 35000000, 
      movilidad: 30000000, 
      ambiente: 24000000, 
      deporte: 20000000, 
      cultura: 17000000 
    },
    { 
      month: 'Mar', 
      infraestructura: 52000000, 
      educacion: 44000000, 
      salud: 38000000, 
      movilidad: 33000000, 
      ambiente: 27000000, 
      deporte: 22000000, 
      cultura: 19000000 
    },
    { 
      month: 'Abr', 
      infraestructura: 55000000, 
      educacion: 47000000, 
      salud: 41000000, 
      movilidad: 35000000, 
      ambiente: 29000000, 
      deporte: 24000000, 
      cultura: 21000000 
    },
    { 
      month: 'May', 
      infraestructura: 58000000, 
      educacion: 50000000, 
      salud: 44000000, 
      movilidad: 38000000, 
      ambiente: 31000000, 
      deporte: 26000000, 
      cultura: 23000000 
    },
    { 
      month: 'Jun', 
      infraestructura: 62000000, 
      educacion: 53000000, 
      salud: 47000000, 
      movilidad: 40000000, 
      ambiente: 33000000, 
      deporte: 28000000, 
      cultura: 25000000 
    },
    { 
      month: 'Jul', 
      infraestructura: 65000000, 
      educacion: 56000000, 
      salud: 50000000, 
      movilidad: 43000000, 
      ambiente: 36000000, 
      deporte: 30000000, 
      cultura: 27000000 
    },
    { 
      month: 'Ago', 
      infraestructura: 68000000, 
      educacion: 59000000, 
      salud: 53000000, 
      movilidad: 45000000, 
      ambiente: 38000000, 
      deporte: 32000000, 
      cultura: 29000000 
    }
  ]

  // Obtener colores para sectores
  const getSectorColor = (sectorName: string) => {
    const sectorKey = sectorName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return metricColors[sectorKey as keyof typeof metricColors] || '#6B7280';
  };

  const pieColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316']

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value).replace('COP', '').trim() + ' COP'
  }

  const formatCurrencyFull = (value: number): string => {
    return `$${value.toLocaleString('de-DE', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    })}`;
  };

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
  };

  // Cálculos para las estadísticas
  const presupuestoModificado = budgetData.reduce((sum, item) => sum + item.asignado, 0)
  const presupuestoInicial = presupuestoModificado * 0.909 // 90.9% del modificado
  const adiciones = presupuestoModificado - presupuestoInicial
  const reducciones = presupuestoModificado * 0.05 // 5% de reducciones
  const presupuestoDisponible = presupuestoModificado - reducciones
  const ejecucion = budgetData.reduce((sum, item) => sum + item.ejecutado, 0)
  const pagos = ejecucion * 0.85 // 85% de lo ejecutado son pagos

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

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        if (metricType === 'movimientos') {
          return (
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  className="text-sm text-gray-600 dark:text-gray-400"
                />
                <YAxis 
                  className="text-sm text-gray-600 dark:text-gray-400"
                  tickFormatter={formatCurrencyShort}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="presupuestoModificado" fill={metricColors.presupuestoModificado} name="Presupuesto Modificado" />
                <Bar dataKey="presupuestoInicial" fill={metricColors.presupuestoInicial} name="Presupuesto Inicial" />
                <Bar dataKey="adiciones" fill={metricColors.adiciones} name="Adiciones" />
                <Bar dataKey="reducciones" fill={metricColors.reducciones} name="Reducciones" />
                <Bar dataKey="presupuestoDisponible" fill={metricColors.presupuestoDisponible} name="Presupuesto Disponible" />
                <Bar dataKey="ejecucion" fill={metricColors.ejecucion} name="Ejecución" />
                <Bar dataKey="pagos" fill={metricColors.pagos} name="Pagos" />
              </BarChart>
            </ResponsiveContainer>
          )
        } else {
          return (
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="name" 
                  className="text-sm text-gray-600 dark:text-gray-400"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  className="text-sm text-gray-600 dark:text-gray-400"
                  tickFormatter={formatCurrencyShort}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="asignado" fill="#E5E7EB" name="Asignado" />
                <Bar dataKey="ejecutado" name="Ejecutado">
                  {budgetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getSectorColor(entry.name)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )
        }

      case 'pie':
        if (metricType === 'movimientos') {
          const pieDataMovimientos = [
            { name: 'Presupuesto Inicial', value: presupuestoInicial, color: metricColors.presupuestoInicial },
            { name: 'Adiciones', value: adiciones, color: metricColors.adiciones },
            { name: 'Reducciones', value: reducciones, color: metricColors.reducciones },
            { name: 'Presupuesto Disponible', value: presupuestoDisponible, color: metricColors.presupuestoDisponible },
            { name: 'Ejecución', value: ejecucion, color: metricColors.ejecucion },
            { name: 'Pagos', value: pagos, color: metricColors.pagos }
          ];
          
          return (
            <ResponsiveContainer width="100%" height={500}>
              <PieChart>
                <Pie
                  data={pieDataMovimientos}
                  cx="50%"
                  cy="50%"
                  outerRadius={140}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {pieDataMovimientos.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      stroke={activeIndex === index ? '#ffffff' : 'none'}
                      strokeWidth={activeIndex === index ? 3 : 0}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      const percentage = ((data.value / presupuestoModificado) * 100).toFixed(1);
                      return (
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                          <p className="font-semibold text-gray-900 dark:text-white mb-2">{data.name}</p>
                          <p className="text-sm" style={{ color: data.payload.color }}>
                            Valor: {formatCurrencyFull(data.value)}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {percentage}% del Presupuesto Modificado
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
                  wrapperStyle={{ fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )
        } else {
          return (
            <ResponsiveContainer width="100%" height={500}>
              <PieChart>
                <Pie
                  data={budgetData}
                  cx="50%"
                  cy="50%"
                  outerRadius={140}
                  fill="#8884d8"
                  dataKey="ejecutado"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {budgetData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getSectorColor(entry.name)}
                      stroke={activeIndex === index ? '#ffffff' : 'none'}
                      strokeWidth={activeIndex === index ? 3 : 0}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  content={<CustomTooltip />}
                  formatter={(value: number) => [formatCurrencyFull(value), 'Ejecutado']}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )
        }

      case 'line':
        if (metricType === 'movimientos') {
          return (
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" className="text-sm text-gray-600 dark:text-gray-400" />
                <YAxis 
                  className="text-sm text-gray-600 dark:text-gray-400"
                  tickFormatter={formatCurrencyShort}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="presupuestoModificado" stroke={metricColors.presupuestoModificado} strokeWidth={3} name="Presupuesto Modificado" />
                <Line type="monotone" dataKey="presupuestoInicial" stroke={metricColors.presupuestoInicial} strokeWidth={3} name="Presupuesto Inicial" />
                <Line type="monotone" dataKey="adiciones" stroke={metricColors.adiciones} strokeWidth={3} name="Adiciones" />
                <Line type="monotone" dataKey="reducciones" stroke={metricColors.reducciones} strokeWidth={3} name="Reducciones" />
                <Line type="monotone" dataKey="presupuestoDisponible" stroke={metricColors.presupuestoDisponible} strokeWidth={3} name="Presupuesto Disponible" />
                <Line type="monotone" dataKey="ejecucion" stroke={metricColors.ejecucion} strokeWidth={3} name="Ejecución" />
                <Line type="monotone" dataKey="pagos" stroke={metricColors.pagos} strokeWidth={3} name="Pagos" />
              </LineChart>
            </ResponsiveContainer>
          )
        } else {
          return (
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={sectorTimeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" className="text-sm text-gray-600 dark:text-gray-400" />
                <YAxis 
                  className="text-sm text-gray-600 dark:text-gray-400"
                  tickFormatter={formatCurrencyShort}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="infraestructura" stroke={metricColors.infraestructura} strokeWidth={3} name="Infraestructura" />
                <Line type="monotone" dataKey="educacion" stroke={metricColors.educacion} strokeWidth={3} name="Educación" />
                <Line type="monotone" dataKey="salud" stroke={metricColors.salud} strokeWidth={3} name="Salud" />
                <Line type="monotone" dataKey="movilidad" stroke={metricColors.movilidad} strokeWidth={3} name="Movilidad" />
                <Line type="monotone" dataKey="ambiente" stroke={metricColors.ambiente} strokeWidth={3} name="Ambiente" />
                <Line type="monotone" dataKey="deporte" stroke={metricColors.deporte} strokeWidth={3} name="Deporte" />
                <Line type="monotone" dataKey="cultura" stroke={metricColors.cultura} strokeWidth={3} name="Cultura" />
              </LineChart>
            </ResponsiveContainer>
          )
        }

      case 'area':
        if (metricType === 'movimientos') {
          return (
            <ResponsiveContainer width="100%" height={500}>
              <AreaChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" className="text-sm text-gray-600 dark:text-gray-400" />
                <YAxis 
                  className="text-sm text-gray-600 dark:text-gray-400"
                  tickFormatter={formatCurrencyShort}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="presupuestoModificado" stackId="1" stroke={metricColors.presupuestoModificado} fill={metricColors.presupuestoModificado + '80'} name="Presupuesto Modificado" />
                <Area type="monotone" dataKey="presupuestoInicial" stackId="2" stroke={metricColors.presupuestoInicial} fill={metricColors.presupuestoInicial + '80'} name="Presupuesto Inicial" />
                <Area type="monotone" dataKey="adiciones" stackId="3" stroke={metricColors.adiciones} fill={metricColors.adiciones + '80'} name="Adiciones" />
                <Area type="monotone" dataKey="reducciones" stackId="4" stroke={metricColors.reducciones} fill={metricColors.reducciones + '80'} name="Reducciones" />
                <Area type="monotone" dataKey="presupuestoDisponible" stackId="5" stroke={metricColors.presupuestoDisponible} fill={metricColors.presupuestoDisponible + '80'} name="Presupuesto Disponible" />
                <Area type="monotone" dataKey="ejecucion" stackId="6" stroke={metricColors.ejecucion} fill={metricColors.ejecucion + '80'} name="Ejecución" />
                <Area type="monotone" dataKey="pagos" stackId="7" stroke={metricColors.pagos} fill={metricColors.pagos + '80'} name="Pagos" />
              </AreaChart>
            </ResponsiveContainer>
          )
        } else {
          return (
            <ResponsiveContainer width="100%" height={500}>
              <AreaChart data={sectorTimeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" className="text-sm text-gray-600 dark:text-gray-400" />
                <YAxis 
                  className="text-sm text-gray-600 dark:text-gray-400"
                  tickFormatter={formatCurrencyShort}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="infraestructura" stackId="1" stroke={metricColors.infraestructura} fill={metricColors.infraestructura + '80'} name="Infraestructura" />
                <Area type="monotone" dataKey="educacion" stackId="1" stroke={metricColors.educacion} fill={metricColors.educacion + '80'} name="Educación" />
                <Area type="monotone" dataKey="salud" stackId="1" stroke={metricColors.salud} fill={metricColors.salud + '80'} name="Salud" />
                <Area type="monotone" dataKey="movilidad" stackId="1" stroke={metricColors.movilidad} fill={metricColors.movilidad + '80'} name="Movilidad" />
                <Area type="monotone" dataKey="ambiente" stackId="1" stroke={metricColors.ambiente} fill={metricColors.ambiente + '80'} name="Ambiente" />
                <Area type="monotone" dataKey="deporte" stackId="1" stroke={metricColors.deporte} fill={metricColors.deporte + '80'} name="Deporte" />
                <Area type="monotone" dataKey="cultura" stackId="1" stroke={metricColors.cultura} fill={metricColors.cultura + '80'} name="Cultura" />
              </AreaChart>
            </ResponsiveContainer>
          )
        }

      default:
        return null
    }
  }

  return (
    <motion.div 
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="space-y-6">
        {/* Header with metric type selector and chart type selector */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Análisis Presupuestario
          </h3>
          
          <div className="flex gap-4 items-center">
            {/* Metric Type Selector - Solo mostrar si hideMetricSelector es false */}
            {!hideMetricSelector && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Métricas:</span>
                <select
                  value={metricType}
                  onChange={(e) => setMetricType(e.target.value as MetricType)}
                  className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="movimientos">Movimientos Presupuestales</option>
                  <option value="inversion">Inversión por Sector</option>
                </select>
              </div>
            )}

            {/* Chart Type Selector */}
            <div className="flex gap-2">
              {[
                { key: 'line' as ChartType, label: 'Líneas', icon: <TrendingUp className="w-4 h-4" /> },
                { key: 'area' as ChartType, label: 'Área', icon: <AreaChartIcon className="w-4 h-4" /> },
                { key: 'bar' as ChartType, label: 'Barras', icon: <BarChart3 className="w-4 h-4" /> },
                { key: 'pie' as ChartType, label: 'Torta', icon: <PieChartIcon className="w-4 h-4" /> }
              ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setChartType(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  chartType === key
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
          </div>
        </div>

        {/* Layout con estadísticas y gráfico */}
        <div className="flex gap-4">
          {/* Tarjetas de estadísticas - Condicionales según tipo de gráfico y métrica */}
          <div className="w-60 flex flex-col space-y-2.5">
            {metricType === 'movimientos' ? (
              // Mostrar métricas presupuestarias (Movimientos Presupuestales)
              <>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2.5">
                  <div className="flex justify-between items-center">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Presupuesto Modificado</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {formatCurrencyFull(presupuestoModificado)}
                      </p>
                    </div>
                    <span 
                      className="text-white text-sm font-medium px-2 py-1 rounded ml-2"
                      style={{ backgroundColor: metricColors.presupuestoModificado }}
                    >
                      100%
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2.5">
                  <div className="flex justify-between items-center">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Presupuesto Inicial</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {formatCurrencyFull(presupuestoInicial)}
                      </p>
                    </div>
                    <span 
                      className="text-white text-sm font-medium px-2 py-1 rounded ml-2"
                      style={{ backgroundColor: metricColors.presupuestoInicial }}
                    >
                      90.9%
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2.5">
                  <div className="flex justify-between items-center">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Adiciones</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {formatCurrencyFull(adiciones)}
                      </p>
                    </div>
                    <span 
                      className="text-white text-sm font-medium px-2 py-1 rounded ml-2"
                      style={{ backgroundColor: metricColors.adiciones }}
                    >
                      9.1%
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2.5">
                  <div className="flex justify-between items-center">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Reducciones</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {formatCurrencyFull(reducciones)}
                      </p>
                    </div>
                    <span 
                      className="text-white text-sm font-medium px-2 py-1 rounded ml-2"
                      style={{ backgroundColor: metricColors.reducciones }}
                    >
                      5.0%
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2.5">
                  <div className="flex justify-between items-center">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Presupuesto Disponible</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {formatCurrencyFull(presupuestoDisponible)}
                      </p>
                    </div>
                    <span 
                      className="text-white text-sm font-medium px-2 py-1 rounded ml-2"
                      style={{ backgroundColor: metricColors.presupuestoDisponible }}
                    >
                      95.0%
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2.5">
                  <div className="flex justify-between items-center">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Ejecución</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {formatCurrencyFull(ejecucion)}
                      </p>
                    </div>
                    <span 
                      className="text-white text-sm font-medium px-2 py-1 rounded ml-2"
                      style={{ backgroundColor: metricColors.ejecucion }}
                    >
                      {((ejecucion / presupuestoModificado) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2.5">
                  <div className="flex justify-between items-center">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Pagos</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {formatCurrencyFull(pagos)}
                      </p>
                    </div>
                    <span 
                      className="text-white text-sm font-medium px-2 py-1 rounded ml-2"
                      style={{ backgroundColor: metricColors.pagos }}
                    >
                      {((pagos / presupuestoModificado) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </>
            ) : (
              // Mostrar categorías por sector (Inversión por Sector)
              budgetData.map((item, index) => (
                <div key={item.name} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2.5">
                  <div className="flex justify-between items-center">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 dark:text-gray-400">{item.name}</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {formatCurrencyFull(item.asignado)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Ejecutado: {formatCurrencyFull(item.ejecutado)}
                      </p>
                    </div>
                    <span 
                      className="text-white text-sm font-medium px-2 py-1 rounded ml-2"
                      style={{ backgroundColor: getSectorColor(item.name) }}
                    >
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chart area */}
          <div className="flex-1">
            {renderChart()}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default BudgetChart
