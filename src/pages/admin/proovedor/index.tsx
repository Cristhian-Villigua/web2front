import React, { useEffect, useRef, useState } from "react";
import AdminLayout from "../../layout/Index";
import { Api } from "../../../services/Api";

interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  celular: string;
  dirrecion: string;
  role: string; 
}

const ProveedorList: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No hay token de autenticación");
      return;
    }
    Api.get("/proveedor/usuarios", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => setUsuarios(response.data || []))
      .catch((err) => {
        console.error("Error al obtener usuarios:", err);
      });
  }, []);

  useEffect(() => {
    // Inicializa DataTable cuando los datos estén listos
    // @ts-ignore
    const $ = window.$ || window.jQuery;
    if (tableRef.current && $ && usuarios.length > 0) {
      // @ts-ignore
      $(tableRef.current).DataTable({
        destroy: true,
        pageLength: 10,
        language: {
          emptyTable: "No hay información",
          info: "Mostrando _START_ a _END_ de _TOTAL_ Usuarios",
          infoEmpty: "Mostrando 0 a 0 de 0 Usuarios",
          infoFiltered: "(filtrado de _MAX_ registros totales)",
          thousands: ",",
          lengthMenu: "Mostrar _MENU_ Usuarios",
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
    // Limpieza al desmontar
    return () => {
      if (tableRef.current && $ && $.fn.dataTable.isDataTable(tableRef.current)) {
        // @ts-ignore
        $(tableRef.current).DataTable().destroy();
      }
    };
  }, [usuarios]);

  return (
    <AdminLayout>
      <div className="row">
        <h1>Lista de Proveedores</h1>
        <hr />
        <div className="col-md-12">
          <div className="card card-outline card-primary">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h3 className="card-title">Registrar Proveedor</h3>
              <a href="/admin/providers/create" className="btn btn-primary ms-auto">
                Añadir
              </a>
            </div>
            <div className="card-body">
              <table
                id="example1"
                className="table table-striped table-bordered table-sm"
                ref={tableRef}
              >
                <thead className="thead-dark">
                  <tr style={{ backgroundColor: "#c0c0c0", textAlign: "center" }}>
                    <td><b>Nro</b></td>
                    <td><b>Nombres</b></td>
                    <td><b>Apellidos</b></td>
                    <td><b>Cédula</b></td>
                    <td><b>Celular</b></td>
                    <td><b>Dirección</b></td>
                    <td><b>Acciones</b></td>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.filter((usuario) => usuario.role === "proveedor")
                  .map((usuario, idx) => (
                    <tr key={usuario.id} style={{ textAlign: "center" }}>
                      <td>{idx + 1}</td>
                      <td>{usuario.nombres}</td>
                      <td>{usuario.apellidos}</td>
                      <td>{usuario.cedula}</td>
                      <td>{usuario.celular}</td>
                      <td>{usuario.dirrecion}</td>
                      <td>
                        <div className="btn-group" role="group" aria-label="Basic example">
                          <a
                            href={`/admin/providers/${usuario.id}`}
                            className="btn btn-info btn-sm"
                          >
                            <i className="bi bi-eye-fill"></i>
                          </a>
                          <a
                            href={`/admin/providers/${usuario.id}/edit`}
                            className="btn btn-success btn-sm"
                          >
                            <i className="bi bi-pencil"></i>
                          </a>
                          <a
                            href={`/admin/providers/${usuario.id}/confirm-delete`}
                            className="btn btn-danger btn-sm"
                          >
                            <i className="bi bi-trash"></i>
                          </a>
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

export default ProveedorList;