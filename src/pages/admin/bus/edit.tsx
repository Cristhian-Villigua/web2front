import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/Index";
import { Api } from "../../../services/Api";
import Swal from "sweetalert2";

interface Cooperativa {
  id: number;
  nombres: string;
}

interface FormData {
  nombre: string;
  placa: string;
  cantidad_asientos: string; // Cambié a string
  cooperativa_id: number | null;
}

const EditBus: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>({
    nombre: "",
    placa: "",
    cantidad_asientos: "", // vacío para que no muestre 0
    cooperativa_id: null,
  });

  const [cooperativas, setCooperativas] = useState<Cooperativa[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  // Cargar cooperativas para el select
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    Api.get("/cooperativa/cooperativa", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setCooperativas(res.data);
      })
      .catch(() => {
        Swal.fire("Error", "No se pudieron cargar las cooperativas.", "error");
      });
  }, [navigate]);

  // Cargar datos del bus
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
        const bus = response.data.bus || response.data;
        setForm({
          nombre: bus.nombre || "",
          placa: bus.placa || "",
          cantidad_asientos: bus.cantidad_asientos ? String(bus.cantidad_asientos) : "",
          cooperativa_id: bus.cooperativa?.id || null,
        });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate("/admin/buses");
      });
  }, [id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "cantidad_asientos") {
      // Permitir solo números y vacío
      if (value === "" || /^[0-9\b]+$/.test(value)) {
        setForm((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

     const validationErrors: { [key: string]: string } = {};

    if (!form.nombre) validationErrors.nombre = "El nombre es obligatorio.";
    if (!form.placa) validationErrors.placa = "La placa es obligatoria.";
    if (
      !form.cantidad_asientos ||
      isNaN(Number(form.cantidad_asientos)) ||
      Number(form.cantidad_asientos) < 1
    )
      validationErrors.cantidad_asientos = "Debe ingresar un número válido mayor que cero.";
    if (!form.cooperativa_id) validationErrors.cooperativa_id = "Debe seleccionar una cooperativa.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const payload = {
        ...form,
        cantidad_asientos: Number(form.cantidad_asientos),
        cooperativa_id: Number(form.cooperativa_id),
      };

      const response = await Api.put(`/bus/bus/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const statusCode = response.status || response.statusCode;

      if (statusCode === 200 || statusCode === 204) {
        Swal.fire({
          icon: "success",
          title: "Bus actualizado",
          text: "El bus fue actualizado correctamente.",
        });
        setTimeout(() => navigate("/admin/buses"), 2000);
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
          text: response.data?.message || "Error al actualizar el bus.",
        });
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.response?.data?.message || "Error al actualizar el bus.",
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
                <p>Cargando bus...</p>
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
        <h1>Editar Bus: {form.nombre}</h1>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-6">
          <div className="card card-outline card-info">
            <div className="card-header">
              <h3 className="card-title">Actualizar Datos</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group mb-3">
                  <label>
                    Nombre <b>*</b>
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                    value={form.nombre}
                    onChange={handleChange}
                  />
                  {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                </div>
                <div className="form-group mb-3">
                  <label>
                    Placa <b>*</b>
                  </label>
                  <input
                    type="text"
                    name="placa"
                    className={`form-control ${errors.placa ? "is-invalid" : ""}`}
                    value={form.placa}
                    onChange={handleChange}
                    required
                  />
                  {errors.placa && <div className="invalid-feedback">{errors.placa}</div>}
                </div>

                <div className="form-group mb-3">
                  <label>
                    Cantidad de Asientos <b>*</b>
                  </label>
                  <input
                    type="text" // <-- cambiar a text para mejor control
                    name="cantidad_asientos"
                    className={`form-control no-spinner ${
                      errors.cantidad_asientos ? "is-invalid" : ""
                    }`}
                    value={form.cantidad_asientos}
                    onChange={handleChange}
                    placeholder="Cantidad de asientos"
                    required
                  />
                  {errors.cantidad_asientos && (
                    <div className="invalid-feedback">{errors.cantidad_asientos}</div>
                  )}
                </div>

                <div className="form-group mb-3">
                  <label>
                    Cooperativa <b>*</b>
                  </label>
                  <select
                    name="cooperativa_id"
                    className={`form-select ${errors.cooperativa_id ? "is-invalid" : ""}`}
                    value={form.cooperativa_id ?? ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Seleccione una cooperativa
                    </option>
                    {cooperativas.map((coop) => (
                      <option key={coop.id} value={coop.id}>
                        {coop.nombres}
                      </option>
                    ))}
                  </select>
                  {errors.cooperativa_id && (
                    <div className="invalid-feedback">{errors.cooperativa_id}</div>
                  )}
                </div>

                <hr />

                <div className="form-group d-flex">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/admin/buses")}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success ms-2">
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

export default EditBus;
