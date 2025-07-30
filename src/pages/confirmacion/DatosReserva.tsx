import { useState, useEffect } from 'react';

const DatosReserva = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Simulate an API call or data loading
    useEffect(() => {
        const timer = setTimeout(() => {
            // In a real application, you might still fetch data to confirm the purchase
            // For this specific request, we're just showing a message.
            setLoading(false);
        }, 1500); // Simulate loading time

        // Clean up the timer
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <div className="text-center text-lg font-semibold mt-8">Cargando confirmación...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600 text-lg mt-8">Error: {error}</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
                <svg
                    className="w-16 h-16 text-green-500 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                </svg>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">¡Gracias por tu compra!</h1>
                <p className="text-gray-600 text-lg">Tu reserva ha sido confirmada exitosamente.</p>
                <p className="text-gray-600 text-md mt-2">Revisa tu correo electrónico para los detalles de tu reserva.</p>
            </div>
        </div>
    );
};

export default DatosReserva;