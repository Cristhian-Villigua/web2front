import React, { useState } from 'react';
import './BuscadorTickets.css'; // For styling

const Buscadortickets = () => {
    // State for tabs
    const [activeTab, setActiveTab] = useState('roundTrip'); // 'roundTrip', 'oneWay'

    // State for origin and destination inputs
    const [origin, setOrigin] = useState('Manta, Manabí, Ecuador');
    const [destination, setDestination] = useState('');

    // State for dates (you'd likely use a date picker library for real-world)
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');

    // State for passengers and class
    const [passengers, setPassengers] = useState('1 persona');

    // State for toggle switches
    const [seniorsOrDisabled, setSeniorsOrDisabled] = useState(false);

    const handleSwapLocations = () => {
        setOrigin(destination);
        setDestination(origin);
    };

    const handleSearch = () => {
        // Implement search logic here
        console.log({
            activeTab,
            origin,
            destination,
            departureDate,
            returnDate,
            passengers,
            seniorsOrDisabled,
        });
        alert('Searching for flights!');
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
                    <input
                        type="text"
                        placeholder="Origen"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                    />
                </div>
                <button className="swap-button" onClick={handleSwapLocations}>
                    {/* SVG or Font Awesome icon for swap */}
                    &#x21C6; {/* Unicode for Left Right Arrow */}
                </button>
                <div className="input-group destination">
                    <label>DESTINO</label>
                    <input
                        type="text"
                        placeholder="Destino."
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />
                </div>

                <div className="input-group dates">
                    <label>FECHAS</label>
                    <div className="date-inputs">
                        <div className="date-input">
                            <span className="calendar-icon">📅</span>
                            <input
                                type="text" // Or date type if using native, but usually handled by date picker lib
                                placeholder="Ida"
                                value={departureDate}
                                onChange={(e) => setDepartureDate(e.target.value)}
                            />
                        </div>
                        {activeTab === 'roundTrip' && (
                             <div className="date-input">
                                <span className="calendar-icon">📅</span>
                                <input
                                    type="text"
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
                            readOnly // Typically read-only, opens a modal
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