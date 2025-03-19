import React, { useState } from "react";
import api from "../API/axiosConfig";

const LoginForms = ({ switchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // 🔹 Lógica de inicio de sesión
      console.log(email, password)
      const response = await api.post("login/", {
         email, password 
      });
      console.log("Inicio de sesión exitoso", response.data);
    }
    catch (error) {
      console.error("Error al iniciar sesión", error.response.data);
      setError(error.response ? error.response.data.message : error.message);
    }
  }


  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-xs">
        <form className="rounded-2xl py-4 mb-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-white text-sm font-regular mb-2"
              htmlFor="email"
            >
              Correo electrónico
            </label>
            <input
              className="mt-1 block w-full border-b  shadow-sm  text-white sm:text-sm p-2 focus:ring-0 focus:outline-none focus:border-b-yellow-400 hover:border-b-yellow-400"
              id="email"
              type="email"
              placeholder="Correo electrónico"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              className="mt-1 block w-full border-b  shadow-sm  text-white sm:text-sm p-2 focus:ring-0 focus:outline-none focus:border-b-yellow-400 hover:border-b-yellow-400"
              id="password"
              type="password"
              placeholder="Contraseña"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
          )}
          <button className="w-full bg-[#ffbb00] text-black text-sm py-3 font-bold px-4 rounded-sm hover:text-black/80 transition cursor-pointer">
            INICIAR SESIÓN
          </button>

          <div className="flex flex-col mt-8">
            <p className="text-center text-sm text-gray-300">
              ¿No tienes una cuenta?{" "}
              <button
                className="text-yellow-400 hover:text-yellow-500 cursor-pointer"
                onClick={switchToRegister} // 🔹 Cambia a Registro sin cerrar el modal
              >
                Regístrate
              </button>
            </p>
            <div className="flex items-center justify-center mt-4">
              <hr className="w-1/4 text-white" />
              <p className="mx-4 text-sm text-gray-500">O</p>
              <hr className="w-1/4 text-white" />
            </div>
            <p className="text-center text-sm mt-8">
              <a
                className="text-yellow-400 hover:text-yellow-500"
                href="/auth/forgot-password"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForms;
