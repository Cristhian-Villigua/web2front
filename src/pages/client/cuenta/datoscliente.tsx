import { useState, useEffect } from 'react';
import "../../css/datoscliente.css";

const DatosCliente = () => {
    const [userData, setUserData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [paymentVerified, setPaymentVerified] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Local state for card data (not saved)
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');

    useEffect(() => {
        let token = localStorage.getItem('token');
        if (!token) {
            setError('No authentication token found. Please log in.');
            return;
        }
        token = token.trim().replace(/^"(.*)"$/, '$1'); // Remove quotes if any

        function parseJwt (token: string) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                return JSON.parse(jsonPayload);
            } catch (e) {
                return null;
            }
        }
        const payload = parseJwt(token);
        if (!payload || !payload.sub) {
            setError('Invalid authentication token. Please log in again.');
            return;
        }
        const userId = payload.sub;

        const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
        fetch(`${baseUrl}/api/users/perfil/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                const usuario = data.usuario || data;
                setUserData({
                    id: usuario.id || null,
                    nombres: usuario.nombres || "",
                    apellidos: usuario.apellidos || "",
                    ci_ruc: usuario.cedula || "",
                    correo: usuario.user?.email || "",
                    telefono: usuario.celular || "",
                    direccion: usuario.direccion || usuario.dirrecion || "",
                    ciudad: usuario.ciudad || "",
                    provincia: usuario.provincia || "",
                });
            })
            .catch(error => {
                setError('Error fetching user data: ' + error.message);
            });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePaymentVerificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentVerified(e.target.checked);
    };

    const handleSubmit = () => {
        if (!userData || !userData.id) {
            setError('User ID is missing.');
            return;
        }
        if (!paymentVerified) {
            setError('Please verify the payment method before confirming.');
            return;
        }
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        let token = localStorage.getItem('token');
        if (!token) {
            setError('No authentication token found. Please log in.');
            setLoading(false);
            return;
        }
        token = token.trim().replace(/^"(.*)"$/, '$1');

        const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

        // Update user profile
        fetch(`${baseUrl}/api/users/perfil/${userData.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombres: userData.nombres,
                apellidos: userData.apellidos,
                cedula: userData.ci_ruc,
                email: userData.correo,
                celular: userData.telefono,
                dirrecion: userData.direccion,
                ciudad: userData.ciudad,
                provincia: userData.provincia,
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update user data: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                // After successful user update, send confirmation
                const rutaId = localStorage.getItem('selected_ruta_id');
                const busId = localStorage.getItem('selected_bus_id');
                if (!rutaId || !busId) {
                    throw new Error('Ruta ID or Bus ID is missing in localStorage.');
                }
                const now = new Date();
                const fechaReserva = now.toISOString().split('T')[0];
                const horaReserva = now.toTimeString().split(' ')[0];

                return fetch(`${baseUrl}/api/users/confirmacion`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        fecha_reserva: fechaReserva,
                        hora_reserva: horaReserva,
                        ruta_id: rutaId,
                        bus_id: busId,
                        usuario_id: userData.id,
                    }),
                });
            })
            .then(response => {
                setLoading(false);
                if (!response.ok) {
                    throw new Error('Failed to confirm payment: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                setSuccessMessage('Datos actualizados y pago confirmado correctamente.');
                setError(null);
            })
            .catch(error => {
                setLoading(false);
                setError(error.message);
            });
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!userData) {
        return <div>Cargando datos del cliente...</div>;
    }

    return (
        <div className="contenedorCuenta">
            <div className="bodycuenta">
                <h1>Mi cuenta</h1>
                <div className="titulocuenta">
                    <h2>Datos personales</h2>
                    <hr />
                </div>
                <div className="datoscuenta">
                    <div className="tarjetas flex-row">
                        <div className="tarjetaschild">
                            <h3>Nombres</h3>
                            <input type="text" name="nombres" value={userData.nombres} onChange={handleChange} />
                        </div>
                        <div className="tarjetaschild">
                            <h3>Apellidos</h3>
                            <input type="text" name="apellidos" value={userData.apellidos} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="tarjetas flex-row">
                        <div className="tarjetaschild">
                            <h3>CI/RUC</h3>
                            <input type="text" name="ci_ruc" value={userData.ci_ruc} onChange={handleChange} />
                        </div>
                        <div className="tarjetaschild">
                            <h3>Correo electronico</h3>
                            <input type="email" name="correo" value={userData.correo} onChange={handleChange} />
                        </div>
                    </div>                    
                    <h3>Telefono</h3>
                    <input type="text" name="telefono" value={userData.telefono} onChange={handleChange} />
                </div>
                <div className="titulofacturacioncliente">
                    <h2>Facturación</h2>
                    <hr />
                </div>
                <div className="bodyfacturacioncliente">
                    <h3>Dirreccion</h3>
                    <input type="text" name="direccion" value={userData.direccion} onChange={handleChange} />
                    <div className="tarjetas flex-row">
                        <div className="tarjetaschild">
                            <h3>Ciudad</h3>
                            <input type="text" name="ciudad" value={userData.ciudad} onChange={handleChange} />
                        </div>
                        <div className="tarjetaschild">
                            <h3>Provincia</h3>
                            <input type="text" name="provincia" value={userData.provincia} onChange={handleChange} />
                        </div>
                    </div>           
                </div>
                <h1>Metodo de Pago registrado</h1>
                <div className="titulocuenta">
                    <h2>tarjeta de credito o debito</h2>
                </div>
                <div className="tarjetas">
                    <div className="datotarjetas flex">
                        <div className="tarjetaschild">
                            <h3 className="datosdetarjetas">
                                Numero de tarjeta
                            </h3>
                            <input type="text" placeholder='numero de tarjeta' value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
                        </div>
                        <div className="tarjetaschild">
                            <h3 className="datosdetarjetas">
                                Nombre en la tarjeta
                            </h3>
                            <input type="text" placeholder='nombre del propietario' value={cardName} onChange={e => setCardName(e.target.value)} />
                        </div>
                        <div className="tarjetaschild">
                            <h3 className="cardnomber">
                                fecha de vencimiento
                            </h3>
                            <input type="text" placeholder='vencimiento' value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label>
                            <input type="checkbox" checked={paymentVerified} onChange={handlePaymentVerificationChange} />
                            Verificar método de pago
                        </label>
                    </div>
                </div>
                <button disabled={loading} onClick={handleSubmit}>Confirmar Pago</button>
                {successMessage && <div className="success-message">{successMessage}</div>}
            </div>
        </div>
    )
}
export default DatosCliente;
