import React, { useEffect, useRef, useState } from "react";
import AdminLayout from "../../layout/Index";
import { Api } from "../../../services/Api";
import { Link } from "react-router-dom";

interface Cooperativa {
  id: number;
  nombres: string;
}

interface Bus {
  id: number;
  nombre: string;
  placa: string;
  cantidad_asientos: number;
  cooperativa: Cooperativa;
}

const BusList: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const tableRef = useRef<HTMLTableElement>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    Api.get("/bus/bus", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setBuses(res.data || []);
      })
      .catch((err) => {
        console.error("Error al obtener buses:", err);
      });
  }, [token]);

  // Inicializa DataTable
  useEffect(() => {
    // @ts-ignore
    const $ = window.$ || window.jQuery;
    if (tableRef.current && $ && buses.length > 0) {
      // @ts-ignore
      $(tableRef.current).DataTable({
        destroy: true,
        pageLength: 10,
        language: {
          emptyTable: "No hay información",
          info: "Mostrando _START_ a _END_ de _TOTAL_ buses",
          infoEmpty: "Mostrando 0 a 0 de 0 buses",
          infoFiltered: "(filtrado de _MAX_ registros totales)",
          lengthMenu: "Mostrar _MENU_ buses",
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
  }, [buses]);

  return (
    <AdminLayout>
      <div className="row">
        <h1>Lista de Buses</h1>
        <hr />
        <div className="col-md-12">
          <div className="card card-outline card-primary">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h3 className="card-title">Listado de Buses</h3>
              <Link to="/admin/buses/create" className="btn btn-primary ms-auto">
                Añadir
              </Link>
            </div>
            <div className="card-body">
              <table
                id="busesTable"
                className="table table-striped table-bordered table-sm"
                ref={tableRef}
              >
                <thead className="thead-dark">
                  <tr style={{ backgroundColor: "#c0c0c0", textAlign: "center" }}>
                    <th>Nro</th>
                    <th>Cooperativa</th>
                    <th>Nombre</th>
                    <th>Asientos</th>
                    <th>Placa</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {buses.map((bus, idx) => (
                    <tr key={bus.id} style={{ textAlign: "center" }}>
                      <td>{idx + 1}</td>
                      <td>
                        {bus.cooperativa
                          ? `${bus.cooperativa.nombres}`
                          : "Sin propietario"}
                      </td>
                      <td>{bus.nombre}</td>
                      <td>{bus.cantidad_asientos}</td>
                      <td>{bus.placa}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <Link
                            to={`/admin/buses/${bus.id}`}
                            className="btn btn-info btn-sm"
                          >
                            <i className="bi bi-eye-fill"></i>
                          </Link>
                          <Link
                            to={`/admin/buses/${bus.id}/edit`}
                            className="btn btn-success btn-sm"
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <Link
                            to={`/admin/buses/${bus.id}/confirm-delete`}
                            className="btn btn-danger btn-sm"
                          >
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

export default BusList;
