import React from 'react';
import { Link } from 'react-router-dom';
import '../css/HeaderPublico.css';

function HeaderPublico() {
  return (
    <header>
      <div className="navlist">
        <img className="Logo" src="/img/sisdeboleteria.png" alt="AgriView Logo" />
        <nav>
          <Link to="/">Inicio</Link> 
          <Link to="/login">
            <button>Ingreso</button>
          </Link>
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