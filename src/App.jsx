// src/App.jsx
import { useContactos }  from './hooks/useContactos'
import ContactoForm      from './components/ContactoForm/ContactoForm'
import ContactoList      from './components/ContactoList/ContactoList'
import Mensaje           from './components/Mensaje/Mensaje'
import './App.css'

function App() {
  const {
    contactos,
    cargando,
    error,
    mensaje,
    handleAgregarContacto,
    handleEliminarContacto,
    handleAgregarDato,
    handleEliminarDato,
  } = useContactos()

  return (
    <div className="app-wrapper">

      {/* Mensaje flotante de éxito/error */}
      <Mensaje mensaje={mensaje} />

      {/* Encabezado */}
      <header className="app-header">
        <div className="container">
          <h1 className="app-titulo">📒 Agenda de Contactos</h1>
          <p className="app-subtitulo">Gestiona tus contactos y sus datos</p>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container app-main">

        {/* Formulario de nuevo contacto */}
        <ContactoForm onAgregar={handleAgregarContacto} />

        {/* Error de conexión */}
        {error && (
          <div className="alert alert-danger" role="alert">
            ⚠️ {error}
          </div>
        )}

        {/* Lista de contactos */}
        <ContactoList
          contactos={contactos}
          cargando={cargando}
          onEliminarContacto={handleEliminarContacto}
          onAgregarDato={handleAgregarDato}
          onEliminarDato={handleEliminarDato}
        />

      </main>

      {/* Pie de página */}
      <footer className="app-footer">
        <div className="container">
          <p>Agenda de Contactos · Analista Programador · INACAP Valdivia · 2025</p>
        </div>
      </footer>

    </div>
  )
}

export default App
