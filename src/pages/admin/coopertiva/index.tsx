import React, { useEffect, useRef, useState } from "react";
import AdminLayout from "../../layout/Index";
import { Api } from "../../../services/Api";
import { Link } from "react-router-dom";

interface Proveedor {
  id: number;
  name: string;
}

interface Cooperativa {
  id: number;
  nombres: string;
  dirrecion: string;
  celular: string;
  user_id: number;
  owner: Proveedor;
}

const CooperativaList: React.FC = () => {
  const [cooperativas, setCooperativas] = useState<Cooperativa[]>([]);
  const tableRef = useRef<HTMLTableElement>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    Api.get("/cooperativa/cooperativa", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setCooperativas(res.data || []);
      })
      .catch((err) => {
        console.error("Error al obtener cooperativas:", err);
      });
  }, [token]);

  // Inicializa DataTable
  useEffect(() => {
    // @ts-ignore
    const $ = window.$ || window.jQuery;
    if (tableRef.current && $ && cooperativas.length > 0) {
      // @ts-ignore
      $(tableRef.current).DataTable({
        destroy: true,
        pageLength: 10,
        language: {
          emptyTable: "No hay información",
          info: "Mostrando _START_ a _END_ de _TOTAL_ cooperativas",
          infoEmpty: "Mostrando 0 a 0 de 0 cooperativas",
          infoFiltered: "(filtrado de _MAX_ registros totales)",
          lengthMenu: "Mostrar _MENU_ cooperativas",
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
        // @ts-ignore
        $(tableRef.current).DataTable().destroy();
      }
    };
  }, [cooperativas]);

  return (
    <AdminLayout>
      <div className="row">
        <h1>Lista de Cooperativas</h1>
        <hr />
        <div className="col-md-12">
          <div className="card card-outline card-primary">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h3 className="card-title">Listado de Cooperativas</h3>
              <Link to="/admin/cooperativa/create" className="btn btn-primary ms-auto">
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
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>Celular</th>
                    <th>Propietario</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cooperativas.map((coop, idx) => (
                    <tr key={coop.id} style={{ textAlign: "center" }}>
                      <td>{idx + 1}</td>
                      <td>{coop.nombres}</td>
                      <td>{coop.dirrecion}</td>
                      <td>{coop.celular}</td>
                      <td>
                        {coop.owner
                          ? `${coop.owner.name}`
                          : "Sin propietario"}
                      </td>
                       <td>
                        <div className="btn-group" role="group" aria-label="Basic example">
                          <Link
                            to={`/admin/cooperativa/${coop.id}`}
                            className="btn btn-info btn-sm"
                          >
                            <i className="bi bi-eye-fill"></i>
                          </Link>
                          <Link
                            to={`/admin/cooperativa/${coop.id}/edit`}
                            className="btn btn-success btn-sm"
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <Link
                            to={`/admin/cooperativa/${coop.id}/confirm-delete`}
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

export default CooperativaList;
