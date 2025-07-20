import React, { useState } from "react";
import { Api } from "../../../services/Api";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/Index";
import Swal from "sweetalert2";

const CreateCooperativa: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombres: "",
    dirrecion: "",
    celular: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setErrors({});

    const newErrors: { [key: string]: string } = {};
    if (!form.nombres) newErrors.nombres = "El nombre es requerido";
    if (!form.dirrecion) newErrors.dirrecion = "La dirección es requerida";
    if (!form.celular) newErrors.celular = "El celular es requerido";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await Api.post("/cooperativa/cooperativa", form, {
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

    if (response.statusCode === 200 || response.statusCode === 201) {
      Swal.fire({
        icon: "success",
        title: "Cooperativa creada",
        text: "La cooperativa se registró correctamente.",
    });
    setTimeout(() => {
      navigate("/admin/cooperativa");
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
  } catch (err: any) {
    console.error(err);
    setServerError("Error al crear cooperativa");
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error al crear cooperativa",
    });
}
  };

  return (
    <AdminLayout>
      <div className="row">
        <h1>Registrar Cooperativa</h1>
        <hr />
        <div className="col-md-6">
          <div className="card card-outline card-primary">
            <div className="card-header">
              <h3 className="card-title">Complete los datos</h3>
            </div>
            <div className="card-body">
              {serverError && (
                <div className="alert alert-danger">{serverError}</div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nombre <b>*</b></label>
                  <input
                    type="text"
                    name="nombres"
                    className="form-control"
                    value={form.nombres}
                    onChange={handleChange}
                  />
                  {errors.nombres && (
                    <small className="text-danger">{errors.nombres}</small>
                  )}
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
                  />
                  {errors.dirrecion && (
                    <small className="text-danger">{errors.dirrecion}</small>
                  )}
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
                  />
                  {errors.celular && (
                    <small className="text-danger">{errors.celular}</small>
                  )}
                </div>
                <hr />
                <div className="form-group d-flex">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/admin/cooperativa")}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary ms-2">
                    Crear
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

export default CreateCooperativa;
