import React, { useState, useEffect } from "react";
import Header from "../template/Header";
import Footer from "../template/Footer";
import { Link, useNavigate } from "react-router-dom";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProvidersMenuOpen, setIsProvidersMenuOpen] = useState(false);
  const [isEmployeeMenuOpen, setIsEmployeeMenuOpen] = useState(false);
  const [isUsarioMenuOpen, setIsUsuarioMenuOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        setRole(userObj.role || null);
      } catch {
        setRole(null);
      }
    }
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="wrapper">
      <Header />
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        <a href="#" className="brand-link" style={{ textDecoration: "none" }}>
          <img src="/dist/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" />
          <span className="brand-text font-weight-light">SYS Reservas</span>
        </a>
        <div className="sidebar">
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="info">
              <a href="/admin" className="d-block" style={{ textDecoration: "none", marginLeft: 60, fontSize: 18, color: "white", fontWeight:800 }}>INICIO</a>
            </div>
          </div>
          <nav className="mt-2" style={{ paddingRight: 10 }}>
            <ul className="nav nav-pills nav-sidebar flex-column" role="menu" data-widget="treeview" data-accordion="false">

              {role === "admin" && (
                <li className={`nav-item has-treeview ${isUserMenuOpen ? 'menu-open' : ''}`}>
                  <a className="nav-link active" style={{ cursor: "pointer", textAlign: "left" }} onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                    <i className="nav-icon fas bi bi-people-fill"></i>
                    <p>
                      Administradores
                      <i className="right fas fa-angle-left"></i>
                    </p>
                  </a>
                  <ul className="nav nav-treeview" style={{ display: isUserMenuOpen ? "block" : "none" }}>
                    <li className="nav-item" style={{ textAlign: "left" }}>
                      <Link to="/admin/users/create" className="nav-link active">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Registrar Admin</p>
                      </Link>
                    </li>
                    <li className="nav-item" style={{ textAlign: "left" }}>
                      <Link to="/admin/users" className="nav-link active">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Lista de Admin</p>
                      </Link>
                    </li>
                  </ul>
                </li>
              )}

              {role === "admin" && (
                <li className={`nav-item has-treeview ${isProvidersMenuOpen ? 'menu-open' : ''}`}>
                  <a className="nav-link active" style={{ cursor: "pointer", textAlign: "left" }} onClick={() => setIsProvidersMenuOpen(!isProvidersMenuOpen)}>
                    <i className="nav-icon fas bi bi-person-circle"></i>
                    <p>
                      Proveedor
                      <i className="right fas fa-angle-left"></i>
                    </p>
                  </a>
                  <ul className="nav nav-treeview" style={{ display: isProvidersMenuOpen ? "block" : "none" }}>
                    <li className="nav-item" style={{ textAlign: "left" }}>
                      <Link to="/admin/providers/create" className="nav-link active">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Registrar Proveedor</p>
                      </Link>
                    </li>
                    <li className="nav-item" style={{ textAlign: "left" }}>
                      <Link to="/admin/providers" className="nav-link active">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Lista de Proveedor</p>
                      </Link>
                    </li>
                  </ul>
                </li>
              )}

              {(role === "admin" || role === "proveedor") && (
                <li className={`nav-item has-treeview ${isEmployeeMenuOpen ? 'menu-open' : ''}`}>
                  <a className="nav-link active" style={{ cursor: "pointer", textAlign: "left" }} onClick={() => setIsEmployeeMenuOpen(!isEmployeeMenuOpen)}>
                    <i className="nav-icon fas bi bi-person-fill-check"></i>
                    <p>
                      Empleado
                      <i className="right fas fa-angle-left"></i>
                    </p>
                  </a>
                  <ul className="nav nav-treeview" style={{ display: isEmployeeMenuOpen ? "block" : "none" }}>
                    <li className="nav-item" style={{ textAlign: "left" }}>
                      <Link to="/admin/employees/create" className="nav-link active">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Registrar Empleado</p>
                      </Link>
                    </li>
                    <li className="nav-item" style={{ textAlign: "left" }}>
                      <Link to="/admin/employees" className="nav-link active">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Lista de Empleado</p>
                      </Link>
                    </li>
                  </ul>
                </li>
              )}
              {role === "admin" && (
                <li className={`nav-item has-treeview ${isUsarioMenuOpen ? 'menu-open' : ''}`}>
                  <a className="nav-link active" style={{ cursor: "pointer", textAlign: "left" }} onClick={() => setIsUsuarioMenuOpen(!isUsarioMenuOpen)}>
                    <i className="nav-icon fas bi bi-person-fill"></i>
                    <p>
                      Usuarios
                      <i className="right fas fa-angle-left"></i>
                    </p>
                  </a>
                  <ul className="nav nav-treeview" style={{ display: isUsarioMenuOpen ? "block" : "none" }}>
                    <li className="nav-item" style={{ textAlign: "left" }}>
                      <Link to="/admin/usuarios/create" className="nav-link active">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Registrar Usuario</p>
                      </Link>
                    </li>
                    <li className="nav-item" style={{ textAlign: "left" }}>
                      <Link to="/admin/usuarios" className="nav-link active">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Lista de Usuario</p>
                      </Link>
                    </li>
                  </ul>
                </li>
              )}

              {/* Salir */}
              <li className="nav-item" style={{ textAlign: "left" }}>
                <a className="nav-link" href="/" onClick={handleLogout}>
                  <i className="nav-icon fas fa-door-closed" />
                  <span>Salir</span>
                </a>
              </li>

            </ul>
          </nav>
        </div>
      </aside>

      <div className="content-wrapper" style={{ minHeight: "86vh" }}>
        <div className="container">
          <section className="content pt-4 px-3">
            {children}
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminLayout;
