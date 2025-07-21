import "../../css/tablapasajes.css";

const TablaPasajes = () => {
  return (
    <div className="contenedorPasajes">
      <div className="bodyPasajes">
        <div className="tituloPasajes">
          <h1>Pasajes a Comprar</h1>
          <hr />
        </div>

        <div className="tituloSeccion">
          <h2>Cooperativa</h2>
        </div>
        <p>Vuelta larga</p>

        <div className="pasajesRow">
          <div className="pasajesItem">
            <h3>Salida</h3>
            <p>Manta-Manabi</p>
          </div>
          <div className="pasajesItem">
            <h3>Destino</h3>
            <p>Santa Ana-Manabi</p>
          </div>
        </div>

        <div className="pasajesRow">
          <div className="pasajesItem">
            <h3>Cantidad de pasajes</h3>
            <p>1</p>
          </div>
          <div className="pasajesItem">
            <h3>Precio final</h3>
            <p>$2.50</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaPasajes;
