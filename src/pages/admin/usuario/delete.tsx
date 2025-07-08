import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/Index";
import { Api } from "../../../services/Api";
import Swal from "sweetalert2";

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

const DeleteUsuario: React.FC = () => {
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

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await Api.delete(`/users/usuarios/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.statusCode === 200) {
        Swal.fire({
          icon: "success",
          title: "Usuario eliminado",
          text: "El Usuario fue eliminado correctamente.",
        });
        setTimeout(() => navigate("/admin/usuarios"), 2000);
      } else if (response.data?.message) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message,
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al eliminar al empleado",
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="row">
          <div className="col-md-6">
            <div className="card card-danger">
              <div className="card-body">
                <p>Cargando empleado...</p>
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
            <div className="card card-danger">
              <div className="card-body">
                <p>No se encontró el usuario.</p>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate("/admin/providers")}
                >
                  Cancelar
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
        <h1>Eliminar usuario: {usuario.nombres} {usuario.apellidos}</h1>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-6">
          <div className="card card-danger">
            <div className="card-header">
              <h3 className="card-title">
                ¿Está seguro de eliminar a {usuario.nombres}?
              </h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleDelete}>
                {[
                  { label: "Nombres", value: usuario.nombres },
                  { label: "Apellidos", value: usuario.apellidos },
                  { label: "Cédula", value: usuario.cedula },
                  { label: "Celular", value: usuario.celular },
                  { label: "Dirección", value: usuario.dirrecion },
                  { label: "Email", value: usuario.user.email },
                ].map((field, index) => (
                  <div className="form-group" key={index}>
                    <label>{field.label}</label>
                    <input type="text" value={field.value} className="form-control" disabled />
                  </div>
                ))}
                <hr />
                <div className="form-group">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/admin/employees")}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-danger"
                    style={{ marginLeft: 10 }}
                  >
                    Eliminar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DeleteUsuario;
