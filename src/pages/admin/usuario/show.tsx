import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/Index";
import { Api } from "../../../services/Api";

interface User {
  id: number;
  email: string;
}
interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  celular: string;
  dirrecion: string;
  user: User;
}

const ShowUsuario: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    Api.get(`/users/usuarios/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setUsuario(response.data.usuario);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate("/admin/usuarios");
      });
  }, [id, navigate]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="row">
          <div className="col-md-6">
            <div className="card card-outline card-info">
              <div className="card-body">
                <p>Cargando Usuario...</p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!usuario) {
    return (
      <AdminLayout>
        <div className="row">
          <div className="col-md-6">
            <div className="card card-info">
              <div className="card-body">
                <p>No se encontró el Usuario.</p>
                <button className="btn btn-secondary" onClick={() => navigate("/admin/usuarios")}>
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
        <h1>Usuario: {usuario.nombres} {usuario.apellidos}</h1>
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
                            <input type="text" value={usuario.nombres} className="form-control" disabled />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <label>Apellidos</label>
                            <input type="text" value={usuario.apellidos} className="form-control" disabled />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <label>Cédula</label>
                            <input type="text" value={usuario.cedula} className="form-control" disabled />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <label>Celular</label>
                            <input type="text" value={usuario.celular} className="form-control" disabled />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <label>Dirección</label>
                            <input type="text" value={usuario.dirrecion} className="form-control" disabled />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <label>Email</label>
                            <input type="text" value={usuario.user.email || ''} className="form-control" disabled />
                        </div>
                    </div>
                </div>
              <hr />
              <div className="form-group">
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate("/admin/usuarios")}
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

export default ShowUsuario;
