'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, MapPin, Calendar, ChevronDown, RefreshCw, X } from 'lucide-react'

interface FilterState {
  search: string
  estado: string
  centroGestor: string[]
  comunas: string[]
  barrios: string[]
  corregimientos: string[]
  veredas: string[]
  fuentesFinanciamiento: string[]
  filtrosPersonalizados: string[]
  subfiltrosPersonalizados: string[]
  fechaInicio: string
  fechaFin: string
}

interface FilterProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  className?: string
}

// Valores por defecto para evitar errores
const defaultFilters: FilterState = {
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
}

export default function UnifiedFilters({ 
  filters = defaultFilters, 
  onFiltersChange, 
  className = '' 
}: FilterProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [openDropdowns, setOpenDropdowns] = useState({
    comunas_barrios: false,
    corregimientos_veredas: false,
    fuente_financiamiento: false,
    filtros_personalizados: false,
    centro_gestor: false
  })
  const [comunasSearch, setComunasSearch] = useState('')
  const [barriosSearch, setBarriosSearch] = useState('')
  const [corregimientosSearch, setCorregimientosSearch] = useState('')
  const [veredasSearch, setVeredasSearch] = useState('')
  const [fuenteFinanciamientoSearch, setFuenteFinanciamientoSearch] = useState('')
  const [filtrosPersonalizadosSearch, setFiltrosPersonalizadosSearch] = useState('')
  const [centroGestorSearch, setCentroGestorSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Asegurar que filters tenga todas las propiedades necesarias
  const safeFilters = {
    ...defaultFilters,
    ...filters
  }

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdowns({
          comunas_barrios: false,
          corregimientos_veredas: false,
          fuente_financiamiento: false,
          filtros_personalizados: false,
          centro_gestor: false
        })
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Datos para los filtros
  const estadosOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'En Ejecución', label: 'En Ejecución' },
    { value: 'Planificación', label: 'Planificación' },
    { value: 'Completado', label: 'Completado' },
    { value: 'Suspendido', label: 'Suspendido' },
    { value: 'En Evaluación', label: 'En Evaluación' }
  ]

  const centroGestorOptions = [
    'Cultura, Recreación y Deporte',
    'Desarrollo Territorial y Participación',
    'Educación Municipal',
    'Infraestructura y Valorización',
    'Salud Pública Municipal',
    'Bienestar Social',
    'Gobierno y Gestión del Territorio',
    'Hacienda Municipal'
  ]

  // Datos reales extraídos de los archivos GeoJSON de Cali
  const comunasOptions = [
    'Comuna 1', 'Comuna 2', 'Comuna 3', 'Comuna 4', 'Comuna 5', 'Comuna 6',
    'Comuna 7', 'Comuna 8', 'Comuna 9', 'Comuna 10', 'Comuna 11', 'Comuna 12',
    'Comuna 13', 'Comuna 14', 'Comuna 15', 'Comuna 16', 'Comuna 17', 'Comuna 18',
    'Comuna 19', 'Comuna 20', 'Comuna 21', 'Comuna 22'
  ]

  const barriosOptions = [
    'Aguablanca', 'Alfonso López', 'Álvaro García Real', 'Antonio Nariño',
    'Aranjuez', 'Ático', 'Belén', 'Bellavista', 'Bosques del Limonar',
    'Bretaña', 'Brisas de los Alpes', 'Caldas', 'Camilo Torres',
    'Campo Bello', 'Caney', 'Caney El Vergel', 'Capri', 'Caracolí',
    'Centenario', 'Centro', 'Chapinero', 'Ciudad 2000', 'Ciudad Córdoba',
    'Ciudad Jardín', 'Ciudad Los Alamos', 'Cristóbal Colón', 'Departamental',
    'El Calvario', 'El Guabal', 'El Jordán', 'El Limonar', 'El Peñón',
    'El Poblado', 'El Poblado II', 'El Refugio', 'El Retiro', 'El Rodeo',
    'El Rosario', 'El Silencio', 'El Trébol', 'El Vallado', 'Flora Industrial',
    'Granada', 'Guayaquil', 'Julio Rincón', 'La Base', 'La Buitrera',
    'La Campiña', 'La Casona', 'La Esperanza', 'La Estrella', 'La Flora',
    'La Fortaleza', 'La Libertad', 'La Linda', 'La Merced', 'La Portada',
    'La Rivera', 'La Selva', 'Las Américas', 'Las Granjas', 'Las Palmas',
    'León XIII', 'Los Andes', 'Los Chorros', 'Los Conquistadores',
    'Los Libertadores', 'Los Naranjos', 'Los Parques', 'Los Pinos',
    'Mariano Ramos', 'Marroquín', 'Meléndez', 'Metropolitano del Norte',
    'Nueva Floresta', 'Nuevo Latir', 'Obrero', 'Omar Torrijos',
    'Pance', 'Panamericano', 'Pasoancho', 'Peñón de los Muertos',
    'Petecuy', 'Picaleña', 'Pizamos', 'Polvorines', 'Primitivo Iglesias',
    'Pueblo Joven', 'Puerto Mallarino', 'República de Israel',
    'Salomia', 'San Antonio', 'San Bosco', 'San Cayetano', 'San Fernando',
    'San José', 'San Luis', 'San Nicolás', 'San Pascual', 'San Pedro',
    'Santa Elena', 'Santa Mónica', 'Santa Rosa', 'Siloé', 'Sindical',
    'Sucre', 'Terrón Colorado', 'Ulpiano Lloreda', 'Unión de Vivienda Popular',
    'Universidad', 'Vallado', 'Versalles', 'Villa Colombia', 'Villa del Lago',
    'Villa Luz', 'Villanueva'
  ]

  const corregimientosOptions = [
    'Andes', 'Buitrera', 'Cañaveralejo', 'Dapa', 'El Saladito',
    'Felidia', 'Golondrinas', 'Hormiguero', 'La Castilla', 'La Elvira',
    'La Leonera', 'La Paz', 'Los Alpes', 'Montebello', 'Navarro',
    'Pance', 'Pichindé', 'Santa Lucía', 'Villa Carmelo'
  ]

  const veredasOptions = [
    'Alto Aguacatal', 'Alto de las Flores', 'Alto de los Mangos',
    'Alto del Nudo', 'Alto del Rey', 'Bajo Aguacatal', 'Bajo Calima',
    'Bocas del Palo', 'Bolo Azul', 'Bolo Blanco', 'Bolo San Isidro',
    'Buchitolo', 'Buenos Aires', 'Caldono', 'Camelias', 'Campo Alegre',
    'Cañas Gordas', 'Chicoral', 'Chontaduro', 'Ciprés', 'El Banqueo',
    'El Brillante', 'El Carmelo', 'El Chocho', 'El Danubio', 'El Diamante',
    'El Guayabo', 'El Hormiguero', 'El Mango', 'El Otoño', 'El Pencil',
    'El Porvenir', 'El Queremal', 'El Rosal', 'El Salado', 'El Saladito',
    'El Topacio', 'El Vínculo', 'Filipinas', 'Garganta de la Vieja',
    'Golondrinas', 'Hojas Anchas', 'La Argentina', 'La Buitrera',
    'La Castellana', 'La Castilla', 'La Esmeralda', 'La Esperanza',
    'La Guardia', 'La Leonera', 'La Palma', 'La Palomera', 'La Paz',
    'La Sirena', 'La Viga', 'Las Brisas', 'Las Nieves', 'Loma de la Cruz',
    'Los Alpes', 'Los Andes', 'Los Mangos', 'Marruecos', 'Miravalle',
    'Montebello', 'Pavas', 'Pico de Loro', 'Pico de Oro', 'Pichindé',
    'Playa Rica', 'Pueblo Nuevo', 'San Antonio de Pichindé',
    'San Francisco', 'San Isidro', 'San Jorge', 'San Pablo',
    'Santa Helena', 'Santa Lucía', 'Santa Rosa', 'Saladito',
    'Tinajas', 'Villa Carmelo', 'Villa Colombia'
  ]

  // Construir mapeos dinámicos para asociar barrios a comunas y veredas a corregimientos.
  // Simulamos una distribución realista para demostrar la funcionalidad
  const comunaBarriosMap = useMemo(() => {
    const map: Record<string, string[]> = {
      'Comuna 1': ['Terrón Colorado', 'Aguablanca', 'El Calvario', 'Primitivo Iglesias'],
      'Comuna 2': ['Obrero', 'San Nicolás', 'Sucre', 'Pizamos'],
      'Comuna 3': ['San Cayetano', 'El Peñón', 'Navarro', 'Santa Rosa'],
      'Comuna 4': ['Alfonso López', 'San Bosco', 'Floralia', 'Álvaro García Real'],
      'Comuna 5': ['Camilo Torres', 'Las Palmas', 'Antonio Nariño', 'República de Israel'],
      'Comuna 6': ['El Rodeo', 'San Luis', 'León XIII', 'Ulpiano Lloreda'],
      'Comuna 7': ['Aguablanca', 'La Flora', 'El Rosario', 'Las Granjas'],
      'Comuna 8': ['Petecuy', 'Villa del Lago', 'Los Chorros', 'Villanueva'],
      'Comuna 9': ['Aranjuez', 'Versalles', 'Centenario', 'Granada'],
      'Comuna 10': ['Bretaña', 'El Guabal', 'San Antonio', 'Sindical'],
      'Comuna 11': ['Guayaquil', 'Santa Elena', 'Pueblo Joven', 'San Pascual'],
      'Comuna 12': ['Doce de Octubre', 'Poblado Campestre', 'Los Libertadores'],
      'Comuna 13': ['Siloé', 'Lleras Camargo', 'Belisario Caicedo'],
      'Comuna 14': ['Polvorines', 'El Refugio', 'Los Alcázares'],
      'Comuna 15': ['El Poblado', 'Los Farallones', 'Montebello'],
      'Comuna 16': ['Valle Grande', 'Los Chorros', 'Ciudad Los Alamos'],
      'Comuna 17': ['Ciudad Jardín', 'Bosques del Limonar', 'El Limonar'],
      'Comuna 18': ['Meléndez', 'Ciudad Capri', 'Los Andes'],
      'Comuna 19': ['El Ingenio', 'Pance', 'Los Farallones'],
      'Comuna 20': ['Siloé', 'Los Chorros', 'Golondrinas'],
      'Comuna 21': ['Ciudad Córdoba', 'Pízamos', 'Valle Grande'],
      'Comuna 22': ['Montebello', 'Los Farallones', 'Pance']
    }
    return map
  }, [])

  const corregimientoVeredasMap = useMemo(() => {
    const map: Record<string, string[]> = {
      'Andes': ['Alto Aguacatal', 'Bajo Aguacatal', 'Campo Alegre'],
      'Buitrera': ['La Buitrera', 'Alto de las Flores', 'El Brillante'],
      'Cañaveralejo': ['Cañas Gordas', 'El Chocho', 'Los Mangos'],
      'Dapa': ['El Danubio', 'El Diamante', 'Santa Helena'],
      'El Saladito': ['El Saladito', 'Saladito', 'El Salado'],
      'Felidia': ['Filipinas', 'El Topacio', 'La Castellana'],
      'Golondrinas': ['Golondrinas', 'Las Brisas', 'Alto del Rey'],
      'Hormiguero': ['El Hormiguero', 'El Banqueo', 'Buchitolo'],
      'La Castilla': ['La Castilla', 'La Guardia', 'San Jorge'],
      'La Elvira': ['La Elvira', 'Buenos Aires', 'El Carmelo'],
      'La Leonera': ['La Leonera', 'La Palomera', 'San Antonio de Pichindé'],
      'La Paz': ['La Paz', 'Las Nieves', 'Santa Rosa'],
      'Los Alpes': ['Los Alpes', 'Miravalle', 'Loma de la Cruz'],
      'Montebello': ['Montebello', 'El Vínculo', 'Playa Rica'],
      'Navarro': ['Caldono', 'Chicoral', 'El Rosal'],
      'Pance': ['Pico de Loro', 'Pico de Oro', 'Villa Carmelo'],
      'Pichindé': ['Pichindé', 'San Pablo', 'Tinajas'],
      'Santa Lucía': ['Santa Lucía', 'El Pencil', 'Villa Colombia'],
      'Villa Carmelo': ['Villa Carmelo', 'Pueblo Nuevo', 'San Francisco']
    }
    return map
  }, [])

  // Opciones de fuentes de financiamiento
  const fuentesFinanciamientoOptions = [
    'Recursos Propios',
    'Sistema General de Participaciones - SGP',
    'Sistema General de Regalías - SGR',
    'Fondo Nacional de Regalías',
    'Cooperación Internacional',
    'Crédito Externo',
    'Crédito Interno',
    'Ministerio de Vivienda',
    'Ministerio de Transporte',
    'Ministerio de Educación',
    'Ministerio de Salud',
    'INVIAS',
    'FINDETER',
    'Banco Mundial',
    'BID - Banco Interamericano de Desarrollo',
    'CAF - Banco de Desarrollo de América Latina',
    'Unión Europea',
    'USAID',
    'Agencia Francesa de Desarrollo',
    'Cooperación Española',
    'Cooperación Alemana GIZ',
    'Recursos Propios del Departamento',
    'Fondo de Desarrollo Regional',
    'Sobretasa a la Gasolina',
    'Estampilla Pro-Desarrollo',
    'Valorización',
    'Plus Valía',
    'Otras Fuentes'
  ]

  // Opciones de filtros personalizados
  // Opciones para filtros personalizados con estructura jerárquica (categorías principales)
  const filtrosPersonalizadosOptions = ['Invertir para crecer', 'Seguridad']
  
  // Subfiltros personalizados (subcategorías)
  const subfiltrosPersonalizadosOptions = [
    'Sanar heridas del pasado',
    'Cali al futuro', 
    'Motores estratégicos de desarrollo',
    'Lucha contra el terrorismo',
    'Orden Vial'
  ]
  const getBarriosForComunas = (selectedComunas: string[] | undefined) => {
    if (!selectedComunas || selectedComunas.length === 0) return []
    const set = new Set<string>()
    selectedComunas.forEach(comuna => {
      const barrios = comunaBarriosMap[comuna]
      if (barrios) {
        barrios.forEach(barrio => set.add(barrio))
      }
    })
    return Array.from(set)
  }

  const getVeredasForCorregimientos = (selectedCorregimientos: string[] | undefined) => {
    if (!selectedCorregimientos || selectedCorregimientos.length === 0) return []
    const set = new Set<string>()
    selectedCorregimientos.forEach(corr => {
      const veredas = corregimientoVeredasMap[corr]
      if (veredas) {
        veredas.forEach(vereda => set.add(vereda))
      }
    })
    return Array.from(set)
  }

  // Mapeo de filtros personalizados a subfiltros (jerárquico)
  const filtroSubfiltroMap = useMemo(() => {
    return {
      'Invertir para crecer': ['Sanar heridas del pasado', 'Cali al futuro', 'Motores estratégicos de desarrollo'],
      'Seguridad': ['Lucha contra el terrorismo', 'Orden Vial']
    }
  }, [])

  const getSubfiltrosForFiltros = (selectedFiltros: string[] | undefined) => {
    if (!selectedFiltros || selectedFiltros.length === 0) return []
    const set = new Set<string>()
    selectedFiltros.forEach(filtro => {
      const subfiltros = filtroSubfiltroMap[filtro as keyof typeof filtroSubfiltroMap] || []
      subfiltros.forEach(subfiltro => set.add(subfiltro))
    })
    return Array.from(set)
  }

  const updateFilters = (newFilters: Partial<FilterState>) => {
    if (onFiltersChange) {
      onFiltersChange({ ...safeFilters, ...newFilters })
    }
  }

  const resetFilters = () => {
    if (onFiltersChange) {
  onFiltersChange(defaultFilters)
  // cerrar dropdowns al limpiar
  setOpenDropdowns({ comunas_barrios: false, corregimientos_veredas: false, fuente_financiamiento: false, filtros_personalizados: false, centro_gestor: false })
    }
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (safeFilters.search) count++
    if (safeFilters.estado !== 'all') count++
    if (safeFilters.centroGestor && safeFilters.centroGestor.length > 0) count++
    if (safeFilters.comunas && safeFilters.comunas.length > 0) count++
    if (safeFilters.barrios && safeFilters.barrios.length > 0) count++
    if (safeFilters.corregimientos && safeFilters.corregimientos.length > 0) count++
    if (safeFilters.veredas && safeFilters.veredas.length > 0) count++
    if (safeFilters.fuentesFinanciamiento && safeFilters.fuentesFinanciamiento.length > 0) count++
    if (safeFilters.filtrosPersonalizados && safeFilters.filtrosPersonalizados.length > 0) count++
    if (safeFilters.subfiltrosPersonalizados && safeFilters.subfiltrosPersonalizados.length > 0) count++
    if (safeFilters.fechaInicio) count++
    if (safeFilters.fechaFin) count++
    return count
  }

  const removeFilter = (filterType: string, value?: string) => {
    switch (filterType) {
      case 'search':
        updateFilters({ search: '' })
        break
      case 'estado':
        updateFilters({ estado: 'all' })
        break
      case 'centroGestor':
        if (value) {
          updateFilters({ centroGestor: safeFilters.centroGestor.filter(c => c !== value) })
        } else {
          updateFilters({ centroGestor: [] })
        }
        break
      case 'fechaInicio':
        updateFilters({ fechaInicio: '' })
        break
      case 'fechaFin':
        updateFilters({ fechaFin: '' })
        break
      case 'comunas':
        if (value) {
          const updatedComunas = safeFilters.comunas.filter(c => c !== value)
          if (updatedComunas.length === 0) {
            updateFilters({ comunas: [], barrios: [] })
          } else {
            const allowedBarrios = new Set(getBarriosForComunas(updatedComunas))
            const filteredBarrios = (safeFilters.barrios || []).filter(b => allowedBarrios.has(b))
            updateFilters({ comunas: updatedComunas, barrios: filteredBarrios })
          }
        } else {
          updateFilters({ comunas: [], barrios: [] })
        }
        break
      case 'barrios':
        if (value) {
          updateFilters({ barrios: safeFilters.barrios.filter(b => b !== value) })
        } else {
          updateFilters({ barrios: [] })
        }
        break
      case 'corregimientos':
        if (value) {
          const updatedCorregimientos = safeFilters.corregimientos.filter(c => c !== value)
          if (updatedCorregimientos.length === 0) {
            updateFilters({ corregimientos: [], veredas: [] })
          } else {
            const allowedVeredas = new Set(getVeredasForCorregimientos(updatedCorregimientos))
            const filteredVeredas = (safeFilters.veredas || []).filter(v => allowedVeredas.has(v))
            updateFilters({ corregimientos: updatedCorregimientos, veredas: filteredVeredas })
          }
        } else {
          updateFilters({ corregimientos: [], veredas: [] })
        }
        break
      case 'veredas':
        if (value) {
          updateFilters({ veredas: safeFilters.veredas.filter(v => v !== value) })
        } else {
          updateFilters({ veredas: [] })
        }
        break
      case 'fuentesFinanciamiento':
        if (value) {
          updateFilters({ fuentesFinanciamiento: safeFilters.fuentesFinanciamiento.filter(f => f !== value) })
        } else {
          updateFilters({ fuentesFinanciamiento: [] })
        }
        break
      case 'filtrosPersonalizados':
        if (value) {
          const updatedFiltros = safeFilters.filtrosPersonalizados.filter(f => f !== value)
          const validSubfiltros = getSubfiltrosForFiltros(updatedFiltros)
          const filteredSubfiltros = (safeFilters.subfiltrosPersonalizados || []).filter(s => validSubfiltros.includes(s))
          updateFilters({ 
            filtrosPersonalizados: updatedFiltros, 
            subfiltrosPersonalizados: filteredSubfiltros 
          })
        } else {
          updateFilters({ filtrosPersonalizados: [], subfiltrosPersonalizados: [] })
        }
        break
      case 'subfiltrosPersonalizados':
        if (value) {
          updateFilters({ subfiltrosPersonalizados: safeFilters.subfiltrosPersonalizados.filter(s => s !== value) })
        } else {
          updateFilters({ subfiltrosPersonalizados: [] })
        }
        break
    }
  }

  const handleCheckboxChange = (
    type: 'comunas' | 'barrios' | 'corregimientos' | 'veredas',
    value: string,
    checked: boolean
  ) => {
    const currentValues = safeFilters[type] || []
    if (checked) {
      updateFilters({ [type]: [...currentValues, value] })
    } else {
      updateFilters({ [type]: currentValues.filter(v => v !== value) })
    }
  }

  const toggleDropdown = (type: 'comunas_barrios' | 'corregimientos_veredas' | 'fuente_financiamiento' | 'filtros_personalizados' | 'centro_gestor') => {
    setOpenDropdowns(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  // Funciones para manejar las dependencias jerárquicas
  const handleCentroGestorChange = (centro: string, checked: boolean) => {
    const currentCentros = safeFilters.centroGestor || []
    
    if (checked) {
      const updatedCentros = [...currentCentros, centro]
      updateFilters({ centroGestor: updatedCentros })
    } else {
      const updatedCentros = currentCentros.filter(c => c !== centro)
      updateFilters({ centroGestor: updatedCentros })
    }
  }

  const handleComunaChange = (comuna: string, checked: boolean) => {
    const currentComunas = safeFilters.comunas || []
    const currentBarrios = safeFilters.barrios || []
    
    if (checked) {
      const updatedComunas = [...currentComunas, comuna]
      updateFilters({ comunas: updatedComunas })
    } else {
      const updatedComunas = currentComunas.filter(c => c !== comuna)
      
      // Filtrar barrios que ya no son válidos
      const validBarrios = getBarriosForComunas(updatedComunas)
      const filteredBarrios = currentBarrios.filter(b => validBarrios.includes(b))
      
      updateFilters({ 
        comunas: updatedComunas, 
        barrios: filteredBarrios 
      })
    }
  }

  const handleCorregimientoChange = (corregimiento: string, checked: boolean) => {
    const currentCorregimientos = safeFilters.corregimientos || []
    const currentVeredas = safeFilters.veredas || []
    
    if (checked) {
      const updatedCorregimientos = [...currentCorregimientos, corregimiento]
      updateFilters({ corregimientos: updatedCorregimientos })
    } else {
      const updatedCorregimientos = currentCorregimientos.filter(c => c !== corregimiento)
      
      // Filtrar veredas que ya no son válidas
      const validVeredas = getVeredasForCorregimientos(updatedCorregimientos)
      const filteredVeredas = currentVeredas.filter(v => validVeredas.includes(v))
      
      updateFilters({ 
        corregimientos: updatedCorregimientos, 
        veredas: filteredVeredas 
      })
    }
  }

  const handleFuenteFinanciamientoChange = (fuente: string, checked: boolean) => {
    const currentFuentes = safeFilters.fuentesFinanciamiento || []
    
    if (checked) {
      const updatedFuentes = [...currentFuentes, fuente]
      updateFilters({ fuentesFinanciamiento: updatedFuentes })
    } else {
      const updatedFuentes = currentFuentes.filter(f => f !== fuente)
      updateFilters({ fuentesFinanciamiento: updatedFuentes })
    }
  }

  const handleFiltroPersonalizadoChange = (filtro: string, checked: boolean) => {
    const currentFiltros = safeFilters.filtrosPersonalizados || []
    const currentSubfiltros = safeFilters.subfiltrosPersonalizados || []
    
    if (checked) {
      const updatedFiltros = [...currentFiltros, filtro]
      updateFilters({ filtrosPersonalizados: updatedFiltros })
    } else {
      const updatedFiltros = currentFiltros.filter(f => f !== filtro)
      
      // Filtrar subfiltros que ya no son válidos
      const validSubfiltros = getSubfiltrosForFiltros(updatedFiltros)
      const filteredSubfiltros = currentSubfiltros.filter(s => validSubfiltros.includes(s))
      
      updateFilters({ 
        filtrosPersonalizados: updatedFiltros, 
        subfiltrosPersonalizados: filteredSubfiltros 
      })
    }
  }

  const handleSubfiltroPersonalizadoChange = (subfiltro: string, checked: boolean) => {
    const currentSubfiltros = safeFilters.subfiltrosPersonalizados || []
    
    if (checked) {
      const updatedSubfiltros = [...currentSubfiltros, subfiltro]
      updateFilters({ subfiltrosPersonalizados: updatedSubfiltros })
    } else {
      const updatedSubfiltros = currentSubfiltros.filter(s => s !== subfiltro)
      updateFilters({ subfiltrosPersonalizados: updatedSubfiltros })
    }
  }

  // Listas a mostrar filtradas según las selecciones padre
  const displayedBarrios = getBarriosForComunas(safeFilters.comunas)
  const displayedVeredas = getVeredasForCorregimientos(safeFilters.corregimientos)
  const displayedSubfiltros = getSubfiltrosForFiltros(safeFilters.filtrosPersonalizados)

  // Apply search filtering for dropdown lists
  const filteredComunas = comunasOptions.filter(c => c.toLowerCase().includes(comunasSearch.toLowerCase()))
  const filteredBarrios = displayedBarrios.filter(b => b.toLowerCase().includes(barriosSearch.toLowerCase()))
  const filteredCorregimientos = corregimientosOptions.filter(c => c.toLowerCase().includes(corregimientosSearch.toLowerCase()))
  const filteredVeredas = displayedVeredas.filter(v => v.toLowerCase().includes(veredasSearch.toLowerCase()))
  const filteredFuentesFinanciamiento = fuentesFinanciamientoOptions.filter(f => f.toLowerCase().includes(fuenteFinanciamientoSearch.toLowerCase()))
  const filteredFiltrosPersonalizados = filtrosPersonalizadosOptions.filter(f => f.toLowerCase().includes(filtrosPersonalizadosSearch.toLowerCase()))
  const filteredSubfiltrosPersonalizados = displayedSubfiltros.filter(s => s.toLowerCase().includes(filtrosPersonalizadosSearch.toLowerCase()))
  const filteredCentroGestor = centroGestorOptions.filter(c => c.toLowerCase().includes(centroGestorSearch.toLowerCase()))

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Filtros de Búsqueda</h3>
            {getActiveFiltersCount() > 0 && (
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={resetFilters}
              className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Limpiar</span>
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-1 text-blue-500 hover:text-blue-700 transition-colors duration-200"
            >
              <span className="text-sm">{isExpanded ? 'Contraer' : 'Expandir'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters Content */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-visible"
      >
        <div className="p-4 space-y-4 overflow-visible">
          {/* Barra de Búsqueda Global */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={safeFilters.search}
                  onChange={(e) => updateFilters({ search: e.target.value })}
                  placeholder="Buscar por BPIN, nombre del proyecto, unidad de proyecto, responsable, barrio, comuna..."
                  className="w-full border-0 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-0 text-sm"
                />
              </div>
              {safeFilters.search && (
                <button
                  onClick={() => updateFilters({ search: '' })}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {safeFilters.search && (
              <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                Buscando: &ldquo;<span className="font-medium">{safeFilters.search}</span>&rdquo;
              </div>
            )}
          </div>

          {/* Estado y Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-1"
                value={safeFilters.estado}
                onChange={(e) => updateFilters({ estado: e.target.value })}
              >
                {estadosOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-1"
                value={safeFilters.fechaInicio}
                onChange={(e) => updateFilters({ fechaInicio: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-1"
                value={safeFilters.fechaFin}
                onChange={(e) => updateFilters({ fechaFin: e.target.value })}
              />
            </div>
          </div>

          {/* Geographical filters */}
          <div ref={dropdownRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-3 relative">
            {/* Centro Gestor */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('centro_gestor')}
                className="flex items-center justify-between w-full p-2 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700 rounded-lg cursor-pointer hover:bg-teal-100 dark:hover:bg-teal-800/30 transition-colors duration-200"
              >
                <span className="text-xs font-medium text-teal-700 dark:text-teal-300">Centro Gestor</span>
                <ChevronDown className={`w-3 h-3 text-teal-600 transition-transform duration-200 ${openDropdowns.centro_gestor ? 'rotate-180' : ''}`} />
              </button>

              {openDropdowns.centro_gestor && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-[9999] max-h-80 overflow-y-auto">
                  <div className="p-3">
                    <div className="mb-2">
                      <input
                        type="text"
                        value={centroGestorSearch}
                        onChange={(e) => setCentroGestorSearch(e.target.value)}
                        placeholder="Buscar centro gestor..."
                        className="w-full px-2 py-1 border border-gray-200 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1 max-h-60 overflow-y-auto">
                      {filteredCentroGestor.map(centro => (
                        <label key={centro} className="flex items-center space-x-2 p-1 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                            checked={safeFilters.centroGestor?.includes(centro) || false}
                            onChange={(e) => handleCentroGestorChange(centro, e.target.checked)}
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{centro}</span>
                        </label>
                      ))}
                      {filteredCentroGestor.length === 0 && (
                        <div className="text-sm text-gray-500 text-center py-2">
                          No se encontraron centros gestores
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fuente de Financiamiento */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('fuente_financiamiento')}
                className="flex items-center justify-between w-full p-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-colors duration-200"
              >
                <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Fuente de Financiamiento</span>
                <ChevronDown className={`w-3 h-3 text-purple-600 transition-transform duration-200 ${openDropdowns.fuente_financiamiento ? 'rotate-180' : ''}`} />
              </button>

              {openDropdowns.fuente_financiamiento && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-[9999] max-h-80 overflow-y-auto">
                  <div className="p-3">
                    <div className="mb-2">
                      <input
                        type="text"
                        value={fuenteFinanciamientoSearch}
                        onChange={(e) => setFuenteFinanciamientoSearch(e.target.value)}
                        placeholder="Buscar fuente..."
                        className="w-full px-2 py-1 border border-gray-200 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1 max-h-60 overflow-y-auto">
                      {filteredFuentesFinanciamiento.map(fuente => (
                        <label key={fuente} className="flex items-center space-x-2 p-1 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            checked={safeFilters.fuentesFinanciamiento?.includes(fuente) || false}
                            onChange={(e) => handleFuenteFinanciamientoChange(fuente, e.target.checked)}
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{fuente}</span>
                        </label>
                      ))}
                      {filteredFuentesFinanciamiento.length === 0 && (
                        <div className="text-sm text-gray-500 text-center py-2">
                          No se encontraron fuentes
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Comunas & Barrios */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('comunas_barrios')}
                className="flex items-center justify-between w-full p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors duration-200"
              >
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Comunas y Barrios</span>
                <ChevronDown className={`w-3 h-3 text-blue-600 transition-transform duration-200 ${openDropdowns.comunas_barrios ? 'rotate-180' : ''}`} />
              </button>

              {openDropdowns.comunas_barrios && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-[9999] max-h-80 overflow-y-auto">
                  <div className="p-3">
                    {/* Comunas list with search */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2 border-b border-blue-200 dark:border-blue-700 pb-1">Comunas</h4>
                      <div className="mb-2">
                        <input
                          type="text"
                          value={comunasSearch}
                          onChange={(e) => setComunasSearch(e.target.value)}
                          placeholder="Buscar comuna..."
                          className="w-full px-2 py-1 border border-gray-200 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {filteredComunas.map(comuna => (
                          <label key={comuna} className="flex items-center space-x-2 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              checked={safeFilters.comunas?.includes(comuna) || false}
                              onChange={(e) => handleComunaChange(comuna, e.target.checked)}
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{comuna}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Barrios list with search */}
                    <div>
                      <h4 className="text-sm font-semibold text-green-700 dark:text-green-300 mb-2 border-b border-green-200 dark:border-green-700 pb-1 flex items-center justify-between">
                        <span>Barrios</span>
                        {(!safeFilters.comunas || safeFilters.comunas.length === 0) && (
                          <span className="text-xs text-gray-500 italic">Selecciona primero una comuna</span>
                        )}
                        {(safeFilters.comunas && safeFilters.comunas.length > 0 && displayedBarrios.length === 0) && (
                          <span className="text-xs text-orange-500 italic">No hay barrios disponibles</span>
                        )}
                      </h4>

                      <div className="mb-2">
                        <input
                          type="text"
                          value={barriosSearch}
                          onChange={(e) => setBarriosSearch(e.target.value)}
                          placeholder="Buscar barrio..."
                          className="w-full px-2 py-1 border border-gray-200 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          disabled={!safeFilters.comunas || safeFilters.comunas.length === 0}
                        />
                      </div>

                      <div className={`space-y-1 max-h-32 overflow-y-auto ${(!safeFilters.comunas || safeFilters.comunas.length === 0) ? 'opacity-50' : ''}`}>
                        {filteredBarrios.length > 0 ? (
                          filteredBarrios.map(barrio => (
                            <label key={barrio} className="flex items-center space-x-2 p-1 hover:bg-green-50 dark:hover:bg-green-900/20 rounded cursor-pointer">
                              <input
                                type="checkbox"
                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                checked={safeFilters.barrios?.includes(barrio) || false}
                                onChange={(e) => handleCheckboxChange('barrios', barrio, e.target.checked)}
                                disabled={!safeFilters.comunas || safeFilters.comunas.length === 0}
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{barrio}</span>
                            </label>
                          ))
                        ) : (
                          <div className="text-center py-2 text-gray-500 dark:text-gray-400 text-sm">
                            {(!safeFilters.comunas || safeFilters.comunas.length === 0) 
                              ? 'Selecciona una comuna para ver barrios'
                              : 'No hay barrios disponibles para las comunas seleccionadas'
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Corregimientos & Veredas */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('corregimientos_veredas')}
                className="flex items-center justify-between w-full p-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-800/30 transition-colors duration-200"
              >
                <span className="text-xs font-medium text-orange-700 dark:text-orange-300">Corregimientos y Veredas</span>
                <ChevronDown className={`w-3 h-3 text-orange-600 transition-transform duration-200 ${openDropdowns.corregimientos_veredas ? 'rotate-180' : ''}`} />
              </button>

              {openDropdowns.corregimientos_veredas && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-[9999] max-h-80 overflow-y-auto">
                  <div className="p-3">
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-orange-700 dark:text-orange-300 mb-2 border-b border-orange-200 dark:border-orange-700 pb-1">Corregimientos</h4>

                      <div className="mb-2">
                        <input
                          type="text"
                          value={corregimientosSearch}
                          onChange={(e) => setCorregimientosSearch(e.target.value)}
                          placeholder="Buscar corregimiento..."
                          className="w-full px-2 py-1 border border-gray-200 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {filteredCorregimientos.map(corregimiento => (
                          <label key={corregimiento} className="flex items-center space-x-2 p-1 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                              checked={safeFilters.corregimientos?.includes(corregimiento) || false}
                              onChange={(e) => handleCorregimientoChange(corregimiento, e.target.checked)}
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{corregimiento}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2 border-b border-purple-200 dark:border-purple-700 pb-1 flex items-center justify-between">
                        <span>Veredas</span>
                        {(!safeFilters.corregimientos || safeFilters.corregimientos.length === 0) && (
                          <span className="text-xs text-gray-500 italic">Selecciona primero un corregimiento</span>
                        )}
                        {(safeFilters.corregimientos && safeFilters.corregimientos.length > 0 && displayedVeredas.length === 0) && (
                          <span className="text-xs text-orange-500 italic">No hay veredas disponibles</span>
                        )}
                      </h4>

                      <div className="mb-2">
                        <input
                          type="text"
                          value={veredasSearch}
                          onChange={(e) => setVeredasSearch(e.target.value)}
                          placeholder="Buscar vereda..."
                          className="w-full px-2 py-1 border border-gray-200 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          disabled={!safeFilters.corregimientos || safeFilters.corregimientos.length === 0}
                        />
                      </div>

                      <div className={`space-y-1 max-h-32 overflow-y-auto ${(!safeFilters.corregimientos || safeFilters.corregimientos.length === 0) ? 'opacity-50' : ''}`}>
                        {filteredVeredas.length > 0 ? (
                          filteredVeredas.map(vereda => (
                            <label key={vereda} className="flex items-center space-x-2 p-1 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded cursor-pointer">
                              <input
                                type="checkbox"
                                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                checked={safeFilters.veredas?.includes(vereda) || false}
                                onChange={(e) => handleCheckboxChange('veredas', vereda, e.target.checked)}
                                disabled={!safeFilters.corregimientos || safeFilters.corregimientos.length === 0}
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{vereda}</span>
                            </label>
                          ))
                        ) : (
                          <div className="text-center py-2 text-gray-500 dark:text-gray-400 text-sm">
                            {(!safeFilters.corregimientos || safeFilters.corregimientos.length === 0) 
                              ? 'Selecciona un corregimiento para ver veredas'
                              : 'No hay veredas disponibles para los corregimientos seleccionados'
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Filtros Personalizados */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('filtros_personalizados')}
                className="flex items-center justify-between w-full p-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-lg cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-800/30 transition-colors duration-200"
              >
                <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">Filtros Personalizados</span>
                <ChevronDown className={`w-3 h-3 text-indigo-600 transition-transform duration-200 ${openDropdowns.filtros_personalizados ? 'rotate-180' : ''}`} />
              </button>

              {openDropdowns.filtros_personalizados && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-[9999] max-h-80 overflow-y-auto">
                  <div className="p-3">
                    <div className="mb-2">
                      <input
                        type="text"
                        value={filtrosPersonalizadosSearch}
                        onChange={(e) => setFiltrosPersonalizadosSearch(e.target.value)}
                        placeholder="Buscar filtro..."
                        className="w-full px-2 py-1 border border-gray-200 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    {/* Categorías principales (Filtros) */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Categorías</h4>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {filteredFiltrosPersonalizados.map(filtro => (
                          <label key={filtro} className="flex items-center space-x-2 p-1 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              checked={safeFilters.filtrosPersonalizados?.includes(filtro) || false}
                              onChange={(e) => handleFiltroPersonalizadoChange(filtro, e.target.checked)}
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{filtro}</span>
                          </label>
                        ))}
                        {filteredFiltrosPersonalizados.length === 0 && (
                          <div className="text-sm text-gray-500 text-center py-2">
                            No se encontraron categorías
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Subcategorías (solo si hay categorías seleccionadas) */}
                    {displayedSubfiltros.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Subcategorías</h4>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {filteredSubfiltrosPersonalizados.map(subfiltro => (
                            <label key={subfiltro} className="flex items-center space-x-2 p-1 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded cursor-pointer">
                              <input
                                type="checkbox"
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                checked={safeFilters.subfiltrosPersonalizados?.includes(subfiltro) || false}
                                onChange={(e) => handleSubfiltroPersonalizadoChange(subfiltro, e.target.checked)}
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{subfiltro}</span>
                            </label>
                          ))}
                          {filteredSubfiltrosPersonalizados.length === 0 && (
                            <div className="text-sm text-gray-500 text-center py-2">
                              No se encontraron subcategorías
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active filters - Solo se muestra si hay filtros activos */}
          {getActiveFiltersCount() > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                  <span>Filtros Activos</span>
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded-full">
                    {getActiveFiltersCount()}
                  </span>
                </h4>
                <button
                  onClick={resetFilters}
                  className="text-xs text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
                >
                  Limpiar todos
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {safeFilters.search && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-full border border-gray-200 dark:border-gray-600">
                    <Search className="w-3 h-3" />
                    Búsqueda: {safeFilters.search}
                    <button onClick={() => removeFilter('search')} className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-1 transition-colors duration-200">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {safeFilters.estado !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full border border-blue-200 dark:border-blue-700">
                    <Filter className="w-3 h-3" />
                    Estado: {safeFilters.estado}
                    <button onClick={() => removeFilter('estado')} className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-1 transition-colors duration-200">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {safeFilters.centroGestor && Array.isArray(safeFilters.centroGestor) && safeFilters.centroGestor.length > 0 && safeFilters.centroGestor.map(centro => (
                  <span key={centro} className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 text-sm rounded-full border border-teal-200 dark:border-teal-700">
                    <MapPin className="w-3 h-3" />
                    {centro}
                    <button onClick={() => removeFilter('centroGestor', centro)} className="hover:bg-teal-200 dark:hover:bg-teal-800 rounded-full p-1 transition-colors duration-200">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {safeFilters.fechaInicio && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full border border-green-200 dark:border-green-700">
                    <Calendar className="w-3 h-3" />
                    Desde: {safeFilters.fechaInicio}
                    <button onClick={() => removeFilter('fechaInicio')} className="hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-1 transition-colors duration-200">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {safeFilters.fechaFin && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full border border-green-200 dark:border-green-700">
                    <Calendar className="w-3 h-3" />
                    Hasta: {safeFilters.fechaFin}
                    <button onClick={() => removeFilter('fechaFin')} className="hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-1 transition-colors duration-200">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {safeFilters.comunas?.map(comuna => (
                  <span key={comuna} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full border border-blue-200 dark:border-blue-700">
                    <MapPin className="w-3 h-3" />
                    {comuna}
                    <button onClick={() => removeFilter('comunas', comuna)} className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-1 transition-colors duration-200">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {safeFilters.barrios?.map(barrio => (
                  <span key={barrio} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full border border-green-200 dark:border-green-700">
                    <MapPin className="w-3 h-3" />
                    {barrio}
                    <button onClick={() => removeFilter('barrios', barrio)} className="hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-1 transition-colors duration-200">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {safeFilters.corregimientos?.map(corregimiento => (
                  <span key={corregimiento} className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-sm rounded-full border border-orange-200 dark:border-orange-700">
                    <MapPin className="w-3 h-3" />
                    {corregimiento}
                    <button onClick={() => removeFilter('corregimientos', corregimiento)} className="hover:bg-orange-200 dark:hover:bg-orange-800 rounded-full p-1 transition-colors duration-200">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {safeFilters.veredas?.map(vereda => (
                  <span key={vereda} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm rounded-full border border-purple-200 dark:border-purple-700">
                    <MapPin className="w-3 h-3" />
                    {vereda}
                    <button onClick={() => removeFilter('veredas', vereda)} className="hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-1 transition-colors duration-200">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {safeFilters.fuentesFinanciamiento?.map(fuente => (
                  <span key={fuente} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm rounded-full border border-purple-200 dark:border-purple-700">
                    <Filter className="w-3 h-3" />
                    {fuente}
                    <button onClick={() => removeFilter('fuentesFinanciamiento', fuente)} className="hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-1 transition-colors duration-200">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {safeFilters.filtrosPersonalizados?.map(filtro => (
                  <span key={filtro} className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-sm rounded-full border border-indigo-200 dark:border-indigo-700">
                    <Filter className="w-3 h-3" />
                    {filtro}
                    <button onClick={() => removeFilter('filtrosPersonalizados', filtro)} className="hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded-full p-1 transition-colors duration-200">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {safeFilters.subfiltrosPersonalizados?.map(subfiltro => (
                  <span key={subfiltro} className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-sm rounded-full border border-indigo-200 dark:border-indigo-700">
                    <Filter className="w-3 h-3" />
                    {subfiltro}
                    <button onClick={() => removeFilter('subfiltrosPersonalizados', subfiltro)} className="hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded-full p-1 transition-colors duration-200">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// Exportar también la interfaz para que otros componentes la puedan usar
export type { FilterState }
