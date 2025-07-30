import "../../css/tablapasajes.css";

interface Ruta {
    origen: string;
    destino: string;
    fechaSalida: string;
    cantidadPasajes: number;
    precioFinal: number;
    cooperativaNombre: string;
}

interface TablaPasajesProps {
    ruta: Ruta;
}

const TablaPasajes = ({ ruta }: TablaPasajesProps) => {
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
        <p>{ruta.cooperativaNombre}</p>

        <div className="pasajesRow">
          <div className="pasajesItem">
            <h3>Salida</h3>
            <p>{ruta.origen}</p>
          </div>
          <div className="pasajesItem">
            <h3>Destino</h3>
            <p>{ruta.destino}</p>
          </div>
        </div>

        <div className="pasajesRow">
          <div className="pasajesItem">
            <h3>Cantidad de pasajes</h3>
            <p>{ruta.cantidadPasajes}</p>
          </div>
          <div className="pasajesItem">
            <h3>Precio final</h3>
            <p>${ruta.precioFinal.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaPasajes;
