'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  FolderOpen, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  MapPin,
  Target,
  CheckCircle,
  Layers,
  Activity,
  Package,
  FileText,
  Briefcase
} from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  color: string
  trend?: {
    value: number
    isPositive: boolean
  }
  index: number
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color, 
  trend, 
  index 
}) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatValue = (val: string | number) => {
    if (!mounted) {
      // Durante SSR, devolver el valor sin formatear para evitar hidratación incorrecta
      return typeof val === 'number' ? val.toString() : val
    }
    
    if (typeof val === 'number') {
      // Para valores enteros (Proyectos, Unidades, Actividades, Productos y Contratos)
      // Formatear con separador de miles colombiano (punto) sin decimales
      return val.toLocaleString('es-CO', { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0 
      }).replace(/,/g, '.')
    }
    
    // Para strings (porcentajes, etc.)
    return val
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 min-h-[140px] sm:min-h-[160px]"
    >
      <div className="flex items-start justify-between gap-3 h-full">
        <div className="flex-1 min-w-0 flex flex-col justify-between h-full"> {/* min-w-0 permite que el contenido se contraiga */}
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 leading-relaxed line-clamp-2">
              {title}
            </p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1 break-words">
              {formatValue(value)}
            </p>
            {subtitle && (
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 line-clamp-2 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {trend && (
            <div className="flex items-center mt-2 flex-wrap">
              <TrendingUp 
                className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0 ${
                  trend.isPositive ? 'text-green-500' : 'text-red-500 rotate-180'
                }`}
              />
              <span 
                className={`text-xs sm:text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 ml-1 truncate">
                vs mes anterior
              </span>
            </div>
          )}
        </div>
        <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ${color}`}>
          {React.cloneElement(icon as React.ReactElement, {
            className: 'w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white'
          })}
        </div>
      </div>
    </motion.div>
  )
}

const StatsCards: React.FC = () => {
  const stats = [
    {
      title: 'Proyectos',
      value: 248,
      subtitle: 'En ejecución',
      icon: <FolderOpen className="w-6 h-6 text-white" />,
      color: 'bg-blue-500',
      trend: { value: 12, isPositive: true }
    },
    {
      title: 'Unidades de Proyecto',
      value: 1456,
      subtitle: 'Unidades activas',
      icon: <Layers className="w-6 h-6 text-white" />,
      color: 'bg-green-500',
      trend: { value: 8, isPositive: true }
    },
    {
      title: 'Actividades',
      value: 3892,
      subtitle: 'En seguimiento',
      icon: <Activity className="w-6 h-6 text-white" />,
      color: 'bg-purple-500',
      trend: { value: 15, isPositive: true }
    },
    {
      title: 'Productos',
      value: 325,
      subtitle: 'Entregables generados',
      icon: <Package className="w-6 h-6 text-white" />,
      color: 'bg-orange-500',
      trend: { value: 23, isPositive: true }
    },
    {
      title: 'Contratos',
      value: 242,
      subtitle: 'Vigentes y suscritos',
      icon: <FileText className="w-6 h-6 text-white" />,
      color: 'bg-red-500',
      trend: { value: 11, isPositive: true }
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={stat.title} {...stat} index={index} />
      ))}
    </div>
  )
}

export default StatsCards