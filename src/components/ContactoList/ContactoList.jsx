// src/components/ContactoList/ContactoList.jsx
import ContactoItem from '../ContactoItem/ContactoItem'
import './ContactoList.css'

function ContactoList({
  contactos,
  cargando,
  onEliminarContacto,
  onAgregarDato,
  onEliminarDato,
}) {

  // ── Estado: cargando ───────────────────────────────────────
  if (cargando) {
    return (
      <div className="contacto-list-estado">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2 text-muted">Cargando contactos...</p>
      </div>
    )
  }

  // ── Estado: sin contactos ──────────────────────────────────
  if (contactos.length === 0) {
    return (
      <div className="contacto-list-estado">
        <p className="contacto-list-vacio">📋 No hay contactos todavía.<br/>
          <span>Agrega el primero con el formulario de arriba.</span>
        </p>
      </div>
    )
  }

  // ── Estado: con contactos ──────────────────────────────────
  return (
    <div>
      <p className="contacto-list-contador">
        {contactos.length} contacto(s) encontrado(s)
      </p>
      <div className="contacto-list-grid">
        {contactos.map(contacto => (
          <ContactoItem
            key={contacto.id_contacto}
            contacto={contacto}
            onEliminarContacto={onEliminarContacto}
            onAgregarDato={onAgregarDato}
            onEliminarDato={onEliminarDato}
          />
        ))}
      </div>
    </div>
  )
}

export default ContactoList
