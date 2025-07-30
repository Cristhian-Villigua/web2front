import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/Index";
import { Api } from "../../../services/Api";

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

interface Ruta {
  id: number;
  origen: string;
  destino: string;
  duracion: string;
  fechaSalida: string;
  horaSalida: string;
  precio: number;
  cooperativa: Cooperativa;
  bus: Bus;
}

const ShowRuta: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Obtener el id de la ruta desde la URL
  const navigate = useNavigate();
  const [ruta, setRuta] = useState<Ruta | null>(null); // Almacenar los datos de la ruta
  const [loading, setLoading] = useState(true); // Estado para la carga de los datos

  useEffect(() => {
    const token = localStorage.getItem("token"); // Verificamos si el usuario está autenticado
    if (!token) {
      navigate("/"); // Si no hay token, redirigimos al login
      return;
    }

    // Realizamos la solicitud GET a la API para obtener los datos de la ruta
    Api.get(`/rutas/rutas/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setRuta(response.data); // Guardamos los datos de la ruta en el estado
        setLoading(false); // Terminamos de cargar
      })
      .catch(() => {
        setLoading(false); // Si ocurre un error, dejamos de cargar
        navigate("/admin/rutas"); // Redirigimos al listado de rutas
      });
  }, [id, navigate]);

  // Si los datos están cargando, mostramos un mensaje de carga
  if (loading) {
    return (
      <AdminLayout>
        <div className="row">
          <div className="col-md-6">
            <div className="card card-outline card-info">
              <div className="card-body">
                <p>Cargando información de la ruta...</p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Si no se encontró la ruta, mostramos un mensaje de error
  if (!ruta) {
    return (
      <AdminLayout>
        <div className="row">
          <div className="col-md-6">
            <div className="card card-info">
              <div className="card-body">
                <p>No se encontró la ruta.</p>
                <button className="btn btn-secondary" onClick={() => navigate("/admin/rutas")}>
                  Volver
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
        <h1>Ruta: {ruta.origen} - {ruta.destino}</h1>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-10">
          <div className="card card-info">
            <div className="card-header">
              <h3 className="card-title">Detalles de la Ruta</h3>
            </div>
            <div className="card-body">
              {/* Cooperativa */}
              <div className="row">
                <div className="col-md-5">
                  <div className="form-group">
                    <label>Cooperativa</label>
                    <input
                      type="text"
                      value={ruta.cooperativa.nombres}
                      className="form-control"
                      disabled
                    />
                    </div>
                </div>
                <div className="col-md-5">
                  <div className="form-group">
                    <label>Bus asignado</label>
                    <input
                      type="text"
                      value={ruta.bus.nombre}
                      className="form-control"
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-5">
                  <div className="form-group">
                    <label>Origen</label>
                      <input
                        type="text"
                        value={ruta.origen}
                        className="form-control"
                        disabled
                      />
                    </div>
                </div>
                <div className="col-md-5">
                  <div className="form-group">
                    <label>Destino</label>
                      <input
                        type="text"
                        value={ruta.destino}
                        className="form-control"
                        disabled
                      />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-5">
                  <div className="form-group">
                    <label>Duración</label>
                      <input
                        type="text"
                        value={ruta.duracion}
                        className="form-control"
                        disabled
                      />
                    </div>
                </div>
                <div className="col-md-5">
                  <div className="form-group">
                    <label>Fecha de salida</label>
                      <input
                        type="date"
                        value={ruta.fechaSalida}
                        className="form-control"
                        disabled
                      />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-5">
                  <div className="form-group">
                    <label>Hora de salida</label>
                    <input
                      type="time"
                      value={ruta.horaSalida}
                      className="form-control"
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-5">
                  <div className="form-group">
                    <label>Precio</label>
                    <input
                      type="text"
                      value={ruta.precio}
                      className="form-control"
                      disabled
                    />
                  </div>
                </div>
              </div>
              <hr />
              <div className="form-group mt-3">
                <button className="btn btn-secondary" onClick={() => navigate("/admin/rutas")}>
                  Volver
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ShowRuta;
