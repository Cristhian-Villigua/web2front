import { Link } from "react-router-dom";
import { Api } from "../../services/Api";
import AdminLayout from "../layout/Index";
import { useEffect, useState } from "react";

const Index = () => {
  const [totaladmin, setTotaladmin] = useState<number>(0);
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [totalProviders, setTotalProviders] = useState<number>(0);
  const [totalUsuarios, setTotalUsuarios] = useState<number>(0);
  const [totalCooperativa, setTotalCooperativa] = useState<number>(0);
  const [totalBuses, setTotalBuses] = useState<number>(0);
  const [totalRutas, setTotalRutas] = useState<number>(0);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No hay token de autenticación");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        setUsername(userObj.name || null);
        setRole(userObj.role || null);
      } catch {
        setUsername(null);
        setRole(null);
      }
    }

    Api.get("/admin/user-counts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const { admin, empleados, proveedores, usuarios, cooperativa, buses, rutas } = response.data;
        setTotaladmin(admin);
        setTotalEmployees(empleados);
        setTotalProviders(proveedores);
        setTotalUsuarios(usuarios);
        setTotalCooperativa(cooperativa);
        setTotalBuses(buses);
        setTotalRutas(rutas);
      })
      .catch((err) => {
        console.error("Error al obtener conteos:", err);
      });
  }, []);

  return (
    <div>
      <AdminLayout>
        <div className="row">
          <h1><b>Bienvenido: {username}</b></h1>
        </div>
        <hr />
        <div className="row">
          {/* Solo para admin */}
          {role === "admin" && (
            <div className="col-lg-3 col-6">
              <div className="small-box bg-info">
                <div className="inner">
                  <h3>{totaladmin}</h3>
                  <p>Administradores</p>
                </div>
                <div className="icon">
                  <i className="fas bi bi-file-person" />
                </div>
                <Link to="/admin/users" className="small-box-footer">
                  Más información <i className="fas bi bi-file-person" />
                </Link>
              </div>
            </div>
          )}

          {/* Solo para admin */}
          {role === "admin" && (
            <div className="col-lg-3 col-6">
              <div className="small-box bg-success">
                <div className="inner">
                  <h3>{totalProviders}</h3>
                  <p>Proveedores</p>
                </div>
                <div className="icon">
                  <i className="fas bi bi-person-circle" />
                </div>
                <Link to="/admin/providers" className="small-box-footer">
                  Más información <i className="fas bi bi-person-circle" />
                </Link>
              </div>
            </div>
          )}
          {/* Para admin y proveedor */}
          {(role === "admin" || role === "proveedor") && (
            <div className="col-lg-3 col-6">
              <div className="small-box bg-warning">
                <div className="inner">
                  <h3>{totalEmployees}</h3>
                  <p>Empleados</p>
                </div>
                <div className="icon">
                  <i className="fas bi bi-person-fill-check" />
                </div>
                <Link to="/admin/employees" className="small-box-footer">
                  Más información <i className="fas bi bi-person-fill-check" />
                </Link>
              </div>
            </div>
          )}
          {(role === "admin") && (
            <div className="col-lg-3 col-6">
              <div className="small-box bg-secondary">
                <div className="inner">
                  <h3>{totalUsuarios}</h3>
                  <p>Usuarios</p>
                </div>
                <div className="icon">
                  <i className="fas bi bi-person-fill" />
                </div>
                <Link to="/admin/usuarios" className="small-box-footer">
                  Más información <i className="fas bi bi-person-fill" />
                </Link>
              </div>
            </div>
          )}
          {(role === "admin" || role === "proveedor") && (
            <div className="col-lg-3 col-6">
              <div className="small-box bg-lightblue">
                <div className="inner">
                  <h3>{totalCooperativa}</h3>
                  <p>Cooperativa</p>
                </div>
                <div className="icon">
                  <i className="fas bi bi-building" />
                </div>
                <Link to="/admin/cooperativa" className="small-box-footer">
                  Más información <i className="fas bi bi-building" />
                </Link>
              </div>
            </div>
          )}
          {(role === "admin" || role === "proveedor") && (
            <div className="col-lg-3 col-6">
              <div className="small-box bg-orange">
                <div className="inner">
                  <h3>{totalBuses}</h3>
                  <p>Buses</p>
                </div>
                <div className="icon">
                  <i className="fas bi bi-bus-front" />
                </div>
                <Link to="/admin/buses" className="small-box-footer">
                  Más información <i className="fas bi bi-bus-front" />
                </Link>
              </div>
            </div>
          )}
          {(role === "admin" || role === "proveedor") && (
            <div className="col-lg-3 col-6">
              <div className="small-box bg-purple">
                <div className="inner">
                  <h3>{totalRutas}</h3>
                  <p>Rutas</p>
                </div>
                <div className="icon">
                  <i className="fas bi bi-signpost" />
                </div>
                <Link to="/admin/rutas" className="small-box-footer">
                  Más información <i className="fas bi bi-signpost" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </div>
  );
};

export default Index;
