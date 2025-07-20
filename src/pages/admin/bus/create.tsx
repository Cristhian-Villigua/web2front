import React, { useState, useEffect } from "react";
import { Api } from "../../../services/Api";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/Index";
import Swal from "sweetalert2";

const CreateBus: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    placa: "",
    cantidad_asientos: "",
    cooperativa_id: "",
  });

  const [cooperativas, setCooperativas] = useState<any[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const fetchCooperativas = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await Api.get("/cooperativa/cooperativa", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCooperativas(res.data);
      } catch (err) {
        console.error("Error cargando cooperativas:", err);
      }
    };
    fetchCooperativas();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "cantidad_asientos") {
      if (value === "" || /^[0-9\b]+$/.test(value)) {
        setForm({ ...form, [name]: value });
        setErrors({ ...errors, [name]: "" });
      }
    } else {
      setForm({ ...form, [name]: value });
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    const newErrors: { [key: string]: string } = {};

    if (!form.nombre) newErrors.nombre = "El nombre es requerido";
    if (!form.placa) newErrors.placa = "La placa es requerida";
    if (
      !form.cantidad_asientos ||
      isNaN(Number(form.cantidad_asientos)) ||
      Number(form.cantidad_asientos) < 1
    )
      newErrors.cantidad_asientos = "Debe ser un número válido mayor que cero";
    if (!form.cooperativa_id) newErrors.cooperativa_id = "Seleccione una cooperativa";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...form,
        cantidad_asientos: Number(form.cantidad_asientos),
        cooperativa_id: Number(form.cooperativa_id),
      };

      const response = await Api.post("/bus/bus", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (typeof response.data === "string" && response.data.startsWith("<!DOCTYPE")) {
        throw new Error("El backend devolvió HTML. Verifica la ruta y autenticación.");
      }

      if (response.statusCode === 200 || response.statusCode === 201) {
        Swal.fire({
          icon: "success",
          title: "Bus registrado",
          text: "El bus fue creado exitosamente.",
        });
        setTimeout(() => {
          navigate("/admin/buses");
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
      setServerError("Error al registrar bus");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al registrar bus",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="row">
        <h1>Registrar Bus</h1>
        <hr />
        <div className="col-md-6">
          <div className="card card-outline card-primary">
            <div className="card-header">
              <h3 className="card-title">Complete los datos</h3>
            </div>
            <div className="card-body">
              {serverError && <div className="alert alert-danger">{serverError}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nombre <b>*</b></label>
                  <input
                    type="text"
                    name="nombre"
                    className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                    value={form.nombre}
                    onChange={handleChange}
                  />
                  {errors.nombre && <small className="text-danger">{errors.nombre}</small>}
                </div>
                <br />
                <div className="form-group">
                  <label>Placa <b>*</b></label>
                  <input
                    type="text"
                    name="placa"
                    className={`form-control ${errors.placa ? "is-invalid" : ""}`}
                    value={form.placa}
                    onChange={handleChange}
                  />
                  {errors.placa && <small className="text-danger">{errors.placa}</small>}
                </div>
                <br />
                <div className="form-group">
                  <label>Cantidad de Asientos <b>*</b></label>
                  <input
                    type="text"
                    name="cantidad_asientos"
                    className={`form-control ${errors.cantidad_asientos ? "is-invalid" : ""}`}
                    value={form.cantidad_asientos}
                    onChange={handleChange}
                    placeholder="Cantidad de asientos"
                  />
                  {errors.cantidad_asientos && (
                    <small className="text-danger">{errors.cantidad_asientos}</small>
                  )}
                </div>
                <br />
                <div className="form-group">
                  <label>Cooperativa <b>*</b></label>
                  <select
                    name="cooperativa_id"
                    className={`form-control ${errors.cooperativa_id ? "is-invalid" : ""}`}
                    value={form.cooperativa_id}
                    onChange={handleChange}
                  >
                    <option value="">Seleccione una</option>
                    {cooperativas.map((coop) => (
                      <option key={coop.id} value={coop.id}>
                        {coop.nombres}
                      </option>
                    ))}
                  </select>
                  {errors.cooperativa_id && (
                    <small className="text-danger">{errors.cooperativa_id}</small>
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

export default CreateBus;
