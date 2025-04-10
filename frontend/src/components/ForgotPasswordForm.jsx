import React, { useState } from "react";
import api from "../API/axiosConfig";
import Alert from "./Alerts";

const ForgotPasswordForm = ({ switchToLogin }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null); // { type, message }

  const showAlert = (type, message, duration = 3000) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), duration);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null); // Reset alert on new submission

    try {
      const response = await api.post("send-code/", { email });
      if(setEmail === "" ) {
        showAlert("error", "El correo electrónico no es válido.");
        return;
      }
      if (response.status === 200) {
        showAlert("success", response.data.message || "Correo enviado correctamente.");
        setEmail("");
      } else {
        showAlert("error", "No pudimos enviar el correo.");
      }
    } catch (err) {
      console.error("Error al enviar el correo:", err);
      showAlert("error", "No encontramos una cuenta con este correo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p className="text-sm text-gray-300 mb-4 text-center">
        Ingresa el correo electrónico de tu cuenta
      </p>

      {alert && <Alert type={alert.type} message={alert.message} />}

      <input
        className="w-full p-2 mb-4 border-b text-white bg-transparent focus:outline-none focus:border-yellow-400"
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-yellow-400 text-black py-2 rounded-sm font-bold hover:bg-yellow-500 transition hover:cursor-pointer flex items-center justify-center gap-2"
      >
        {loading && (
          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        )}
        {loading ? "Enviando..." : "Enviar"}
      </button>

      <p className="mt-6 text-center text-sm text-gray-300">
        <button
          className="text-yellow-400 hover:text-yellow-500"
          type="button"
          onClick={switchToLogin}
        >
          Volver al inicio de sesión
        </button>
      </p>
    </form>
  );
};

export default ForgotPasswordForm;
