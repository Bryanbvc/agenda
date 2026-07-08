// src/components/DatoForm/DatoForm.jsx
import { useState } from 'react'
import './DatoForm.css'
import { validarCorreo } from '../../utils/validaciones'

const TIPOS = ['Personal', 'Trabajo', 'Casa']

// Validar formato de correo sin REGEX (por caracteres)
const esCorreoValido = (correo) => {
  const valor = correo.trim()
  if (!valor) return true // vacío es válido (no obligatorio)

  let tieneArroba = false
  let indicePunto = -1

  for (let i = 0; i < valor.length; i++) {
    if (valor[i] === '@') {
      if (tieneArroba) return false // dos arrobas = inválido
      tieneArroba = true
    }
    if (valor[i] === '.' && tieneArroba) indicePunto = i
  }

  // Debe tener @ y un punto después del @, y no terminar en punto
  return tieneArroba &&
         indicePunto > 0 &&
         indicePunto < valor.length - 1
}

// Validar teléfono: solo dígitos, +, -, espacios, entre 7 y 15 chars
const esTelefonoValido = (tel) => {
  const valor = tel.trim()
  if (!valor) return true
  if (valor.length < 7 || valor.length > 15) return false
  const permitidos = '0123456789+-() '
  for (let i = 0; i < valor.length; i++) {
    if (!permitidos.includes(valor[i])) return false
  }
  return true
}

function DatoForm({ idContacto, onAgregar, datosExistentes = [] }) {
  const [tipo,      setTipo]      = useState('')
  const [correo,    setCorreo]    = useState('')
  const [telefono,  setTelefono]  = useState('')
  const [direccion, setDireccion] = useState('')
  const [errores,   setErrores]   = useState({})
  const [guardando, setGuardando] = useState(false)
  const [abierto,   setAbierto]   = useState(false)

  // ── Validación ─────────────────────────────────────────────
  const validar = () => {
    const e = {}

    if (!tipo) {
      e.tipo = 'Selecciona un tipo.'
    }

    if (!correo.trim() && !telefono.trim() && !direccion.trim()) {
      e.general = 'Debes ingresar al menos un dato: correo, teléfono o dirección.'
    }

    if (correo.trim() && !esCorreoValido(correo)) {
      e.correo = 'El formato del correo no es válido.'
    }

    if (telefono.trim() && !esTelefonoValido(telefono)) {
      e.telefono = 'El teléfono solo puede tener dígitos, +, - y espacios (7–15 caracteres).'
    }

    if (direccion.trim().length > 300) {
      e.direccion = 'La dirección no puede superar los 300 caracteres.'
    }

    // ── Validación de duplicados ────────────────────────────
    // Compara cada campo ingresado contra los datos ya existentes
    // del mismo contacto. La comparación ignora mayúsculas y espacios.
    const correoNuevo    = correo.trim().toLowerCase()
    const telefonoNuevo  = telefono.trim()
    const direccionNueva = direccion.trim().toLowerCase()

    for (let i = 0; i < datosExistentes.length; i++) {
      const d = datosExistentes[i]

      if (correoNuevo && d.correo &&
          d.correo.trim().toLowerCase() === correoNuevo) {
        e.correo = 'Este correo ya está registrado para este contacto.'
      }

      if (telefonoNuevo && d.telefono &&
          d.telefono.trim() === telefonoNuevo) {
        e.telefono = 'Este teléfono ya está registrado para este contacto.'
      }

      if (direccionNueva && d.direccion &&
          d.direccion.trim().toLowerCase() === direccionNueva) {
        e.direccion = 'Esta dirección ya está registrada para este contacto.'
      }
    }

    setErrores(e)
    return Object.keys(e).length === 0
  }

  // ── Envío ──────────────────────────────────────────────────
  const handleEnviar = async () => {
    if (!validar()) return

    setGuardando(true)
    const exito = await onAgregar(idContacto, { tipo, correo, telefono, direccion })
    setGuardando(false)

    if (exito) {
      setTipo('')
      setCorreo('')
      setTelefono('')
      setDireccion('')
      setErrores({})
      setAbierto(false)
    }
  }

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="dato-form-wrapper">

      {/* Botón para expandir/colapsar el formulario */}
      {!abierto ? (
        <button
          className="btn btn-outline-primary btn-sm dato-form-toggle"
          onClick={() => setAbierto(true)}
        >
          + Agregar dato de contacto
        </button>
      ) : (
        <div className="dato-form-panel">
          <p className="dato-form-subtitulo">Nuevo dato de contacto</p>

          {/* Error general */}
          {errores.general && (
            <div className="alert alert-warning py-1 px-2 small mb-2">
              {errores.general}
            </div>
          )}

          <div className="row g-2">

            {/* Tipo */}
            <div className="col-12 col-sm-3">
              <select
                className={`form-select form-select-sm ${errores.tipo ? 'is-invalid' : ''}`}
                value={tipo}
                onChange={e => { setTipo(e.target.value); setErrores(p => ({ ...p, tipo: null })) }}
                disabled={guardando}
              >
                <option value="">Tipo...</option>
                {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errores.tipo && <div className="invalid-feedback">{errores.tipo}</div>}
            </div>

            {/* Correo */}
            <div className="col-12 col-sm-9">
              <input
                type="text"
                className={`form-control form-control-sm ${errores.correo ? 'is-invalid' : ''}`}
                placeholder="Correo electrónico"
                value={correo}
                onChange={e => { setCorreo(e.target.value); setErrores(p => ({ ...p, correo: null, general: null })) }}
                maxLength={150}
                disabled={guardando}
              />
              {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
            </div>

            {/* Teléfono */}
            <div className="col-12 col-sm-6">
              <input
                type="text"
                className={`form-control form-control-sm ${errores.telefono ? 'is-invalid' : ''}`}
                placeholder="Teléfono"
                value={telefono}
                onChange={e => { setTelefono(e.target.value); setErrores(p => ({ ...p, telefono: null, general: null })) }}
                maxLength={20}
                disabled={guardando}
              />
              {errores.telefono && <div className="invalid-feedback">{errores.telefono}</div>}
            </div>

            {/* Dirección */}
            <div className="col-12 col-sm-6">
              <input
                type="text"
                className={`form-control form-control-sm ${errores.direccion ? 'is-invalid' : ''}`}
                placeholder="Dirección"
                value={direccion}
                onChange={e => { setDireccion(e.target.value); setErrores(p => ({ ...p, direccion: null, general: null })) }}
                maxLength={300}
                disabled={guardando}
              />
              {errores.direccion && <div className="invalid-feedback">{errores.direccion}</div>}
            </div>

          </div>

          {/* Acciones */}
          <div className="dato-form-acciones">
            <button
              className="btn btn-primary btn-sm"
              onClick={handleEnviar}
              disabled={guardando}
            >
              {guardando
                ? <span className="spinner-border spinner-border-sm" />
                : 'Guardar'}
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => { setAbierto(false); setErrores({}) }}
              disabled={guardando}
            >
              Cancelar
            </button>
          </div>

        </div>
      )}  
    </div>
  )
}

export default DatoForm
