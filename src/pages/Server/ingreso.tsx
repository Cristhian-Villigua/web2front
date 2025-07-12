import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Api } from "../../services/Api";
import "../css/ingreso.css";

interface FormValues {
  email: string;
  password: string;
}

const SignInForm: React.FC = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  const initialValues: FormValues = {
    email: "",
    password: ""
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("El correo no es válido")
      .required("El correo es requerido"),
    password: Yup.string()
      .min(5, "Mínimo cinco caracteres.")
      .max(50, "Máximo 50 caracteres.")
      .required("La contraseña es requerida")
  });

  const onSubmit = async (values: FormValues) => {
    setErrorMsg("");

    console.log("Datos enviados al servidor:", values);

    try {
      const response = await Api.post("/auth/login", values);
      console.log("Respuesta completa del servidor:", response);

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/admin");
      } else if (response.data?.message) {
        setErrorMsg(response.data.message);
      }
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || "Ocurrió un error inesperado.");
    }
  };

  const formik = useFormik<FormValues>({
    initialValues,
    validationSchema,
    onSubmit
  });

return (
    <div className="ingreso form-container sign-in-container">
      <form onSubmit={formik.handleSubmit}>
        <h1>Sign in</h1>
        
        <input
          type="email"
          name="email"
          placeholder="Email"
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
          placeholder="Password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.password && formik.errors.password && (
          <div className="error">{formik.errors.password}</div>
        )}

        <a href="#">Forgot your password?</a>

        {errorMsg && <div className="error-message">{errorMsg}</div>}

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignInForm;
