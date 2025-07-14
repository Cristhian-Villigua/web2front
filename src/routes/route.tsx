import Login from "../pages/Server/Login";
import ProtectedRoute from "./ProtectedRoute";
import Register from "../pages/Server/Register";
import Welcome from "../pages/Welcome";
import Index from "../pages/admin";
import CreateUser from "../pages/admin/user/create";
import UserList from "../pages/admin/user";
import ShowUser from "../pages/admin/user/show";
import EditUser from "../pages/admin/user/edit";
import DeleteUser from "../pages/admin/user/delete";
import CreateEmpleado from "../pages/admin/empleado/create";
import EmpleadoList from "../pages/admin/empleado";
import ProveedorList from "../pages/admin/proovedor";
import CreateProveedor from "../pages/admin/proovedor/create";
import ShowProveedor from "../pages/admin/proovedor/show";
import ShowEmpleado from "../pages/admin/empleado/show";
import EditProveedor from "../pages/admin/proovedor/edit";
import EditEmpleado from "../pages/admin/empleado/edit";
import DeleteProveedor from "../pages/admin/proovedor/delete";
import DeleteEmpleado from "../pages/admin/empleado/delete";
import UsuarioList from "../pages/admin/usuario";
import ShowUsuario from "../pages/admin/usuario/show";
import EditUsuario from "../pages/admin/usuario/edit";
import Prueba from "../pages/Server/prueba";
import BaseDashBoard from "../pages/layout/BaseDashBoard";
import CreateUsuario from "../pages/admin/usuario/create";
import Cooperativalist from "../pages/admin/coopertiva";
import CreateCooperativa from "../pages/admin/coopertiva/create";
import ShowCooperativa from "../pages/admin/coopertiva/show";
import EditCooperativa from "../pages/admin/coopertiva/edit";
import DeleteCooperativa from "../pages/admin/coopertiva/delete";

export const routes = [
    {
        path: '/',
        element: <Welcome />,
    },{
        path: '/Loginantiguo',
        element: <Login />,
    },{
        path: '/login',
        element: <Prueba />,
    },{
        path: '/Register',
        element: <Register />,
    },{
        path: '/admin',
        element: (
            <ProtectedRoute allowedRoles={["admin", "proveedor", "empleado"]}>
                <Index />
            </ProtectedRoute>
        ),
    },{
        path: '/admin/users',
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <UserList />
            </ProtectedRoute>
        ),
    },{
        path: '/admin/users/create',
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <CreateUser />
            </ProtectedRoute>
        ),
    },{
        path: '/admin/users/:id',
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <ShowUser />
            </ProtectedRoute>
        ),
    },{
        path: '/admin/users/:id/edit',
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <EditUser />
            </ProtectedRoute>
        ),
    },{
        path: '/admin/users/:id/confirm-delete',
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <DeleteUser />
            </ProtectedRoute>
        ),
    },{
        path: '/admin/providers',
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <ProveedorList />
            </ProtectedRoute>
        ),
    },{
        path: '/admin/providers/create',
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <CreateProveedor />
            </ProtectedRoute>
        ),
    },{
        path: '/admin/providers/:id',
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <ShowProveedor />
            </ProtectedRoute>
        ),
    },{
        path: '/admin/providers/:id/edit',
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <EditProveedor />
            </ProtectedRoute>
        ),
    },{
        path: '/admin/providers/:id/confirm-delete',
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <DeleteProveedor />
            </ProtectedRoute>
        ),
    },{
        path: '/admin/employees',
        element: (
            <ProtectedRoute allowedRoles={["admin", "proveedor"]}>
                <EmpleadoList />
            </ProtectedRoute>
        ),
    },{
        path: '/admin/employees/create',
        element: (
            <ProtectedRoute allowedRoles={["admin", "proveedor"]}>
                <CreateEmpleado />
            </ProtectedRoute>
        ),
    },{
        path: '/admin/employees/:id',
        element: (
            <ProtectedRoute allowedRoles={["admin", "proveedor"]}>
                <ShowEmpleado />
            </ProtectedRoute>
        ),
    },{
        path: '/admin/employees/:id/edit',
        element: (
            <ProtectedRoute allowedRoles={["admin", "proveedor"]}>
                <EditEmpleado />
            </ProtectedRoute>
        ),
    },{
        path: '/admin/employees/:id/confirm-delete',
        element: (
            <ProtectedRoute allowedRoles={["admin", "proveedor"]}>
                <DeleteEmpleado />
            </ProtectedRoute>
        ),
    },{
        path: '/admin/usuarios',
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <UsuarioList />
            </ProtectedRoute>
        ),
    },{
        path: '/admin/usuarios/create',
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <CreateUsuario   />
            </ProtectedRoute>
        ),
    },{
        path: '/admin/usuarios/:id',
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <ShowUsuario />
            </ProtectedRoute>
        ),
    },{
        path: '/admin/usuarios/:id/edit',
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <EditUsuario />
            </ProtectedRoute>
        ),
    },{
        path: '/admin/usuarios/:id/confirm-delete',
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <DeleteUser />
            </ProtectedRoute>
        ),
    },{
        path: '/admin/cooperativa',
        element: (
            <ProtectedRoute allowedRoles={["admin", "proveedor"]}>
                <Cooperativalist />
            </ProtectedRoute>
        ),
    },{
        path: '/admin/cooperativa/create',
        element: (
            <ProtectedRoute allowedRoles={["admin", "proveedor"]}>
                <CreateCooperativa />
            </ProtectedRoute>
        ),
    },{
        path: '/admin/cooperativa/:id',
        element: (
            <ProtectedRoute allowedRoles={["admin", "proveedor"]}>
                <ShowCooperativa />
            </ProtectedRoute>
        ),
    },{
        path: '/admin/cooperativa/:id/edit',
        element: (
            <ProtectedRoute allowedRoles={["admin", "proveedor"]}>
                <EditCooperativa />
            </ProtectedRoute>
        ),
    },{
        path: '/admin/cooperativa/:id/confirm-delete',
        element: (
            <ProtectedRoute allowedRoles={["admin", "proveedor"]}>
                <DeleteCooperativa />
            </ProtectedRoute>
        ),
    },{
        path: '/dashboard',
        element: (
            <ProtectedRoute allowedRoles={["admin", "proveedor", "empleado"]}>
                <BaseDashBoard />
            </ProtectedRoute>
        ),
        children: [
            
        ]
    },
];