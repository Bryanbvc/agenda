
import { supabase } from '../supabase/client'

// ── Obtener todos los contactos con sus datos de contacto ────
export const obtenerContactos = async () => {
  const { data, error } = await supabase
    .from('contacto')
    .select(`
      id_contacto,
      nombre,
      apellido,
      dato_contacto (
        id_dato_contacto,
        tipo,
        correo,
        telefono,
        direccion
      )
    `)
    .order('apellido', { ascending: true })

  if (error) {
    console.error('Error al obtener contactos:', error.message)
    return { data: null, error }
  }

  return { data, error: null }
}

// ── Crear un nuevo contacto ───────────────────────────────────
// Recibe nombre y apellido (strings).
// Retorna el contacto recién creado para agregarlo al estado.
export const crearContacto = async (nombre, apellido) => {
  const { data, error } = await supabase
    .from('contacto')
    .insert([{ nombre: nombre.trim(), apellido: apellido.trim() }])
    .select()
    .single()

  if (error) {
    console.error('Error al crear contacto:', error.message)
    return { data: null, error }
  }

  return { data, error: null }
}


export const eliminarContacto = async (idContacto) => {
  const { error } = await supabase
    .from('contacto')
    .delete()
    .eq('id_contacto', idContacto)

  if (error) {
    console.error('Error al eliminar contacto:', error.message)
    return { error }
  }

  return { error: null }
}
