import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/HeaderPublico.css';

function HeaderPublico() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
  };
  return (
    <header>
      <div className="navlist">
        <img className="Logo" src="/img/sisdeboleteria.png" alt="Bustrip Logo" />
        <nav>
          <Link to="/">Inicio</Link>
          {isLoggedIn ? (
            <>
              <Link to="/micuenta">Cuenta</Link>
              <button onClick={handleLogout}>Salir</button>
            </>
          ) : (
            <Link to="/login">
              <button>Ingreso</button>
            </Link>
          )}
        </nav>
      </div>
      <section className="textos-header">
        <h1>Más practico imposible</h1>
      </section>
      <div className="wave" style={{ height: '150px', overflow: 'hidden' }}>
        <svg viewBox="0 0 500 150" preserveAspectRatio="none" style={{ height: '100%', width: '100%' }}>
          <path d="M0.00,49.98 C151.52,263.98 201.18,20.23 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" style={{ stroke: 'none', fill: 'rgb(255, 255, 255)' }}></path>
        </svg>
      </div>
    </header>
  );
}

export default HeaderPublico;