'use client'

import React, { useMemo, useCallback, useEffect, useState } from 'react'
import UniversalMapCore, { MapLayer } from './UniversalMapCore'
import { useGeoJSONLoader } from '@/utils/geoJSONLoader'

/**
 * ===================================
 * COMPONENTE UNIVERSAL DE MAPAS V2
 * ===================================
 * 
 * Versión simplificada y unificada que usa UniversalMapCore
 * Eliminando código obsoleto y manteniendo funcionalidad esencial
 */

export interface UniversalMapProps {
  // Datos principales
  geoJsonSources?: string[]
  staticGeoJsonData?: any | any[]
  
  // Configuración visual  
  height?: string | number
  theme?: string
  
  // Comportamiento
  interactive?: boolean
  zoomToData?: boolean
  
  // Eventos
  onFeatureClick?: (feature: any, layer: any) => void
  onLayerToggle?: (layerId: string) => void
  
  // Estilo y clases
  className?: string
  
  // Controles
  enableFullscreen?: boolean
  enableCenterView?: boolean
  enableLayerControls?: boolean
  
  // Loading y errores
  loadingComponent?: React.ReactNode
  errorComponent?: React.ReactNode
  onError?: (error: string) => void
}

const UniversalMapComponent: React.FC<UniversalMapProps> = ({
  geoJsonSources = [],
  staticGeoJsonData,
  height = 400,
  theme = 'light',
  interactive = true,
  zoomToData = true,
  onFeatureClick,
  onLayerToggle,
  className = '',
  enableFullscreen = true,
  enableCenterView = true,
  enableLayerControls = true,
  loadingComponent,
  errorComponent,
  onError
}) => {
  const [layers, setLayers] = useState<MapLayer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  // Cargar datos GeoJSON cuando cambien las fuentes
  useEffect(() => {
    const loadData = async () => {
      if (!geoJsonSources.length && !staticGeoJsonData) {
        setLayers([])
        return
      }

      setIsLoading(true)
      setHasError(false)
      setErrorMessage('')

      try {
        const newLayers: MapLayer[] = []
        
        // Agregar datos estáticos
        if (staticGeoJsonData) {
          const dataArray = Array.isArray(staticGeoJsonData) ? staticGeoJsonData : [staticGeoJsonData]
          dataArray.forEach((data, index) => {
            if (data) {
              newLayers.push({
                id: `static-${index}`,
                name: `Capa ${index + 1}`,
                data,
                visible: true,
                type: 'geojson'
              })
            }
          })
        }

        // Cargar datos dinámicos si hay fuentes
        if (geoJsonSources.length > 0) {
          const { loadMultipleGeoJSON } = await import('@/utils/geoJSONLoader')
          
          const dynamicData = await loadMultipleGeoJSON(geoJsonSources, {
            processCoordinates: true,
            cache: true
          })

          // Agregar los datos dinámicos
          Object.entries(dynamicData).forEach(([key, geoJson]) => {
            if (geoJson) {
              newLayers.push({
                id: key,
                name: key.charAt(0).toUpperCase() + key.slice(1),
                data: geoJson,
                visible: true,
                type: 'geojson'
              })
            }
          })
        }

        setLayers(newLayers)
        setIsLoading(false)
      } catch (error: any) {
        console.error('Error loading GeoJSON data:', error)
        setHasError(true)
        setErrorMessage(error.message || 'Error desconocido')
        setIsLoading(false)
        onError?.(error.message || 'Error desconocido')
      }
    }

    loadData()
  }, [geoJsonSources, staticGeoJsonData, onError])

  // Manejar toggle de capas
  const handleLayerToggle = useCallback((layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId 
        ? { ...layer, visible: !layer.visible }
        : layer
    ))
    onLayerToggle?.(layerId)
  }, [onLayerToggle])

  // Renderizado condicional para estados de carga y error
  if (isLoading && loadingComponent) {
    return <div className={className}>{loadingComponent}</div>
  }

  if (hasError && errorComponent) {
    return <div className={className}>{errorComponent}</div>
  }

  if (isLoading) {
    return (
      <div className={`w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl ${className}`} style={{ height }}>
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span>Cargando mapa...</span>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className={`w-full flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-xl ${className}`} style={{ height }}>
        <div className="text-red-600 text-center">
          <p className="font-semibold">Error al cargar el mapa</p>
          <p className="text-sm">{errorMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`universal-map-container ${className}`}>
      <UniversalMapCore
        layers={layers}
        height={typeof height === 'string' ? height : `${height}px`}
        theme={theme}
        onLayerToggle={handleLayerToggle}
        onFeatureClick={onFeatureClick}
        enableFullscreen={enableFullscreen}
        enableCenterView={enableCenterView}
        enableLayerControls={enableLayerControls}
      />
    </div>
  )
}

// Componentes especializados simplificados
export const ChoroplethMap: React.FC<Omit<UniversalMapProps, 'geoJsonSources'> & {
  dataProperty: string
  geoJsonSources: string[]
}> = ({ 
  dataProperty, 
  geoJsonSources,
  ...props 
}) => {
  return (
    <UniversalMapComponent
      geoJsonSources={geoJsonSources}
      {...props}
    />
  )
}

export const ProjectUnitsMap: React.FC<UniversalMapProps> = (props) => {
  return (
    <UniversalMapComponent
      {...props}
    />
  )
}

export const SimpleMap: React.FC<UniversalMapProps> = (props) => {
  return (
    <UniversalMapComponent
      interactive={false}
      enableLayerControls={false}
      {...props}
    />
  )
}

export default UniversalMapComponent
