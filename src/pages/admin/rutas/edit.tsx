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
  cooperativa_id: number;
}

interface Cooperativa {
  id: number;
  nombres: string;
  buses: Bus[];
}

const EditRuta: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    origen: "",
    destino: "",
    duracion: "",
    fechaSalida: "",
    horaSalida: "",
    cooperativa_id: "",
    bus_id: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState<string>("");
  const [cooperativas, setCooperativas] = useState<Cooperativa[]>([]);
  const [busPreview, setBusPreview] = useState<Bus | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    Api.get("/cooperativa/cooperativa", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setCooperativas(data);
        } else if (data && typeof data.id !== "undefined") {
          setCooperativas([data]);
          setForm((prevForm) => ({
            ...prevForm,
            cooperativa_id: data.id.toString(),
          }));
        }
      })
      .catch((err) => console.error("Error al cargar cooperativas", err));

    if (id) {
      Api.get(`/rutas/rutas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          const ruta = response.data;
          setForm({
            origen: ruta.origen || "",
            destino: ruta.destino || "",
            duracion: ruta.duracion || "",
            fechaSalida: ruta.fechaSalida || "",
            horaSalida: ruta.horaSalida || "",
            cooperativa_id: ruta.cooperativa_id.toString(),
            bus_id: ruta.bus_id.toString(),
          });
        })
        .catch((err) => {
          console.error("Error al cargar ruta para editar", err);
          navigate("/admin/rutas");
        });
    }
  }, [id, token, navigate]);

  useEffect(() => {
    const selectedBus = cooperativas
      .flatMap((coop) => coop.buses ?? [])
      .find((bus) => bus.id === parseInt(form.bus_id));
    setBusPreview(selectedBus || null);
  }, [form.bus_id, cooperativas]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Si cambia la cooperativa, limpiamos el bus
    if (name === "cooperativa_id") {
      setForm({
        ...form,
        cooperativa_id: value,
        bus_id: "", // Limpiamos bus al cambiar cooperativa
      });
      setErrors({ ...errors, cooperativa_id: "", bus_id: "" });
      setServerError("");
    } else {
      setForm({ ...form, [name]: value });
      setErrors({ ...errors, [name]: "" });
      setServerError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setErrors({});

    const newErrors: { [key: string]: string } = {};
    // Validar los campos obligatorios
    ["origen", "destino", "duracion", "fechaSalida", "horaSalida", "cooperativa_id", "bus_id"].forEach((field) => {
      if (!form[field as keyof typeof form]) {
        newErrors[field] = "Este campo es obligatorio";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await Api.put(`/rutas/rutas/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.statusCode === 200 || response.statusCode === 201) {
        Swal.fire({
          icon: "success",
          title: "Ruta actualizada",
          text: "La ruta fue actualizada exitosamente.",
        });
        setTimeout(() => navigate("/admin/rutas"), 2000);
      } else if (response.data && response.data.errors) {
        setErrors(response.data.errors);
        Swal.fire({
          icon: "error",
          title: "Error en la validación",
          text: "Corrija los errores del formulario.",
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
      setServerError("Error al actualizar ruta");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al actualizar ruta",
      });
    }
  };

  // Obtener los buses disponibles de la cooperativa seleccionada
  const busesDisponibles = cooperativas.find((c) => c.id === parseInt(form.cooperativa_id))?.buses || [];

  return (
    <AdminLayout>
      <div className="row">
        <h1>Editar Ruta</h1>
        <hr />
        <div className="col-md-12">
          <div className="card card-outline card-primary">
            <div className="card-header">
              <h3 className="card-title">Actualizar Datos</h3>
            </div>
            <div className="card-body">
              {serverError && (
                <div className="alert alert-danger">{serverError}</div>
              )}
              <form onSubmit={handleSubmit}>
                {/* Cooperativa y Bus asignado */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Cooperativa *</label>
                      <select
                        name="cooperativa_id"
                        className="form-control"
                        value={form.cooperativa_id}
                        onChange={handleChange}
                      >
                        <option value="">Seleccione una cooperativa</option>
                        {cooperativas.map((coop) => (
                          <option key={coop.id} value={coop.id}>
                            {coop.nombres}
                          </option>
                        ))}
                      </select>
                      {errors.cooperativa_id && <small className="text-danger">{errors.cooperativa_id}</small>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Bus asignado *</label>
                      <select
                        name="bus_id"
                        className="form-control"
                        value={form.bus_id}
                        onChange={handleChange}
                        disabled={!form.cooperativa_id}
                      >
                        <option value="">Seleccione un bus</option>
                        {busesDisponibles.map((bus) => (
                          <option key={bus.id} value={bus.id}>
                            {bus.nombre}
                          </option>
                        ))}
                      </select>
                      {errors.bus_id && <small className="text-danger">{errors.bus_id}</small>}
                    </div>
                  </div>
                </div>

                {/* Origen, destino, duracion, fechaSalida, horaSalida */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Origen *</label>
                      <input
                        type="text"
                        name="origen"
                        className="form-control"
                        value={form.origen}
                        onChange={handleChange}
                      />
                      {errors.origen && <small className="text-danger">{errors.origen}</small>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Destino *</label>
                      <input
                        type="text"
                        name="destino"
                        className="form-control"
                        value={form.destino}
                        onChange={handleChange}
                      />
                      {errors.destino && <small className="text-danger">{errors.destino}</small>}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Duración *</label>
                      <input
                        type="text"
                        name="duracion"
                        className="form-control"
                        value={form.duracion}
                        onChange={handleChange}
                      />
                      {errors.duracion && <small className="text-danger">{errors.duracion}</small>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Fecha de salida *</label>
                      <input
                        type="date"
                        name="fechaSalida"
                        className="form-control"
                        value={form.fechaSalida}
                        onChange={handleChange}
                      />
                      {errors.fechaSalida && <small className="text-danger">{errors.fechaSalida}</small>}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Hora de salida *</label>
                      <input
                        type="time"
                        name="horaSalida"
                        className="form-control"
                        value={form.horaSalida}
                        onChange={handleChange}
                      />
                      {errors.horaSalida && <small className="text-danger">{errors.horaSalida}</small>}
                    </div>
                  </div>
                </div>

                {busPreview && (
                  <div className="alert alert-info">
                    <strong>Bus asignado:</strong> {busPreview.nombre}
                  </div>
                )}

                <hr />
                <div className="form-group d-flex">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/admin/rutas")}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary ms-2">
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

export default EditRuta;
