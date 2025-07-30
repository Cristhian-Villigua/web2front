import React, { useEffect, useState } from "react";
import { Api } from "../../../services/Api";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/Index";
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

const CreateRuta: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    origen: "",
    destino: "",
    duracion: "",
    fechaSalida: "",
    horaSalida: "",
    precio: "",
    cooperativa_id: "",
    bus_id: ""
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
        } else {
          console.error("Respuesta inesperada: cooperativa o id no definidos", data);
        }
      })
      .catch((err) =>
        console.error("Error al cargar cooperativa del usuario:", err)
      );
  }, [token]);

  useEffect(() => {
    const selectedBus = cooperativas
      .flatMap(c => c.buses ?? [])
      .find(bus => bus.id === parseInt(form.bus_id));
    setBusPreview(selectedBus || null);
  }, [form.bus_id, cooperativas]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "precio") {
    // Permite solo números con hasta 2 decimales o campo vacío
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setForm({ ...form, [name]: value });
      setErrors({ ...errors, [name]: "" });
    }
    return; // importante para no ejecutar lo demás cuando sea precio
  }
    if (name === "cooperativa_id") {
      setForm({
        ...form,
        cooperativa_id: value,
        bus_id: "",
      });
      setErrors({ ...errors, cooperativa_id: "", bus_id: "" });
      setServerError("");
    } else {
      setForm({ ...form, [name]: value });
      setErrors({ ...errors, [name]: "" });
      setServerError("");
    }
  };

  // Función para parsear duración humana a HH:MM
  const parseDuracionHumana = (input: string): string | null => {
    input = input.toLowerCase().trim();

    // 4:30h o 04:30
    const matchClock = input.match(/^(\d{1,2}):(\d{2})h?$/);
    if (matchClock) {
      const h = parseInt(matchClock[1], 10);
      const m = parseInt(matchClock[2], 10);
      if (h < 24 && m < 60) {
        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
      }
    }

    // 4h, 4 h, 4 horas
    const matchHoras = input.match(/^(\d{1,2})\s*(h|horas?)$/);
    if (matchHoras) {
      const h = parseInt(matchHoras[1], 10);
      return `${h.toString().padStart(2, "0")}:00`;
    }

    // 4h 30m
    const matchCombo = input.match(/^(\d{1,2})\s*h(?:oras?)?\s*(\d{1,2})\s*m(?:in)?$/);
    if (matchCombo) {
      const h = parseInt(matchCombo[1], 10);
      const m = parseInt(matchCombo[2], 10);
      if (m < 60) {
        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setErrors({});

    const newErrors: { [key: string]: string } = {};

    // Campos obligatorios
    ["origen", "destino", "duracion", "fechaSalida", "horaSalida", "precio", "cooperativa_id", "bus_id"].forEach(field => {
      if (!form[field as keyof typeof form]) {
        newErrors[field] = "Este campo es obligatorio";
      }
    });

    // Validar duración y convertir
    const duracionParseada = parseDuracionHumana(form.duracion);
    if (!duracionParseada) {
      newErrors.duracion = "Formato inválido. Ej: 4h, 4:30h, 4 horas, 4h 30m";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const precioNum = parseFloat(form.precio);
      if (isNaN(precioNum) || precioNum <= 0) {
        newErrors.precio = "El precio debe ser un número mayor a 0";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }


    const formToSend = {
      ...form,
      duracion: duracionParseada,
      precio: precioNum, 
    };

    try {
      const response = await Api.post("/rutas/rutas", formToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (typeof response.data === "string" && response.data.startsWith("<!DOCTYPE")) {
        throw new Error("El backend devolvió HTML. Verifica la ruta y autenticación.");
      }

      if (response.statusCode === 200 || response.statusCode === 201) {
        Swal.fire({
          icon: "success",
          title: "Ruta registrada",
          text: "La ruta fue creada exitosamente.",
        });
        setTimeout(() => {
          navigate("/admin/rutas");
        }, 2000);
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
      setServerError("Error al registrar ruta");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al registrar ruta",
      });
    }
  };

  const busesDisponibles = cooperativas.find(c => c.id === parseInt(form.cooperativa_id))?.buses || [];

  return (
    <AdminLayout>
      <div className="row">
        <h1>Registrar Ruta</h1>
        <hr />
        <div className="col-md-12">
          <div className="card card-outline card-primary">
            <div className="card-header">
              <h3 className="card-title">Complete los datos</h3>
            </div>
            <div className="card-body">
              {serverError && (
                <div className="alert alert-danger">{serverError}</div>
              )}
              <form onSubmit={handleSubmit}>

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
                        placeholder="0h 0m"
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
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Precio *</label>
                      <input
                        type="text"
                        name="precio"
                        className={`form-control ${errors.precio ? "is-invalid" : ""}`}
                        step="0.01"
                        min="0"
                        value={form.precio}
                        onChange={handleChange}
                      />
                      {errors.precio && <small className="text-danger">{errors.precio}</small>}
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

export default CreateRuta;
