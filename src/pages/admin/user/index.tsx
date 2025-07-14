import React, { useEffect, useRef, useState } from "react";
import AdminLayout from "../../layout/Index";
import { Api } from "../../../services/Api";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No hay token de autenticación");
      return;
    }
    Api.get("/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => setUsers(response.data.users || []))
      .catch((err) => {
        console.error("Error al obtener usuarios:", err);
      });
  }, []);

  useEffect(() => {
    // Inicializa DataTable cuando los datos estén listos
    // @ts-ignore
    const $ = window.$ || window.jQuery;
    if (tableRef.current && $ && users.length > 0) {
      // @ts-ignore
      $(tableRef.current).DataTable({
        destroy: true, // Permite reinicializar
        pageLength: 10,
        language: {
          emptyTable: "No hay información",
          info: "Showing _START_ to _END_ of _TOTAL_ Users",
          infoEmpty: "Showing 0 a 0 de 0 Users",
          infoFiltered: "(filtered from _MAX_ total entries)",
          thousands: ",",
          lengthMenu: "Show _MENU_ Users",
          loadingRecords: "loading...",
          processing: "Processing...",
          search: "Search:",
          zeroRecords: "Sin resultados encontrados",
          paginate: {
            first: "First",
            last: "Last",
            next: "Next",
            previous: "Previous",
          },
        },
        responsive: true,
        lengthChange: true,
        autoWidth: false,
        buttons: [
          {
            extend: "collection",
            text: "Reports",
            orientation: "landscape",
            buttons: [
              { extend: "copy" },
              { extend: "pdf" },
              { extend: "csv" },
              { extend: "excel" },
              { extend: "print" },
            ],
          },
          {
            extend: "colvis",
            collectionLayout: "fixed three-column",
          },
        ],
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
  }, [users]);

  return (
    <AdminLayout>
      <div className="row">
        <h1>Lista de Administradores</h1>
        <hr />
        <div className="col-md-10">
          <div className="card card-outline card-primary">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h3 className="card-title">Listado de Administradores</h3>
              <a href="/admin/users/create" className="btn btn-primary ms-auto">
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
                    <td><b>Name</b></td>
                    <td><b>Email</b></td>
                    <td><b>Actions</b></td>
                  </tr>
                </thead>
                <tbody>
                  {users.filter((usuario) => usuario.role === "admin")
                  .map((usuario, idx) => (
                    <tr key={usuario.id} style={{ textAlign: "center" }}>
                      <td>{idx + 1}</td>
                      <td>{usuario.name}</td>
                      <td>{usuario.email}</td>
                      <td>
                        <div className="btn-group" role="group" aria-label="Basic example">
                          <a
                            href={`/admin/users/${usuario.id}`}
                            className="btn btn-info btn-sm"
                          >
                            <i className="bi bi-eye-fill"></i>
                          </a>
                          <a
                            href={`/admin/users/${usuario.id}/edit`}
                            className="btn btn-success btn-sm"
                          >
                            <i className="bi bi-pencil"></i>
                          </a>
                          <a
                            href={`/admin/users/${usuario.id}/confirm-delete`}
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

export default UserList;