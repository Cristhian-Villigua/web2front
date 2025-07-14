import React, { useState } from "react";
import { Api } from "../../../services/Api";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/Index";
import Swal from "sweetalert2";

const CreateEmpleado = () => {
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
    role: "empleado",
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
    if (!form.nombres) newErrors.nombres = "Los nombres son requeridos";
    if (!form.apellidos) newErrors.apellidos = "Los apellidos son requeridos";
    if (!form.cedula) newErrors.cedula = "La cédula es requerida";
    if (!form.celular) newErrors.celular = "El celular es requerido";
    if (!form.dirrecion) newErrors.dirrecion = "La dirección es requerida";
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
      const payload = {
        ...form,
        role: "empleado", // Forzar solo empleados
      };
      const response = await Api.post("/empleado/usuarios", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (
        typeof response.data === "string" &&
        response.data.startsWith("<!DOCTYPE")
      ) {
        throw new Error(
          "El backend devolvió HTML. Verifica la ruta y autenticación."
        );
      }

      if (response.statusCode === 200) {
        Swal.fire({
          icon: "success",
          title: "Empleado registrado",
          text: "Empleado registrado exitosamente",
        });
        setTimeout(() => {
          navigate("/admin/employees");
        }, 2000);
      } else if (response.data && response.data.errors) {
        setErrors(response.data.errors);
        Swal.fire({
          icon: "error",
          title: "Error de validación",
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
      setServerError("Error al registrar empleado");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al registrar empleado",
      });
    }
  };

  return (
    <div>
      <AdminLayout>
        <div className="row">
          <h1>Registrar Empleado</h1>
          <hr />
          <div className="col-md-6">
            <div className="card card-outline card-primary">
              <div className="card-header">
                <h3 className="card-title">Complete los datos</h3>
              </div>
              <div className="card-body">
                {serverError && (
                  <div style={{ color: "red", marginBottom: 10 }}>{serverError}</div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Rol <b>*</b></label>
                    <input
                      type="text"
                      name="role"
                      className="form-control"
                      value="empleado"
                      readOnly
                    />
                  </div>
                  <br />
                  <div className="form-group">
                    <label>Nombres <b>*</b></label>
                    <input
                      type="text"
                      name="nombres"
                      className="form-control"
                      value={form.nombres}
                      onChange={handleChange}
                      required
                    />
                    {errors.nombres && <small style={{ color: "red" }}>{errors.nombres}</small>}
                  </div>
                  <br />
                  <div className="form-group">
                    <label>Apellidos <b>*</b></label>
                    <input
                      type="text"
                      name="apellidos"
                      className="form-control"
                      value={form.apellidos}
                      onChange={handleChange}
                      required
                    />
                    {errors.apellidos && <small style={{ color: "red" }}>{errors.apellidos}</small>}
                  </div>
                  <br />
                  <div className="form-group">
                    <label>Cédula <b>*</b></label>
                    <input
                      type="text"
                      name="cedula"
                      className="form-control"
                      value={form.cedula}
                      onChange={handleChange}
                      required
                    />
                    {errors.cedula && <small style={{ color: "red" }}>{errors.cedula}</small>}
                  </div>
                  <br />
                  <div className="form-group">
                    <label>Celular <b>*</b></label>
                    <input
                      type="text"
                      name="celular"
                      className="form-control"
                      value={form.celular}
                      onChange={handleChange}
                      required
                    />
                    {errors.celular && <small style={{ color: "red" }}>{errors.celular}</small>}
                  </div>
                  <br />
                  <div className="form-group">
                    <label>Dirección <b>*</b></label>
                    <input
                      type="text"
                      name="dirrecion"
                      className="form-control"
                      value={form.dirrecion}
                      onChange={handleChange}
                      required
                    />
                    {errors.dirrecion && <small style={{ color: "red" }}>{errors.dirrecion}</small>}
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
                    <label>Contraseña <b>*</b></label>
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
                    <label>Confirmar Contraseña <b>*</b></label>
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
                      onClick={() => navigate("/admin/employees")}
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

export default CreateEmpleado;