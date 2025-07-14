import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/Index";
import { Api } from "../../../services/Api";

interface Cooperativa {
  id: number;
  nombres: string;
  dirrecion: string;
  celular: string;
}

const ShowCooperativa: React.FC = () => {
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

  if (!cooperativa) {
    return (
      <AdminLayout>
        <div className="row">
          <div className="col-md-6">
            <div className="card card-info">
              <div className="card-body">
                <p>No se encontró la cooperativa.</p>
                <button className="btn btn-secondary" onClick={() => navigate("/admin/cooperativa")}>
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
        <h1>Cooperativa: {cooperativa.nombres}</h1>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-6">
          <div className="card card-info">
            <div className="card-header">
              <h3 className="card-title">Datos de la Cooperativa</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Nombre</label>
                <input type="text" value={cooperativa.nombres} className="form-control" disabled />
              </div>
              <div className="form-group mt-3">
                <label>Dirección</label>
                <input type="text" value={cooperativa.dirrecion} className="form-control" disabled />
              </div>
              <div className="form-group mt-3">
                <label>Celular</label>
                <input type="text" value={cooperativa.celular} className="form-control" disabled />
              </div>
              <hr />
              <div className="form-group">
                <button className="btn btn-secondary" onClick={() => navigate("/admin/cooperativa")}>
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

export default ShowCooperativa;
