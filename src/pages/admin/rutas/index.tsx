import React, { useEffect, useRef, useState } from "react";
import AdminLayout from "../../layout/Index";
import { Api } from "../../../services/Api";
import { Link } from "react-router-dom";

interface Bus {
  id: number;
  nombre: string;
  placa: string;
  cantidad_asientos: number;
}

interface Cooperativa {
  id: number;
  nombres: string;
  buses: Bus[]; 
}

interface Ruta {
  id: number;
  origen: string;
  destino: string;
  duracion: string;
  fechaSalida: string;
  horaSalida: string;
  cooperativa: Cooperativa;
  bus?: Bus;  // <-- Bus asignado directamente en la ruta
}

const RutaList: React.FC = () => {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const tableRef = useRef<HTMLTableElement>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    Api.get("/rutas/rutas", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setRutas(res.data || []);
      })
      .catch((err) => {
        console.error("Error al obtener rutas:", err);
      });
  }, [token]);

  useEffect(() => {
    // @ts-ignore
    const $ = window.$ || window.jQuery;
    if (tableRef.current && $ && rutas.length > 0) {
      // @ts-ignore
      $(tableRef.current).DataTable({
        destroy: true,
        pageLength: 10,
        language: {
          emptyTable: "No hay información",
          info: "Mostrando _START_ a _END_ de _TOTAL_ rutas",
          infoEmpty: "Mostrando 0 a 0 de 0 rutas",
          infoFiltered: "(filtrado de _MAX_ registros totales)",
          lengthMenu: "Mostrar _MENU_ rutas",
          loadingRecords: "Cargando...",
          processing: "Procesando...",
          search: "Buscar:",
          zeroRecords: "Sin resultados encontrados",
          paginate: {
            first: "Primero",
            last: "Último",
            next: "Siguiente",
            previous: "Anterior",
          },
        },
        responsive: true,
        lengthChange: true,
        autoWidth: false,
        dom: "Bfrtip",
      });
    }

    return () => {
      if (tableRef.current && $ && $.fn.dataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }
    };
  }, [rutas]);

  return (
    <AdminLayout>
      <div className="row">
        <h1>Lista de Rutas</h1>
        <hr />
        <div className="col-md-12">
          <div className="card card-outline card-primary">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h3 className="card-title">Listado de Rutas</h3>
              <Link to="/admin/rutas/create" className="btn btn-primary ms-auto">
                Añadir
              </Link>
            </div>
            <div className="card-body">
              <table
                id="example1"
                className="table table-striped table-bordered table-sm"
                ref={tableRef}
              >
                <thead className="thead-dark">
                  <tr style={{ backgroundColor: "#c0c0c0", textAlign: "center" }}>
                    <th>Nro</th>
                    <th>Bus</th> 
                    <th>Origen</th>
                    <th>Destino</th>
                    <th>Duración</th>
                    <th>Fecha Salida</th>
                    <th>Hora Salida</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {rutas.map((ruta, idx) => (
                    <tr key={ruta.id} style={{ textAlign: "center" }}>
                      <td>{idx + 1}</td>
                      <td>{ruta.bus ? `${ruta.bus.nombre}` : "Sin bus asignado"}</td>
                      <td>{ruta.origen}</td>
                      <td>{ruta.destino}</td>
                      <td>{ruta.duracion}</td>
                      <td>{ruta.fechaSalida}</td>
                      <td>{ruta.horaSalida || "No especificada"}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <Link to={`/admin/rutas/${ruta.id}`} className="btn btn-info btn-sm">
                            <i className="bi bi-eye-fill"></i>
                          </Link>
                          <Link to={`/admin/rutas/${ruta.id}/edit`} className="btn btn-success btn-sm">
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <Link to={`/admin/rutas/${ruta.id}/confirm-delete`} className="btn btn-danger btn-sm">
                            <i className="bi bi-trash"></i>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default RutaList;
