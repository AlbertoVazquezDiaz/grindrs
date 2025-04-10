import { ChevronRightIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import api from "../API/axiosConfig";
import Alert from "./Alerts";
import { Navigate } from "react-router-dom";

const RegisterForm = ({ switchToLogin }) => {
  const [data, setData] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    password: "",
    rol: 2,
  });
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });

    if (data.password !== confirmPassword) {
      setAlert({ type: "error", message: "Las contraseñas no coinciden." });
      return;
    }

    try {
      const response = await api.post("usuario/", data);
      console.log("Registro exitoso", response.data);

      setAlert({
        type: "success",
        message: "Registro exitoso, ahora puedes iniciar sesión.",
      });

      setData({
        nombre: "",
        apellidos: "",
        correo: "",
        password: "",
        rol: 2,
      });
      setConfirmPassword("");
      setAlert({ type: "success", message: "Registro Exitoso" });
      //Navigate("/");
    } catch (error) {
      if (error.response && error.response.data) {
        const errores = error.response.data;
        const mensajes = Object.values(errores).flat().join(" ");
        setAlert({ type: "error", message: mensajes });
      } else {
        setAlert({ type: "error", message: "Error desconocido." });
      }
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-xs">
        <form className="rounded-2xl py-4 mb-4" onSubmit={handleSubmit}>
          {alert.message && <Alert type={alert.type} message={alert.message} />}

          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">
              Nombre
            </label>
            <input
              className="mt-1 block w-full border-b shadow-sm text-white sm:text-sm p-2 focus:ring-0 focus:outline-none focus:border-b-yellow-400 hover:border-b-yellow-400"
              type="text"
              placeholder="Nombre(s)"
              value={data.nombre}
              onChange={(e) => setData({ ...data, nombre: e.target.value })}
              
            />
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">
              Apellidos
            </label>
            <input
              className="mt-1 block w-full border-b shadow-sm text-white sm:text-sm p-2 focus:ring-0 focus:outline-none focus:border-b-yellow-400 hover:border-b-yellow-400"
              type="text"
              placeholder="Apellido"
              value={data.apellidos}
              onChange={(e) => setData({ ...data, apellidos: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">
              Correo electrónico
            </label>
            <input
              className="mt-1 block w-full border-b shadow-sm text-white sm:text-sm p-2 focus:ring-0 focus:outline-none focus:border-b-yellow-400 hover:border-b-yellow-400"
              type="email"
              placeholder="Correo electrónico"
              value={data.correo}
              onChange={(e) => setData({ ...data, correo: e.target.value })}
            />
          </div>

          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2">
              Contraseña
            </label>
            <input
              className="mt-1 block w-full border-b shadow-sm text-white sm:text-sm p-2 focus:ring-0 focus:outline-none focus:border-b-yellow-400 hover:border-b-yellow-400"
              type="password"
              placeholder="Contraseña"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
          </div>

          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2">
              Confirmar contraseña
            </label>
            <input
              className="mt-1 block w-full border-b shadow-sm text-white sm:text-sm p-2 focus:ring-0 focus:outline-none focus:border-b-yellow-400 hover:border-b-yellow-400"
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button className="w-full flex items-center justify-center bg-[#ffbb00] text-black text-sm py-4 font-bold px-4 rounded-sm hover:text-black/80 transition cursor-pointer">
            REGISTRARME
            <ChevronRightIcon className="w-4 h-4 ml-2 self-center" />
          </button>

          <div className="flex flex-col mt-8">
            <p className="text-center text-sm text-gray-300">
              ¿Ya tienes una cuenta?{" "}
              <button
                className="text-yellow-400 hover:text-yellow-500 cursor-pointer"
                onClick={switchToLogin}
              >
                Inicia sesión
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
