import * as Yup from 'yup';
import {Formik} from "formik";
import InputLabel from "../../components/input/InputLabel";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Api } from '../../services/Api';
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate(); 
  const [errorMsg, setErrorMsg] = useState(""); 

  const initialValues = {
    email: '',
    password: '',
  }
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("El correo no es valido")
      .required("El correo es requerido"),
    password: Yup.string().min(5, "Minimo cinco caracteres.").max(50, "Maximo 50 caracteres.").required("La contraseña es requerida"),
  });

  const onSubmit = (values: typeof initialValues) => {
  setErrorMsg("");
  Api.post("/auth/login", values)
  .then((response) => {
    if (response.data && response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user)); // <-- Guarda el usuario completo
      navigate("/admin");
    } else if (response.data && response.data.message) {
      setErrorMsg(response.data.message);
    }
  });
}
  return (
    <section>
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div>
                <h1 className="text-2xl font-semibold text-center">Inicio de Sesión</h1>
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
                }) => (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <InputLabel 
                      label="Correo"
                      name="email"
                      placeholder="example@gmail.com"
                      error={errors.email}
                      onChange={handleChange}
                      value={values.email}
                    />
                    <InputLabel 
                      label="Contraseña"
                      name="password"
                      placeholder="*********"
                      type="password"
                      error={errors.password}
                      onChange={handleChange}
                      value={values.password}
                    />
                    <Button
                      className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      value="Ingresar"
                      type="submit"
                    > Ingresar
                    </Button>
                    <p className="mt-6 text-center text-gray-600 space-y-3">No tienes una cuenta? 
                      <Link to="/register" className="text-blue-500 hover:underline">
                        Crear Cuenta
                      </Link>
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

export default Login