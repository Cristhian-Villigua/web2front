import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/Index";
import { Api } from "../../../services/Api";
import Swal from "sweetalert2";

interface Cooperativa {
  id: number;
  nombres: string;
}

interface Bus {
  id: number;
  nombre: string;
  placa: string;
  cantidad_asientos: number;
  cooperativa: Cooperativa | null;
}

const DeleteBus: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bus, setBus] = useState<Bus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    Api.get(`/bus/bus/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setBus(response.data.bus || response.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate("/admin/buses");
      });
  }, [id, navigate]);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await Api.delete(`/bus/bus/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: "Bus eliminado",
        text: "El bus fue eliminado correctamente.",
      });

      setTimeout(() => navigate("/admin/buses"), 1500);
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Ocurrió un error al intentar eliminar el bus.",
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
                <p>Cargando información del bus...</p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!bus) {
    return (
      <AdminLayout>
        <div className="row">
          <div className="col-md-6">
            <div className="card card-danger">
              <div className="card-body">
                <p>No se encontró el bus.</p>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate("/admin/buses")}
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
        <h1>Eliminar Bus: {bus.nombre}</h1>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-6">
          <div className="card card-danger">
            <div className="card-header">
              <h3 className="card-title">
                ¿Está seguro de eliminar el bus con placa "{bus.nombre}"?
              </h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleDelete}>
                <div className="form-group">
                  <label>Nombre</label>
                  <input type="text" value={bus.nombre} className="form-control" disabled />
                </div>
                <div className="form-group">
                  <label>Placa</label>
                  <input type="text" value={bus.placa} className="form-control" disabled />
                </div>
                <div className="form-group mt-3">
                  <label>Cantidad de asientos</label>
                  <input type="number" value={bus.cantidad_asientos} className="form-control" disabled />
                </div>
                <div className="form-group mt-3">
                  <label>Cooperativa</label>
                  <input
                    type="text"
                    value={bus.cooperativa?.nombres || "Sin cooperativa"}
                    className="form-control"
                    disabled
                  />
                </div>
                <hr />
                <div className="form-group">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/admin/buses")}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-danger ms-2">
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

export default DeleteBus;
