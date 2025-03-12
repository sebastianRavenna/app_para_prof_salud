import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { createPatient } from "../services/api";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { FaEye, FaEyeSlash  } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "patient",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("El nombre es obligatorio"),
      email: Yup.string().email("Email inválido").required("El email es obligatorio"),
      phone: Yup.string().optional(),
      password: Yup.string()
        .min(6, "⚠️ Mínimo 6 caracteres. Al menos una mayúscula, una minuscula y un número")
        .matches(/[A-Z]/, "⚠️ Mínimo 6 caracteres. Al menos una mayúscula, una minuscula y un número")
        .matches(/[a-z]/, "⚠️ Mínimo 6 caracteres. Al menos una mayúscula, una minuscula y un número")
        .matches(/[0-9]/, "⚠️ Mínimo 6 caracteres. Al menos una mayúscula, una minuscula y un número")
        .required("La contraseña es obligatoria"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Las contraseñas deben coincidir")
        .required("Confirmar la contraseña es obligatorio"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await createPatient(values.name, values.email, values.password, values.role);
        toast("¡Registro exitoso! Valida tu Email", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          onClose: () => navigate(`/verifyAccount?email=${values.email}`),
        });
      } catch (err) {
        toast(err.response?.data?.msg || "Error en el registro", { position: "top-right" });
      }
      setSubmitting(false);
    },
  });

  return (
    <Layout>
      <ToastContainer />
      <section className="register-section">
        <div className="card register-card">
          <div className="card-content">
            <h2 className="title has-text-centered">Registro</h2>
            <form onSubmit={formik.handleSubmit}>
               {["name", "email", "phone"].map(field => (
                <div className="field" key={field}>
                  <label className="label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    className={`input ${formik.touched[field] && formik.errors[field] ? "is-danger" : ""}`}
                    type="text"
                    name={field}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values[field]}
                    placeholder={
                      field === 'email' ? "ejemplo@gmail.com" :
                      field === 'phone' ? "541155555555" : ""
                    }
                  />
                  {formik.touched[field] && formik.errors[field] && <p className="help is-danger">{formik.errors[field]}</p>}
                </div>
              ))}

              {["password", "confirmPassword"].map(field => (
                <div className="field" key={field}>
                <label className="label">{field === 'confirmPassword' ? 'Confirmar Contraseña' : 'Contraseña'}</label>
                <div className="control has-icons-right">
                  <input
                    className={`input ${formik.touched[field] && formik.errors[field] ? "is-danger" : ""}`}
                    type={field === "password" ? (showPassword ? "text" : "password") : (showConfirmPassword ? "text" : "password")}
                    name={field}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values[field]}
                    placeholder={field === "password" ? "Mínimo 6 caracteres" : ""}
                  />
                  <span 
                    className="icon is-right eyeRegister" 
                    onClick={field === "password" ? togglePasswordVisibility : toggleConfirmPasswordVisibility}
                  >
                    {field === "password" ? (showPassword ? <FaEyeSlash /> : <FaEye />) : (showConfirmPassword ? <FaEyeSlash /> : <FaEye />)}
                  </span>
                </div>
                {formik.touched[field] && formik.errors[field] && <p className="help is-danger">{formik.errors[field]}</p>}
              </div>
              ))}
              <button className="button is-primary is-fullwidth" type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? "Registrando..." : "Registrarse"}
              </button>
            </form>
            <div className="has-text-centered mt-4">
              <p className="has-text-grey">
                ¿Ya tenés cuenta?
                <a href="/login" className="has-text-primary has-text-weight-bold ml-1">
                  Iniciá sesión
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export { Register };
