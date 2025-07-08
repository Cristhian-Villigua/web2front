import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/Index";
import { Api } from "../../../services/Api";

interface User {
  id: number;
  email: string;
}
interface Empleado {
  id: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  celular: string;
  dirrecion: string;
  user: User;
}

const ShowEmpleado: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [empleado, setEmpleado] = useState<Empleado | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    Api.get(`/empleado/usuarios/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setEmpleado(response.data.usuario); // Asegúrate de que esta clave coincida con la respuesta de tu backend
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate("/admin/employees");
      });
  }, [id, navigate]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="row">
          <div className="col-md-6">
            <div className="card card-outline card-info">
              <div className="card-body">
                <p>Cargando proveedor...</p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!empleado) {
    return (
      <AdminLayout>
        <div className="row">
          <div className="col-md-6">
            <div className="card card-info">
              <div className="card-body">
                <p>No se encontró el proveedor.</p>
                <button className="btn btn-secondary" onClick={() => navigate("/admin/providers")}>
                  Volver
                </button>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="row">
        <h1>Empleado: {empleado.nombres} {empleado.apellidos}</h1>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-6">
          <div className="card card-info">
            <div className="card-header">
              <h3 className="card-title">Datos del Empleado</h3>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <label>Nombres</label>
                            <input type="text" value={empleado.nombres} className="form-control" disabled />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <label>Apellidos</label>
                            <input type="text" value={empleado.apellidos} className="form-control" disabled />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <label>Cédula</label>
                            <input type="text" value={empleado.cedula} className="form-control" disabled />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <label>Celular</label>
                            <input type="text" value={empleado.celular} className="form-control" disabled />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <label>Dirección</label>
                            <input type="text" value={empleado.dirrecion} className="form-control" disabled />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <label>Email</label>
                            <input type="text" value={empleado.user.email || ''} className="form-control" disabled />
                        </div>
                    </div>
                </div>
              <hr />
              <div className="form-group">
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate("/admin/employees")}
                >
                  Volver
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ShowEmpleado;
