import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BuscadorTickets.css'; // For styling

interface Ruta {
    origen: string;
    destino: string;
}

const Buscadortickets = () => {
    const navigate = useNavigate();

    // State for tabs
    const [activeTab, setActiveTab] = useState('roundTrip'); // 'roundTrip', 'oneWay'

    // State for origin and destination inputs
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');

    // State for dates (you'd likely use a date picker library for real-world)
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');

    // State for passengers and class
    const [passengers, setPassengers] = useState('1 persona');

    // State for toggle switches
    const [seniorsOrDisabled, setSeniorsOrDisabled] = useState(false);

    // State for rutas fetched from API
    const [rutas, setRutas] = useState<Ruta[]>([]);

    // Unique origins and destinations extracted from rutas
    const [uniqueOrigins, setUniqueOrigins] = useState<string[]>([]);
    const [uniqueDestinations, setUniqueDestinations] = useState<string[]>([]);

    useEffect(() => {
        // Fetch rutas from API using base URL from environment variable
        const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
        fetch(`${baseUrl}/api/destinos/rutas`)
            .then(response => response.json())
            .then((data: Ruta[]) => {
                setRutas(data);
                // Extract unique origins and destinations
                const originsSet = new Set<string>();
                const destinationsSet = new Set<string>();
                data.forEach((ruta: Ruta) => {
                    if (ruta.origen) originsSet.add(ruta.origen);
                    if (ruta.destino) destinationsSet.add(ruta.destino);
                });
                setUniqueOrigins(Array.from(originsSet));
                setUniqueDestinations(Array.from(destinationsSet));
            })
            .catch(error => {
                console.error('Error fetching rutas:', error);
            });
    }, []);

    const handleSwapLocations = () => {
        setOrigin(destination);
        setDestination(origin);
    };

    const handleSearch = () => {
        // Redirect to /mostarpasajes with query params
        const params = new URLSearchParams();
        if (origin) params.append('origin', origin);
        if (destination) params.append('destination', destination);
        if (departureDate) params.append('departureDate', departureDate);
        navigate(`/mostarpasajes?${params.toString()}`);
    };

    return (
        <div className="flight-search-module-container">
            <div className="tabs-navigation">
                <span className="flights-label">Pasajes</span>
                <div className="tab-group">
                    <button
                        className={`tab ${activeTab === 'roundTrip' ? 'active' : ''}`}
                        onClick={() => setActiveTab('roundTrip')}
                    >
                        Ida y vuelta
                    </button>
                    <button
                        className={`tab ${activeTab === 'oneWay' ? 'active' : ''}`}
                        onClick={() => setActiveTab('oneWay')}
                    >
                        Solo ida
                    </button>
                </div>
            </div>

            <div className="search-form-grid">
                <div className="input-group origin">
                    <label>ORIGEN</label>
                    <select
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                    >
                        <option value="">Seleccione origen</option>
                        {uniqueOrigins.map((orig) => (
                            <option key={orig} value={orig}>{orig}</option>
                        ))}
                    </select>
                </div>
                <button className="swap-button" onClick={handleSwapLocations}>
                    &#x21C6; {/* Unicode for Left Right Arrow */}
                </button>
                <div className="input-group destination">
                    <label>DESTINO</label>
                    <select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    >
                        <option value="">Seleccione destino</option>
                        {uniqueDestinations.map((dest) => (
                            <option key={dest} value={dest}>{dest}</option>
                        ))}
                    </select>
                </div>

                <div className="input-group dates">
                    <label>FECHAS</label>
                    <div className="date-inputs">
                        <div className="date-input">
                            <span className="calendar-icon">📅</span>
                            <input
                                type="date"
                                placeholder="Ida"
                                value={departureDate}
                                onChange={(e) => setDepartureDate(e.target.value)}
                            />
                        </div>
                        {activeTab === 'roundTrip' && (
                             <div className="date-input">
                                <span className="calendar-icon">📅</span>
                                <input
                                    type="date"
                                    placeholder="Vuelta"
                                    value={returnDate}
                                    onChange={(e) => setReturnDate(e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="input-group passengers-class">
                    <label>PASAJEROS</label>
                    <div className="passengers-input">
                        <span className="user-icon">👤</span>
                        <input
                            type="text"
                            value={passengers}
                            onChange={(e) => setPassengers(e.target.value)}
                            onClick={() => alert('Seleccione la cantidad de pasajeros')}
                        />
                    </div>
                </div>

                <button className="search-button" onClick={handleSearch}>
                    <span className="search-icon">🔍</span>
                    Buscar
                </button>
            </div>
            <div className="toggle-options">
                <div className="toggle-item">
                    <input
                        type="checkbox"
                        id="seniorsOrDisabled"
                        checked={seniorsOrDisabled}
                        onChange={() => setSeniorsOrDisabled(!seniorsOrDisabled)}
                    />
                    <label htmlFor="seniorsOrDisabled">Personas mayores o con discapacidad</label>
                </div>
            </div>
        </div>
    );
};

export default Buscadortickets;
