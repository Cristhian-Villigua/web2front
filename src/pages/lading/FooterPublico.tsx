import '../css/footerPublico.css'; 

function FooterPublico() {
  return (
    <footer>
      <div className="contenedor-footer">
        <div className="content-foo">
          <img src="img/sisdeboleteria.png" alt="AgriView Logo" />
          <p>Más facil imposible</p>
        </div>
        <div className="content-foo">
          <h2>Creado por</h2>
          <p>Ariel Cobeña</p>
          <p>Michael Mendoza</p>
          <p>Jordan Mero</p>
          <p>Cristhian Villigua</p>
        </div>
        <div className="content-foo">
          <h2>Oficinas</h2>
          <p>Facultad de ciencias de la vida y tecnologias -ULEAM</p>
          <p>Aula de aplicaciones web II</p>
        </div>
      </div>
      <h2 className="titulo-final">&copy;Bustrip | Todos los derechos no reservados</h2>
    </footer>
  );
}

export default FooterPublico;