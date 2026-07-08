// src/components/Mensaje/Mensaje.jsx
import './Mensaje.css'

function Mensaje({ mensaje }) {
  if (!mensaje) return null

  const claseBootstrap = mensaje.tipo === 'error' ? 'alert-danger' : 'alert-success'

  return (
    <div className={`alert ${claseBootstrap} mensaje-flotante`} role="alert">
      <span className="mensaje-icono">
        {mensaje.tipo === 'error' ? '⚠️' : '✅'}
      </span>
      {mensaje.texto}
    </div>
  )
}

export default Mensaje
