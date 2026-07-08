// src/utils/validaciones.js
// ─────────────────────────────────────────────────────────────
// Funciones de validación reutilizables para los formularios.
// No usan RegEx: se validan recorriendo los caracteres a mano.
// ─────────────────────────────────────────────────────────────

// valida que nombre y apellido no esten vacios
export function validarContacto(nombre, apellido) {
  if (!nombre.trim() || !apellido.trim()) {
    return 'El nombre y el apellido son obligatorios'
  }
  return null
}

// extensiones de correo reconocidas (se puede ampliar si falta alguna)
const EXTENSIONES_VALIDAS = [
  'com', 'net', 'org', 'edu', 'gob', 'gov', 'info', 'io', 'co', 'biz',
  'app', 'dev', 'cl', 'es', 'mx', 'ar', 'pe', 'uy', 'br', 'us', 'uk',
  'de', 'fr', 'it'
]

// true si el caracter es una letra minúscula a-z
const esLetraMinuscula = (c) => c >= 'a' && c <= 'z'

// valida el formato de un correo electronico y que tenga una extension real
// (sin usar RegEx, recorriendo el texto caracter por caracter)
export function validarCorreo(correo) {
  const valor = correo.trim()
  if (!valor) return 'El correo es obligatorio'

  // 1) Debe tener exactamente una '@', sin espacios, y algo antes y después
  let posArroba = -1
  for (let i = 0; i < valor.length; i++) {
    const c = valor[i]
    if (c === ' ') return 'El correo no puede contener espacios'
    if (c === '@') {
      if (posArroba !== -1) return 'El correo no tiene un formato valido'
      posArroba = i
    }
  }
  if (posArroba <= 0 || posArroba === valor.length - 1) {
    return 'El correo no tiene un formato valido'
  }

  const usuario = valor.slice(0, posArroba)
  const dominio = valor.slice(posArroba + 1)
  if (!usuario) return 'El correo no tiene un formato valido'

  // 2) El dominio debe tener al menos un punto, sin quedar al inicio/final
  //    y sin puntos seguidos ('..')
  let posUltimoPunto = -1
  for (let i = 0; i < dominio.length; i++) {
    if (dominio[i] === '.') {
      if (i === 0 || i === dominio.length - 1) {
        return 'El correo no tiene un formato valido'
      }
      if (dominio[i - 1] === '.') {
        return 'El correo no tiene un formato valido'
      }
      posUltimoPunto = i
    }
  }
  if (posUltimoPunto === -1) return 'El correo no tiene un formato valido'

  // 3) La extension es lo que queda despues del ultimo punto
  const extension = dominio.slice(posUltimoPunto + 1).toLowerCase()

  if (extension.length < 2 || extension.length > 10) {
    return 'El correo no tiene una extension valida'
  }
  for (let i = 0; i < extension.length; i++) {
    if (!esLetraMinuscula(extension[i])) {
      return 'El correo no tiene una extension valida'
    }
  }

  if (!EXTENSIONES_VALIDAS.includes(extension)) {
    return 'El correo no tiene una extension reconocida (ej: .com, .cl, .org)'
  }

  return null
}

// valida el formato de un telefono (numeros, espacios, +, - y parentesis)
// sin usar RegEx, recorriendo el texto caracter por caracter
export function validarTelefono(telefono) {
  const valor = telefono.trim()
  if (!valor) return 'El telefono es obligatorio'

  if (valor.length < 6 || valor.length > 20) {
    return 'El telefono no tiene un formato valido'
  }

  const permitidos = '0123456789+- ()'
  for (let i = 0; i < valor.length; i++) {
    if (!permitidos.includes(valor[i])) {
      return 'El telefono no tiene un formato valido'
    }
  }

  return null
}

// valida que la direccion no este vacia
export function validarDireccion(direccion) {
  if (!direccion.trim()) return 'La direccion es obligatoria'
  return null
}
