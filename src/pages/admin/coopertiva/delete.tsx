import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/Index";
import { Api } from "../../../services/Api";
import Swal from "sweetalert2";

interface Cooperativa {
  id: number;
  nombres: string;
  dirrecion: string;
  celular: string;
}

const DeleteCooperativa: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cooperativa, setCooperativa] = useState<Cooperativa | null>(null);
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
        setCooperativa(response.data.cooperativa || response.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate("/admin/cooperativa");
      });
  }, [id, navigate]);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await Api.delete(`/cooperativa/cooperativa/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.statusCode === 200 || response.statusCode === 204) {
        Swal.fire({
          icon: "success",
          title: "Cooperativa eliminada",
          text: "La cooperativa fue eliminada correctamente.",
        });
        setTimeout(() => navigate("/admin/cooperativa"), 2000);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data?.message || "No se pudo eliminar la cooperativa.",
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al intentar eliminar la cooperativa.",
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
                <p>Cargando cooperativa...</p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!cooperativa) {
    return (
      <AdminLayout>
        <div className="row">
          <div className="col-md-6">
            <div className="card card-danger">
              <div className="card-body">
                <p>No se encontró la cooperativa.</p>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate("/admin/cooperativa")}
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
        <h1>Eliminar cooperativa: {cooperativa.nombres}</h1>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-6">
          <div className="card card-danger">
            <div className="card-header">
              <h3 className="card-title">
                ¿Está seguro de eliminar la cooperativa "{cooperativa.nombres}"?
              </h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleDelete}>
                {[
                  { label: "Nombre", value: cooperativa.nombres },
                  { label: "Dirección", value: cooperativa.dirrecion },
                  { label: "Celular", value: cooperativa.celular },
                ].map((field, index) => (
                  <div className="form-group" key={index}>
                    <label>{field.label}</label>
                    <input
                      type="text"
                      value={field.value}
                      className="form-control"
                      disabled
                    />
                  </div>
                ))}
                <hr />
                <div className="form-group">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/admin/cooperativa")}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-danger ms-2"
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

export default DeleteCooperativa;
