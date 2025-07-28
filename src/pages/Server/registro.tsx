import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Api } from "../../services/Api";
import "../css/ingreso.css";

interface FormValues {
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  const initialValues: FormValues = {
    nombres: "",
    apellidos: "",
    email: "",
    password: "",
    password_confirmation: ""
  };

  const validationSchema = Yup.object({
    nombres: Yup.string()
      .min(3, "El nombre debe tener mínimo tres letras.")
      .required("El nombre es requerido"),
    apellidos: Yup.string()
      .min(3, "Los apellidos debe tener mínimo tres letras.")
      .required("Los apellidos son requeridos"),
    email: Yup.string()
      .email("El correo no es válido")
      .required("El correo es requerido"),
    password: Yup.string()
      .min(5, "Mínimo cinco caracteres.")
      .max(50, "Máximo 50 caracteres.")
      .required("La contraseña es requerida"),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
      .required("La confirmación de la contraseña es requerida")
  });

  const onSubmit = async (values: FormValues) => {
    setErrorMsg("");

    try {
      const response = await Api.post("/auth/register", values);

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/");
      } else if (response.data?.message) {
        setErrorMsg(response.data.message);
      }
    } catch (error) {
      setErrorMsg("Error en el registro");
    }
  };

  const formik = useFormik<FormValues>({
    initialValues,
    validationSchema,
    onSubmit
  });

return (
    <div className="ingreso form-container sign-up-container">
      <form onSubmit={formik.handleSubmit}>
        <h1>   Crear cuenta    </h1>
        
        <input
          type="text"
          name="nombres"
          placeholder="Nombre"
          value={formik.values.nombres}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.nombres && formik.errors.nombres && (
          <div className="error">{formik.errors.nombres}</div>
        )}

        <input
          type="text"
          name="apellidos"
          placeholder="Apellidos"
          value={formik.values.apellidos  }
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.apellidos && formik.errors.apellidos && (
          <div className="error">{formik.errors.apellidos}</div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Coreo Electronico"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.email && formik.errors.email && (
          <div className="error">{formik.errors.email}</div>
        )}

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.password && formik.errors.password && (
          <div className="error">{formik.errors.password}</div>
        )}

        <input
          type="password"
          name="password_confirmation"
          placeholder="Confirmar contraseña"
          value={formik.values.password_confirmation}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.password_confirmation && formik.errors.password_confirmation && (
          <div className="error">{formik.errors.password_confirmation}</div>
        )}

        {errorMsg && <div className="error-message">{errorMsg}</div>}

        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default SignUpForm;
