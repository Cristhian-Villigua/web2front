import { Api } from "../../services/Api";
import AdminLayout from "../layout/Index";
import { useEffect, useState } from "react";

const Index = () => {
  const [totaladmin, setTotaladmin] = useState<number>(0);
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [totalProviders, setTotalProviders] = useState<number>(0);
  const [totalUsuarios, setTotalUsuarios] = useState<number>(0);
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
        const { admin, empleados, proveedores, usuarios } = response.data;
        setTotaladmin(admin);
        setTotalEmployees(empleados);
        setTotalProviders(proveedores);
        setTotalUsuarios(usuarios);
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
                <a href="/admin/users" className="small-box-footer">
                  Más información <i className="fas bi bi-file-person" />
                </a>
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
                <a href="/admin/providers" className="small-box-footer">
                  Más información <i className="fas bi bi-person-circle" />
                </a>
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
                <a href="/admin/employees" className="small-box-footer">
                  Más información <i className="fas bi bi-person-fill-check" />
                </a>
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
                <a href="/admin/usuarios" className="small-box-footer">
                  Más información <i className="fas bi bi-person-fill" />
                </a>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </div>
  );
};

export default Index;
