import React, { useState } from "react";
import { Api } from "../../../services/Api";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/Index";
import Swal from "sweetalert2";

const CreateUser = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "proveedor",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState("");

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  setForm({ ...form, [e.target.name]: e.target.value });
  setErrors({ ...errors, [e.target.name]: "" });
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setErrors({});

    // Validación simple en frontend
    let newErrors: { [key: string]: string } = {};
    if (!form.name) newErrors.name = "El nombre es requerido";
    if (!form.email) newErrors.email = "El correo es requerido";
    if (!form.password) newErrors.password = "La contraseña es requerida";
    if (form.password !== form.password_confirmation)
      newErrors.password_confirmation = "Las contraseñas no coinciden";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Enviar al backend
    try {
      const token = localStorage.getItem("token");
      const response = await Api.post("/admin/users", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.statusCode === 201) {
        Swal.fire({
        icon: "success",
        title: "Proovedor registrado",
        text: "Prooverdor registrado exitosamente",
      });
        setTimeout(() => {
          navigate("/admin/users");
        }, 2000);
      } else if (response.data && response.data.errors) {
      setErrors(response.data.errors);
      Swal.fire({
        icon: "error",
        title: "Ya existe un prooverdor con ese correo",
        text: "Revisa los campos marcados en rojo.",
      });
    } else if (response.data && response.data.message) {
      setServerError(response.data.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: response.data.message,
      });
    }
    } catch (err) {
      setServerError("Error al registrar usuario");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al registrar usuario",
      });
    }
  };

  return (
    <div>
    <AdminLayout>
    <div className="row">
      <h1>Registrar Administrador</h1>
      <hr />
      <div className="col-md-6">
        <div className="card card-outline card-primary">
          <div className="card-header">
            <h3 className="card-title">Complete Data</h3>
          </div>
          <div className="card-body">
            {serverError && (
              <div style={{ color: "red", marginBottom: 10 }}>{serverError}</div>
            )}
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
                <label>Name <b>*</b></label>
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
                <label>Password <b>*</b></label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                {errors.password && <small style={{ color: "red" }}>{errors.password}</small>}
              </div>
              <br />
              <div className="form-group">
                <label>Password Verify <b>*</b></label>
                <input
                  type="password"
                  name="password_confirmation"
                  className="form-control"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  required
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
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ marginLeft: 10 }}>
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </AdminLayout>
    </div>
  );
};

export default CreateUser;