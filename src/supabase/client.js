// src/supabase/client.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validación temprana: si faltan las variables, avisa en consola
if (!supabaseUrl || !supabaseKey) {
  console.error(
    'Error: faltan las variables de entorno VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY.\n' +
    'Verifica que el archivo .env existe en la raíz del proyecto.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)
