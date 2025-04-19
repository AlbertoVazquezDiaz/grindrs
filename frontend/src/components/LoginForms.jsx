import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../API/axiosConfig";
import Alert from "./Alerts.jsx";
import { toast } from "react-toastify";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const LoginForms = ({ switchToRegister, switchToForgot, closeModal }) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ correo, password }) => {
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("login/", { correo, password });
      toast.success("Bienvenido");

      const { access, refresh, correo: userCorreo, rol, id } = response.data;

      localStorage.setItem("user", JSON.stringify({id: id, correo: userCorreo, rol }));
      localStorage.setItem("token", access);
      localStorage.setItem("refresh_token", refresh);

      window.dispatchEvent(new Event("authChange"));

      if (closeModal) {
        closeModal();
      }
      rol.nmRol === "admin" ? navigate("/admin/dashboard") : navigate("/");
    } catch (err) {
      console.error(
        "Error al iniciar sesión:",
        err.response?.data || err.message
      );
      const errorMessage =
        err.response?.data?.detail ||
        "Credenciales incorrectas. Inténtelo de nuevo.";
      setError(errorMessage);
      setTimeout(() => {
        setError("");
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-xs">
        <form
          className="rounded-2xl py-4 mb-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-4">
            <label className="block text-white text-sm font-regular mb-2">
              Correo electrónico
            </label>
            <input
              className={`mt-1 block w-full border-b text-white sm:text-sm p-2 bg-transparent focus:ring-0 focus:outline-none ${
                errors.correo
                  ? "border-red-300"
                  : "focus:border-b-yellow-400 hover:border-b-yellow-400"
              }`}
              type="email"
              placeholder="Correo electrónico"
              {...register("correo", {
                required: "El correo es obligatorio.",
              })}
            />
            {errors.correo && (
              <p className="text-red-300 text-xs mt-1">
                {errors.correo.message}
              </p>
            )}
          </div>

          <div className="mb-6 relative">
            <label className="block text-white text-sm mb-2">Contraseña</label>
            <input
              className={`mt-1 block w-full border-b text-white sm:text-sm p-2 bg-transparent pr-10 focus:ring-0 focus:outline-none ${
                errors.password
                  ? "border-red-300"
                  : "focus:border-b-yellow-400 hover:border-b-yellow-400"
              }`}
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              {...register("password", {
                required: "La contraseña es obligatoria.",
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-9 right-2 text-gray-400 hover:text-yellow-400"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
            {errors.password && (
              <p className="text-red-300 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {error && <Alert type="error" message={error} />}

          <button
            type="submit"
            className="w-full bg-[#ffbb00] text-black text-sm py-3 font-bold px-4 rounded-sm hover:text-black/80 transition cursor-pointer flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent" />
            ) : (
              "INICIAR SESIÓN"
            )}
          </button>

          <div className="flex flex-col mt-8">
            <p className="text-center text-sm text-gray-300">
              ¿No tienes una cuenta?{" "}
              <button
                className="text-yellow-400 hover:text-yellow-500 cursor-pointer"
                onClick={switchToRegister}
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
              <button
                className="text-yellow-400 hover:text-yellow-500"
                type="button"
                onClick={switchToForgot}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForms;
