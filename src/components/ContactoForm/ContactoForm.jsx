// src/components/ContactoForm/ContactoForm.jsx
import { useState } from 'react'
import './ContactoForm.css'

// Valida que el campo no tenga números ni caracteres especiales
const soloLetras = (valor) => {
  for (let i = 0; i < valor.length; i++) {
    const c = valor.charCodeAt(i)
    // Permite letras (a-z, A-Z), tildes, ñ, espacios
    const esLetra = (c >= 65 && c <= 90)  ||
                    (c >= 97 && c <= 122) ||
                    (c >= 192 && c <= 255) ||
                    c === 32
    if (!esLetra) return false
  }
  return true
}

function ContactoForm({ onAgregar }) {
  const [nombre,    setNombre]    = useState('')
  const [apellido,  setApellido]  = useState('')
  const [errores,   setErrores]   = useState({})
  const [guardando, setGuardando] = useState(false)

  // ── Validación ─────────────────────────────────────────────
  const validar = () => {
    const nuevosErrores = {}

    if (!nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio.'
    } else if (nombre.trim().length > 100) {
      nuevosErrores.nombre = 'El nombre no puede tener más de 100 caracteres.'
    } else if (!soloLetras(nombre.trim())) {
      nuevosErrores.nombre = 'El nombre solo puede contener letras.'
    }

    if (!apellido.trim()) {
      nuevosErrores.apellido = 'El apellido es obligatorio.'
    } else if (apellido.trim().length > 100) {
      nuevosErrores.apellido = 'El apellido no puede tener más de 100 caracteres.'
    } else if (!soloLetras(apellido.trim())) {
      nuevosErrores.apellido = 'El apellido solo puede contener letras.'
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  // ── Envío ──────────────────────────────────────────────────
  const handleEnviar = async () => {
    if (!validar()) return

    setGuardando(true)
    const exito = await onAgregar(nombre, apellido)
    setGuardando(false)

    if (exito) {
      setNombre('')
      setApellido('')
      setErrores({})
    }
  }

  // Limpiar error al escribir
  const handleChangeNombre = (e) => {
    setNombre(e.target.value)
    if (errores.nombre) setErrores(prev => ({ ...prev, nombre: null }))
  }

  const handleChangeApellido = (e) => {
    setApellido(e.target.value)
    if (errores.apellido) setErrores(prev => ({ ...prev, apellido: null }))
  }

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="contacto-form-card">
      <h2 className="contacto-form-titulo">Agregar Contacto</h2>

      <div className="row g-2 align-items-start">

        {/* Nombre */}
        <div className="col-12 col-sm-5">
          <input
            type="text"
            className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
            placeholder="Nombre"
            value={nombre}
            onChange={handleChangeNombre}
            maxLength={100}
            disabled={guardando}
          />
          {errores.nombre && (
            <div className="invalid-feedback">{errores.nombre}</div>
          )}
        </div>

        {/* Apellido */}
        <div className="col-12 col-sm-5">
          <input
            type="text"
            className={`form-control ${errores.apellido ? 'is-invalid' : ''}`}
            placeholder="Apellido"
            value={apellido}
            onChange={handleChangeApellido}
            maxLength={100}
            disabled={guardando}
          />
          {errores.apellido && (
            <div className="invalid-feedback">{errores.apellido}</div>
          )}
        </div>

        {/* Botón */}
        <div className="col-12 col-sm-2">
          <button
            className="btn btn-primary w-100"
            onClick={handleEnviar}
            disabled={guardando}
          >
            {guardando ? (
              <span className="spinner-border spinner-border-sm" role="status" />
            ) : (
              '+ Agregar'
            )}
          </button>
        </div>

      </div>
    </div>
  )
}

export default ContactoForm
