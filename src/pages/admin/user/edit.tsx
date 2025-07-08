import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/Index";
import { Api } from "../../../services/Api";
import Swal from "sweetalert2";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "usuario",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    Api.get(`/admin/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const user: User = response.data.user;
        setForm({
          name: user.name || "",
          email: user.email || "",
          password: "",
          password_confirmation: "",
          role: user.role || "usuario",
        });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate("/admin/users");
      });
  }, [id, navigate]);

  // Cambia el tipo para aceptar input y select
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const token = localStorage.getItem("token");
    try {
      const response = await Api.put(`/admin/users/${id}`, form, {
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
        setTimeout(() => {
          navigate("/admin/users");
        }, 2000);
      } 
      else if (response.data && response.data.errors) {
        setErrors(response.data.errors);
        Swal.fire({
          icon: "error",
          title: "Ya existe un prooverdor con ese correo",
          text: "Revisa los campos marcados en rojo.",
        });
      } else if (response.data && response.data.message) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message,
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al actualizar usuario",
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="row">
          <div className="col-md-6">
            <div className="card card-outline card-success">
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
        <h1>Actualizar: {form.name}</h1>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-6">
          <div className="card card-outline card-success">
            <div className="card-header">
              <h3 className="card-title">Completar Datos</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                 <div className="form-group">
                  <label>Rol <b>*</b></label>
                  <select
                    name="role"
                    className="form-control"
                    value={form.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="proveedor">Proveedor</option>
                    <option value="empleado">Empleado</option>
                    <option value="admin">Administrador</option>
                    <option value="usuario">Usuario</option>
                  </select>
                  {errors.role && <small style={{ color: "red" }}>{errors.role}</small>}
                </div>
                <br />
                <div className="form-group">
                  <label>Nombre <b>*</b></label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                  {errors.name && <small style={{ color: "red" }}>{errors.name}</small>}
                </div>
                <br />
                <div className="form-group">
                  <label>Email <b>*</b></label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && <small style={{ color: "red" }}>{errors.email}</small>}
                </div>
                <br />
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
                </div>
                <br />
                <div className="form-group">
                  <label>Verificar Contraseña</label>
                  <input
                    type="password"
                    name="password_confirmation"
                    className="form-control"
                    value={form.password_confirmation}
                    onChange={handleChange}
                  />
                  {errors.password_confirmation && (
                    <small style={{ color: "red" }}>{errors.password_confirmation}</small>
                  )}
                </div>
                <hr />
                <div className="form-group">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/admin/users")}
                  >
                    Volver
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

export default EditUser;