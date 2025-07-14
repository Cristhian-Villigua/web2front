import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/Index";
import { Api } from "../../../services/Api";
import Swal from "sweetalert2";

const EditCooperativa: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombres: "",
    dirrecion: "",
    celular: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    Api.get(`/cooperativa/cooperativa/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const coop = response.data.cooperativa || response.data;
        setForm({
          nombres: coop.nombres || "",
          dirrecion: coop.dirrecion || "",
          celular: coop.celular || "",
        });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate("/admin/cooperativa");
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
      const response = await Api.put(`/cooperativa/cooperativa/${id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.statusCode === 200 || response.statusCode === 204) {
        Swal.fire({
          icon: "success",
          title: "Cooperativa actualizada",
          text: "La cooperativa fue actualizada correctamente.",
        });
        setTimeout(() => navigate("/admin/cooperativa"), 2000);
      } else if (response.data?.errors) {
        setErrors(response.data.errors);
        Swal.fire({
          icon: "error",
          title: "Error de validación",
          text: "Revisa los campos marcados en rojo.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data?.message || "Error al actualizar cooperativa.",
        });
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.response?.data?.message || "Error al actualizar cooperativa.",
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
                <p>Cargando cooperativa...</p>
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
        <h1>Editar Cooperativa: {form.nombres}</h1>
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
                  { name: "nombres", label: "Nombre", type: "text" },
                  { name: "dirrecion", label: "Dirección", type: "text" },
                  { name: "celular", label: "Celular", type: "text" },
                ].map((field) => (
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
                    {errors[field.name] && (
                      <small className="text-danger">{errors[field.name]}</small>
                    )}
                    <br />
                  </div>
                ))}

                <hr />

                <div className="form-group d-flex">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/admin/cooperativa")}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success ms-2"
                  >
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

export default EditCooperativa;
