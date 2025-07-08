import {Formik} from "formik";
import InputLabel from "../../components/input/InputLabel";  
import { Button } from "react-bootstrap";
import * as Yup from 'yup';
import { Api } from "../../services/Api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Register = () => {
  const navigate = useNavigate(); 
  const [errorMsg, setErrorMsg] = useState("");

  const initialValues = {
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  }

  const validationSchema = Yup.object({
    name: Yup.string().min(3, "El nombre debe de tener minimo tres letras.").required("El nombre es requerido"),
    email: Yup.string()
    .email("El correo no es valido")
    .required("El correo es requerido"),
    password: Yup.string().min(5, "Minimo cinco caracteres.").max(50, "Maximo 50 caracteres.").required("La contraseña es requerida"),
    password_confirmation: Yup.string()
    .oneOf([Yup.ref("password")],"Las contraseña no coinciden")
    .required("La confirmación de la contraseña es requerida"),
  });

  const onSubmit = (values: typeof initialValues) => {
    setErrorMsg("");
    Api.post('/auth/register', values)
      .then((response) => {
        if (response.data && response.data.token) {
          localStorage.setItem("token", response.data.token);
          navigate("/login");
        } else if (response.data && response.data.message) {
          setErrorMsg(response.data.message);
        }
      })
      .catch(() => {
        setErrorMsg("Error en el registro");
      });
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div>
              <h1 className="text-2xl font-semibold text-center">Registro de Usuario</h1>
              </div>
              <br />
              {errorMsg && (
                <div className="text-red-600 text-center mb-2">{errorMsg}</div>
              )}
              <Formik 
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
                >
                  {({
                    values,
                    errors,
                    handleChange,
                    handleSubmit,
                  })=>(
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <InputLabel 
                    label="Correo"
                    name="email"
                    placeholder="example@gmail.com"
                    error={errors.email}
                    onChange = {handleChange}
                    value={values.email}
                    />
                    <InputLabel 
                    name="name"
                    label="Nombre"
                    placeholder="Alex"
                    error={errors.name}
                    onChange = {handleChange}
                    value={values.name}
                    />
                    <InputLabel 
                    label="Contraseña"
                    name="password"
                    placeholder="*********"
                    type="password"
                    error={errors.password}
                    onChange = {handleChange}
                    value={values.password}
                    />
                    <InputLabel 
                    label="Confirmar contraseña"
                    name="password_confirmation"
                    placeholder="*********"
                    type="password"
                    error={errors.password_confirmation}
                    onChange = {handleChange}
                    value={values.password_confirmation}
                    />
                    <Button
                      className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      value="Registrarse"
                      type="submit"
                    > Register
                    </Button>
                    <p className="mt-6 text-center text-gray-600">Tienes una cuenta? 
                      <Link to="/login" className="text-blue-500 hover:underline">
                      Iniciar Sesión</Link>
                    </p>
                  </form>
                  )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Register
