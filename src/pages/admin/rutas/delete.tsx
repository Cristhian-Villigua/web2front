import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/Index";
import { Api } from "../../../services/Api";
import Swal from "sweetalert2";

interface Bus {
  id: number;
  nombre: string;
  placa: string;
  cantidad_asientos: number;
}

interface Cooperativa {
  id: number;
  nombres: string;
}

interface Ruta {
  id: number;
  origen: string;
  destino: string;
  duracion: string;
  fechaSalida: string;
  horaSalida: string;
  cooperativa: Cooperativa;
  bus?: Bus;
}

const DeleteRuta: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ruta, setRuta] = useState<Ruta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    // Cargar los datos de la ruta
    Api.get(`/rutas/rutas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        setRuta(response.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate("/admin/rutas");
      });
  }, [id, navigate]);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await Api.delete(`/rutas/rutas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 || response.status === 204) {
        Swal.fire({
          icon: "success",
          title: "Ruta eliminada",
          text: "La ruta ha sido eliminada correctamente.",
        });
        setTimeout(() => navigate("/admin/rutas"), 2000);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data?.message || "No se pudo eliminar la ruta.",
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al intentar eliminar la ruta.",
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
                <p>Cargando datos de la ruta...</p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!ruta) {
    return (
      <AdminLayout>
        <div className="row">
          <div className="col-md-6">
            <div className="card card-danger">
              <div className="card-body">
                <p>No se encontró la ruta.</p>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate("/admin/rutas")}
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
        <h1>Eliminar ruta: {ruta.origen} - {ruta.destino}</h1>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-6">
          <div className="card card-danger">
            <div className="card-header">
              <h3 className="card-title">
                ¿Está seguro de eliminar la ruta de "{ruta.origen}" a "{ruta.destino}"?
              </h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleDelete}>
                {[{ label: "Origen", value: ruta.origen },
                  { label: "Destino", value: ruta.destino },
                  { label: "Duración", value: ruta.duracion },
                  { label: "Fecha de salida", value: ruta.fechaSalida },
                  { label: "Hora de salida", value: ruta.horaSalida || "No especificada" }]
                  .map((field, index) => (
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
                    onClick={() => navigate("/admin/rutas")}
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

export default DeleteRuta;
