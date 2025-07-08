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

const EditUsuario: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    cedula: "",
    celular: "",
    dirrecion: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
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
        const emplea: Usuario = response.data.usuario;
        setForm({
          nombres: emplea.nombres || "",
          apellidos: emplea.apellidos || "",
          cedula: emplea.cedula || "",
          celular: emplea.celular || "",
          dirrecion: emplea.dirrecion || "",
          email: emplea.user.email || "",
          password: "",
          password_confirmation: "",
        });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate("/admin/usuarios");
      });
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const token = localStorage.getItem("token");

    try {
      const response = await Api.put(`/users/usuarios/${id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.statusCode === 200) {
        Swal.fire({
          icon: "success",
          title: "Usuario actualizado",
          text: "El usuario fue actualizado correctamente.",
        });
        setTimeout(() => navigate("/admin/usuarios"), 2000);
      } else if (response.data?.errors) {
        setErrors(response.data.errors);
        Swal.fire({
          icon: "error",
          title: "Error de validación",
          text: "Revisa los campos marcados en rojo.",
        });
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
        text: "Error al actualizar al usuario.",
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="row">
          <div className="col-md-6">
            <div className="card card-outline card-info">
              <div className="card-body">
                <p>Cargando usuario...</p>
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
        <h1>Editar usuario: {form.nombres} {form.apellidos}</h1>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-6">
          <div className="card card-outline card-info">
            <div className="card-header">
              <h3 className="card-title">Actualizar Datos</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {[
                  {name: "nombres", label: "Nombres", type: "text"},
                  {name: "apellidos", label: "Apellidos", type: "text"},
                  {name: "cedula", label: "Cédula", type: "text"},
                  {name: "celular", label: "Celular", type: "text"},
                  {name: "dirrecion", label: "Dirección", type: "text"},
                  {name: "email", label: "Email", type: "email"},
                ].map(field => (
                  <div className="form-group" key={field.name}>
                    <label>{field.label} <b>*</b></label>
                    <input
                      type={field.type}
                      name={field.name}
                      className="form-control"
                      value={(form as any)[field.name]}
                      onChange={handleChange}
                      required
                    />
                    {errors[field.name] && <small style={{ color: "red" }}>{errors[field.name]}</small>}
                    <br />
                  </div>
                ))}

                <div className="form-group">
                  <label>Contraseña (opcional)</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={form.password}
                    onChange={handleChange}
                  />
                  {errors.password && <small style={{ color: "red" }}>{errors.password}</small>}
                  <br />
                </div>

                <div className="form-group">
                  <label>Confirmar Contraseña</label>
                  <input
                    type="password"
                    name="password_confirmation"
                    className="form-control"
                    value={form.password_confirmation}
                    onChange={handleChange}
                  />
                  {errors.password_confirmation &&
                    <small style={{ color: "red" }}>{errors.password_confirmation}</small>
                  }
                </div>

                <hr />

                <div className="form-group">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/admin/usuarios")}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success" style={{ marginLeft: 10 }}>
                    Actualizar
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

export default EditUsuario;
