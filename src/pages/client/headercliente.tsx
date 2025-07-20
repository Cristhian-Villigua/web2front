import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/HeaderPublico.css';

const HeaderCliente = () => {
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
    <div className='headercliente'>
      <div className="navlist">
        <img className="Logo" src="/img/sisdeboleteria.png" alt="AgriView Logo" />
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
    </div>
  );
};

export default HeaderCliente;
