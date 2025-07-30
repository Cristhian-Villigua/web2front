import { useState, useEffect } from 'react';
import "../../css/datoscliente.css";

const DatosCliente = () => {
    const [userData, setUserData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found in localStorage');
            setError('No authentication token found. Please log in.');
            return;
        }
        token = token.trim().replace(/^"(.*)"$/, '$1'); // Remove quotes if any
        console.log('Using token:', token);

        // Helper function to decode JWT token payload
        function parseJwt (token: string) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                return JSON.parse(jsonPayload);
            } catch (e) {
                console.error('Failed to parse JWT token', e);
                return null;
            }
        }
        const payload = parseJwt(token);
        if (!payload || !payload.sub) {
            console.error('Invalid token payload or missing sub');
            setError('Invalid authentication token. Please log in again.');
            return;
        }
        const userId = payload.sub;
        console.log('Extracted userId from token:', userId);

        const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
        fetch(`${baseUrl}/api/users/usuarios/${userId}`, {
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
                console.log('Fetched user data:', data);
                setUserData({
                    nombres: data.nombres,
                    apellidos: data.apellidos,
                    ci_ruc: data.cedula || '',
                    correo: data.user?.email || '',
                    telefono: data.celular || '',
                    direccion: data.dirrecion || '',
                    ciudad: data.ciudad || '',
                    provincia: data.provincia || '',
                });
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setError('Error fetching user data: ' + error.message);
            });
    }, []);

    if (error) {
        return <div>{error}</div>;
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
                            <p>{userData.nombres}</p>
                        </div>
                        <div className="tarjetaschild">
                            <h3>Apellidos</h3>
                            <p>{userData.apellidos}</p>
                        </div>
                    </div>
                    <div className="tarjetas flex-row">
                        <div className="tarjetaschild">
                            <h3>CI/RUC</h3>
                            <p>{userData.ci_ruc}</p>
                        </div>
                        <div className="tarjetaschild">
                            <h3>Correo electronico</h3>
                            <p>{userData.correo}</p>
                        </div>
                    </div>                    
                    <h3>Telefono</h3>
                    <p>{userData.telefono}</p>
                </div>
                <div className="titulofacturacioncliente">
                    <h2>Facturación</h2>
                    <hr />
                </div>
                <div className="bodyfacturacioncliente">
                    <h3>Dirreccion</h3>
                    <p>{userData.direccion}</p>
                    <div className="tarjetas flex-row">
                        <div className="tarjetaschild">
                            <h3>Ciudad</h3>
                            <p>{userData.ciudad}</p>
                        </div>
                        <div className="tarjetaschild">
                            <h3>Provincia</h3>
                            <p>{userData.provincia}</p>
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
                        <p>xxxx</p>
                        </div>
                        <div className="tarjetaschild">
                        <h3 className="datosdetarjetas">
                            Nombre en la tarjeta
                        </h3>
                        <p>nombre en la tarjeta</p>
                        </div>
                        <div className="tarjetaschild">
                        <h3 className="cardnomber">
                            fecha de vencimiento
                        </h3>
                        <p>xx/xx</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default DatosCliente;
