
// ─────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback } from 'react'
import {
  obtenerContactos,
  crearContacto,
  eliminarContacto,
} from '../services/contactoService'
import {
  agregarDatoContacto,
  eliminarDatoContacto,
} from '../services/datoContactoService'

export const useContactos = () => {
  const [contactos,  setContactos]  = useState([])
  const [cargando,   setCargando]   = useState(true)
  const [error,      setError]      = useState(null)
  const [mensaje,    setMensaje]    = useState(null) // { texto, tipo: 'exito'|'error' }

  // ── Mostrar mensaje temporal (3 segundos) ──────────────────
  const mostrarMensaje = (texto, tipo = 'exito') => {
    setMensaje({ texto, tipo })
    setTimeout(() => setMensaje(null), 3500)
  }

  // ── Cargar todos los contactos ─────────────────────────────
  const cargarContactos = useCallback(async () => {
    setCargando(true)
    setError(null)
    const { data, error } = await obtenerContactos()

    if (error) {
      setError('No se pudo conectar con la base de datos. Verifica tu conexión.')
      setCargando(false)
      return
    }

    // Asegurar que dato_contacto siempre sea un arreglo
    const contactosNormalizados = data.map(c => ({
      ...c,
      dato_contacto: c.dato_contacto ?? []
    }))

    setContactos(contactosNormalizados)
    setCargando(false)
  }, [])

  // Cargar al montar el componente
  useEffect(() => {
    cargarContactos()
  }, [cargarContactos])

  // ── Agregar contacto ───────────────────────────────────────
  const handleAgregarContacto = async (nombre, apellido) => {
    const { data, error } = await crearContacto(nombre, apellido)

    if (error) {
      mostrarMensaje('Error al agregar el contacto. Intenta nuevamente.', 'error')
      return false
    }

    // Agregar al estado local sin recargar toda la lista
    const nuevoContacto = { ...data, dato_contacto: [] }
    setContactos(prev => [...prev, nuevoContacto]
      .sort((a, b) => a.apellido.localeCompare(b.apellido)))

    mostrarMensaje(`Contacto ${data.nombre} ${data.apellido} agregado correctamente.`)
    return true
  }

  // ── Eliminar contacto ──────────────────────────────────────
  const handleEliminarContacto = async (idContacto) => {
    const { error } = await eliminarContacto(idContacto)

    if (error) {
      mostrarMensaje('Error al eliminar el contacto.', 'error')
      return
    }

    // Quitar del estado local inmediatamente
    setContactos(prev => prev.filter(c => c.id_contacto !== idContacto))
    mostrarMensaje('Contacto eliminado correctamente.')
  }

  // ── Agregar o actualizar dato de contacto ─────────────────
  const handleAgregarDato = async (idContacto, datoData) => {
    const { data, error, actualizado } = await agregarDatoContacto({
      idContacto,
      ...datoData,
    })

    if (error) {
      mostrarMensaje(error.message || 'Error al agregar el dato.', 'error')
      return false
    }

    // Recargar desde Supabase para garantizar sincronización exacta
    await cargarContactos()

    // Mensaje diferente según si fue creación o actualización
    const textoMensaje = actualizado
      ? `Los datos de contacto de tipo ${datoData.tipo} fueron actualizados correctamente.`
      : 'Dato de contacto agregado correctamente.'

    mostrarMensaje(textoMensaje)
    return true
  }

  // ── Eliminar dato de contacto ──────────────────────────────
  const handleEliminarDato = async (idContacto, idDatoContacto) => {
    const { error } = await eliminarDatoContacto(idDatoContacto)

    if (error) {
      mostrarMensaje('Error al eliminar el dato de contacto.', 'error')
      return
    }

    // Actualizar estado local sin recargar
    setContactos(prev => prev.map(c => {
      if (c.id_contacto !== idContacto) return c
      return {
        ...c,
        dato_contacto: c.dato_contacto.filter(
          d => d.id_dato_contacto !== idDatoContacto
        )
      }
    }))

    mostrarMensaje('Dato eliminado correctamente.')
  }

  return {
    contactos,
    cargando,
    error,
    mensaje,
    handleAgregarContacto,
    handleEliminarContacto,
    handleAgregarDato,
    handleEliminarDato,
  }
}