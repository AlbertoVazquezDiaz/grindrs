// src/pages/auth/ResetPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../API/axiosConfig";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const response = await api.post("reset-password/", { token, password,});

      if (response.statusText === "OK") {
        setMessage(response.data.message);
        setTimeout(() => navigate("/"), 2000);
      } else {
        setMessage(data.error || "Hubo un error.");
      }
    } catch (err) {
      setMessage("No se pudo conectar al servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
      exit={{ opacity: 0, y: -50, transition: { duration: 0.5 } }}
      className="page flex justify-center items-center min-h-screen px-4"
    >
      <div className="bg-black p-8 rounded-lg shadow-lg max-w-md w-full border border-yellow-400/50">
        <h2 className="text-white text-2xl font-bold text-center mb-4">
          Restablecer Contraseña
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            className="w-full p-2 mb-4 border-b bg-transparent text-white focus:outline-none focus:border-yellow-400"
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="w-full bg-yellow-400 text-black py-2 rounded-sm font-bold hover:bg-yellow-500 transition"
            type="submit"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Restablecer"}
          </button>
          {message && (
            <p className="text-yellow-300 mt-4 text-center">{message}</p>
          )}
        </form>
      </div>
    </motion.div>
  );
};

export default ResetPassword;
