// src/components/ContactoItem/ContactoItem.jsx
import DatoForm from '../DatoForm/DatoForm'
import './ContactoItem.css'

// Ícono según el tipo de dato
const iconoTipo = (tipo) => {
  if (tipo === 'Personal') return '👤'
  if (tipo === 'Trabajo')  return '💼'
  if (tipo === 'Casa')     return '🏠'
  return '📋'
}

// Muestra los datos de un dato_contacto de forma legible
function DetalleDato({ dato, idContacto, onEliminarDato }) {
  const { id_dato_contacto, tipo, correo, telefono, direccion } = dato

  return (
    <div className="dato-item">
      <div className="dato-item-header">
        <span className="dato-tipo">
          {iconoTipo(tipo)} {tipo}
        </span>
        <button
          className="btn-eliminar-dato"
          onClick={() => onEliminarDato(idContacto, id_dato_contacto)}
          title="Eliminar dato"
          aria-label="Eliminar dato de contacto"
        >
          ×
        </button>
      </div>

      <div className="dato-item-valores">
        {correo    && <span className="dato-valor">✉️ {correo}</span>}
        {telefono  && <span className="dato-valor">📞 {telefono}</span>}
        {direccion && <span className="dato-valor">📍 {direccion}</span>}
      </div>
    </div>
  )
}

function ContactoItem({ contacto, onEliminarContacto, onAgregarDato, onEliminarDato }) {
  const { id_contacto, nombre, apellido, dato_contacto } = contacto

  return (
    <div className="contacto-item-card">

      {/* Encabezado: nombre + botón eliminar */}
      <div className="contacto-item-header">
        <div className="contacto-item-nombre">
          <span className="contacto-avatar">
            {nombre[0]?.toUpperCase()}{apellido[0]?.toUpperCase()}
          </span>
          <div>
            <p className="contacto-nombre-texto">{nombre} {apellido}</p>
            <p className="contacto-datos-count">
              {dato_contacto.length === 0
                ? 'Sin datos de contacto'
                : `${dato_contacto.length} dato(s)`}
            </p>
          </div>
        </div>

        <button
          className="btn btn-outline-danger btn-sm contacto-btn-eliminar"
          onClick={() => onEliminarContacto(id_contacto)}
          title="Eliminar contacto"
        >
          Eliminar
        </button>
      </div>

      {/* Lista de datos de contacto */}
      {dato_contacto.length > 0 && (
        <div className="dato-lista">
          {dato_contacto.map(dato => (
            <DetalleDato
              key={dato.id_dato_contacto}
              dato={dato}
              idContacto={id_contacto}
              onEliminarDato={onEliminarDato}
            />
          ))}
        </div>
      )}

      {/* Formulario para agregar nuevo dato */}
      {/* datosExistentes permite validar duplicados dentro de DatoForm */}
      <DatoForm
        idContacto={id_contacto}
        onAgregar={onAgregarDato}
        datosExistentes={dato_contacto}
      />

    </div>
  )
}

export default ContactoItem
