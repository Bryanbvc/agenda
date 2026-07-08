// src/services/datoContactoService.js
import { supabase } from '../supabase/client'

export const agregarDatoContacto = async ({
  idContacto,
  tipo,
  correo,
  telefono,
  direccion,
}) => {
  // Limpiar valores: string vacío se convierte en null
  const correoNuevo    = correo?.trim()    || null
  const telefonoNuevo  = telefono?.trim()  || null
  const direccionNueva = direccion?.trim() || null

  // Validación: al menos un campo debe tener valor
  if (!correoNuevo && !telefonoNuevo && !direccionNueva) {
    return {
      data: null,
      error: { message: 'Debes ingresar al menos un dato: correo, teléfono o dirección.' },
      actualizado: false,
    }
  }

  // ── PASO 1: Buscar si ya existe un registro del mismo tipo ──
  const { data: existente, error: errorBusqueda } = await supabase
    .from('dato_contacto')
    .select('*')
    .eq('id_contacto', idContacto)
    .eq('tipo', tipo)
    .maybeSingle() // retorna null si no existe, sin lanzar error

  if (errorBusqueda) {
    console.error('Error al buscar dato existente:', errorBusqueda.message)
    return { data: null, error: errorBusqueda, actualizado: false }
  }

  // ── PASO 2A: Si existe → UPDATE conservando campos anteriores ──
  if (existente) {
    // Mezclar: si el nuevo campo tiene valor lo usa, si no conserva el anterior
    const correoFinal    = correoNuevo    ?? existente.correo
    const telefonoFinal  = telefonoNuevo  ?? existente.telefono
    const direccionFinal = direccionNueva ?? existente.direccion

    const { data, error } = await supabase
      .from('dato_contacto')
      .update({
        correo:    correoFinal,
        telefono:  telefonoFinal,
        direccion: direccionFinal,
      })
      .eq('id_dato_contacto', existente.id_dato_contacto)
      .select()
      .single()

    if (error) {
      console.error('Error al actualizar dato de contacto:', error.message)
      return { data: null, error, actualizado: false }
    }

    return { data, error: null, actualizado: true }
  }

  // ── PASO 2B: Si no existe → INSERT nuevo ───────────────────
  const { data, error } = await supabase
    .from('dato_contacto')
    .insert([{
      id_contacto: idContacto,
      tipo,
      correo:    correoNuevo,
      telefono:  telefonoNuevo,
      direccion: direccionNueva,
    }])
    .select()
    .single()

  if (error) {
    console.error('Error al insertar dato de contacto:', error.message)
    return { data: null, error, actualizado: false }
  }

  return { data, error: null, actualizado: false }
}

// ── Eliminar un dato de contacto por ID ──────────────────────
export const eliminarDatoContacto = async (idDatoContacto) => {
  const { error } = await supabase
    .from('dato_contacto')
    .delete()
    .eq('id_dato_contacto', idDatoContacto)

  if (error) {
    console.error('Error al eliminar dato de contacto:', error.message)
    return { error }
  }

  return { error: null }
}