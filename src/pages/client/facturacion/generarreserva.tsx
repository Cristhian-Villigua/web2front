import HeaderCliente from "../headercliente";
import TablaPasajes from "./tablapasajes";
import DatosCliente from "../cuenta/datoscliente";
import { useLocation } from "react-router-dom";

const GenerarReserva = () => {
    const location = useLocation();
    const ruta = location.state?.ruta;
    const passengers = location.state?.passengers || 1;

    return (
        <>
            <HeaderCliente />
            {ruta ? (
                <TablaPasajes
                    ruta={{
                        origen: ruta.origen,
                        destino: ruta.destino,
                        fechaSalida: ruta.fechaSalida,
                        cantidadPasajes: passengers,
                        precioFinal: (ruta.precio + ruta.impuestos) * passengers,
                        cooperativaNombre: ruta.cooperativa?.nombre || '',
                    }}
                />
            ) : (
                <div>No se ha seleccionado ningún pasaje.</div>
            )}
            <DatosCliente />
        </>
    );
};

export default GenerarReserva;
