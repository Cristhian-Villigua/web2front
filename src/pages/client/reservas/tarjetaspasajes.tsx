import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Ruta {
    id: number;
    origen: string;
    destino: string;
    fechaSalida: string;
    horaSalida: string;
    duracion: string;
    cooperativa: {
        nombre: string;
        logo_url?: string;
    };
    bus: {
        id: number;
        placa: string;
    };
    precio: number;
    impuestos: number;
}

const TarjetasPasajes = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [rutas, setRutas] = useState<Ruta[]>([]);

    // Helper to get query params
    const getQueryParam = (param: string): string | null => {
        const params = new URLSearchParams(location.search);
        return params.get(param);
    };

    const origin = getQueryParam('origin') || '';
    const destination = getQueryParam('destination') || '';
    const departureDate = getQueryParam('departureDate') || '';
    const passengersStr = getQueryParam('passengers') || '1 persona';

    // Extract number of passengers from string like "1 persona"
    const passengersMatch = passengersStr.match(/(\d+)/);
    const passengers = passengersMatch ? parseInt(passengersMatch[1], 10) : 1;

    useEffect(() => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
        // Build query string for filtering
        const params = new URLSearchParams();
        if (origin) params.append('origen', origin);
        if (destination) params.append('destino', destination);
        if (departureDate) params.append('fechaSalida', departureDate);

        fetch(`${baseUrl}/api/destinos/rutas?${params.toString()}`)
            .then(response => response.json())
            .then((data: Ruta[]) => {
                setRutas(data);
            })
            .catch(error => {
                console.error('Error fetching rutas:', error);
            });
    }, [origin, destination, departureDate]);

const handleComprar = (ruta: Ruta) => {
        // Store ruta_id and bus_id in localStorage for later use
        localStorage.setItem('selected_ruta_id', ruta.id.toString());
        // Assuming bus_id is available as ruta.bus.id, if not, adjust accordingly
        // Here bus id is not explicitly in ruta, so we store bus placa as bus_id for now
        localStorage.setItem('selected_bus_id', ruta.bus.id ? ruta.bus.id.toString() : '');
        // Navigate to /facturacion with ruta and passengers info
        navigate('/facturacion', { state: { ruta, passengers } });
    };

    if (rutas.length === 0) {
        return <div>No hay pasajes disponibles para los filtros seleccionados.</div>;
    }

    return (
        <div>
            {rutas.map((ruta) => (
                <div key={ruta.id} className="card shadow border-0 mb-4" style={{ maxWidth: "800px", margin: "0 auto" }}>
                    <div className="card-body">
                        {/* IDA */}
                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <h6 className="text-secondary fw-bold mb-0">IDA</h6>
                                <small className="text-muted">{new Date(ruta.fechaSalida).toLocaleDateString()}</small>
                            </div>
                            <div className="d-flex align-items-center mt-2">
                                {ruta.cooperativa.logo_url ? (
                                    <img
                                        src={ruta.cooperativa.logo_url}
                                        alt={ruta.cooperativa.nombre}
                                        width="24"
                                        height="24"
                                        className="me-2"
                                    />
                                ) : (
                                    <div className="me-2" style={{ width: 24, height: 24, backgroundColor: '#ccc' }}></div>
                                )}
                                <div>
                                    <div className="fw-bold">
                                        {ruta.horaSalida} - {
                                            (() => {
                                                // Combine fechaSalida and horaSalida into one Date object
                                                const fechaHora = new Date(ruta.fechaSalida + 'T' + ruta.horaSalida);
                                                const llegada = new Date(fechaHora.getTime() + parseDuration(ruta.duracion));
                                                return llegada.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                            })()
                                        }
                                    </div>
                                    <div className="text-muted">Directo • {ruta.duracion}</div>
                                    <div className="text-muted">{ruta.origen} → {ruta.destino}</div>
                                </div>
                            </div>
                        </div>

                        {/* Precio y botón */}
                        <div className="border-top pt-3 d-flex justify-content-between align-items-center">
                            <div>
                                <div className="text-muted small">{passengers} Adulto{passengers > 1 ? 's' : ''}</div>
                                <div className="fw-semibold">USD {ruta.precio}</div>
                                <div className="text-muted small">Impuestos y cargos: USD {ruta.impuestos}</div>
                            </div>
                            <div className="text-end">
                                <div className="fw-bold">Precio final: USD {ruta.precio  * passengers}</div>
                                <button className="btn btn-primary btn-sm mt-1" onClick={() => handleComprar(ruta)}>Comprar</button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Helper function to parse duration string like "HH:mm" or "50 min" to milliseconds
function parseDuration(durationStr: string): number {
    if (!durationStr) return 0;
    // Check if format is HH:mm
    const hhmmMatch = durationStr.match(/^(\d{1,2}):(\d{2})$/);
    if (hhmmMatch) {
        const hours = parseInt(hhmmMatch[1], 10);
        const minutes = parseInt(hhmmMatch[2], 10);
        return (hours * 60 + minutes) * 60 * 1000;
    }
    // Check if format is like "50 min"
    const minMatch = durationStr.match(/(\d+)\s*min/);
    if (minMatch) {
        const minutes = parseInt(minMatch[1], 10);
        return minutes * 60 * 1000;
    }
    return 0;
}

export default TarjetasPasajes;
