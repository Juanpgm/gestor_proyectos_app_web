'use client'

import React, { useMemo } from 'react'
import UniversalMapCore, { MapLayer } from './UniversalMapCore'
import { ProjectMapData } from './ProjectMapUnified'

export interface ProjectMapCoreProps {
  data: ProjectMapData
  baseMapConfig: {
    name: string
    url: string
    attribution: string
  }
  layerVisibility: {
    equipamientos: boolean
    infraestructura: boolean
    unidadesProyecto: boolean
  }
  height: string
  theme: string
}

const ProjectMapCore: React.FC<ProjectMapCoreProps> = ({
  data,
  baseMapConfig,
  layerVisibility,
  height,
  theme
}) => {
  // Convertir datos a formato de capas unificado
  const layers: MapLayer[] = useMemo(() => {
    const mapLayers: MapLayer[] = []

    // Capa de equipamientos
    if (data.equipamientos) {
      mapLayers.push({
        id: 'equipamientos',
        name: 'Equipamientos',
        data: data.equipamientos,
        visible: layerVisibility.equipamientos,
        type: 'geojson'
      })
    }

    // Capa de infraestructura
    if (data.infraestructura) {
      mapLayers.push({
        id: 'infraestructura',
        name: 'Infraestructura',
        data: data.infraestructura,
        visible: layerVisibility.infraestructura,
        type: 'geojson'
      })
    }

    // Capa de unidades de proyecto como puntos
    if (data.unidadesProyecto && data.unidadesProyecto.length > 0) {
      mapLayers.push({
        id: 'unidadesProyecto',
        name: 'Unidades de Proyecto',
        data: data.unidadesProyecto.filter(p => p.lat && p.lng),
        visible: layerVisibility.unidadesProyecto,
        type: 'points'
      })
    }

    return mapLayers
  }, [data, layerVisibility])

  return (
    <UniversalMapCore
      layers={layers}
      baseMapUrl={baseMapConfig.url}
      baseMapAttribution={baseMapConfig.attribution}
      height={height}
      theme={theme}
      enableFullscreen={true}
      enableCenterView={true}
      enableLayerControls={false} // Las usa el componente padre
    />
  )
}

export default ProjectMapCore
