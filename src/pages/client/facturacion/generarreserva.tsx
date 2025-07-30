import HeaderCliente from "../headercliente";
import TablaPasajes from "./tablapasajes";
import DatosCliente from "../cuenta/datoscliente";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const GenerarReserva = () => {
    const location = useLocation();
    const ruta = location.state?.ruta;
    const passengers = location.state?.passengers || 1;

    useEffect(() => {
        if (ruta) {
            const reservaData = {
                fecha_reserva: ruta.fechaSalida,
                ruta_id: ruta.id || null,
                bus_id: ruta.bus?.id || null,
                hora_reserva: ruta.horaSalida || null,
                cantidadPasajes: passengers,
            };
            localStorage.setItem('reservaData', JSON.stringify(reservaData));
        }
    }, [ruta, passengers]);

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
                        precioFinal: ruta.precio * passengers,
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
