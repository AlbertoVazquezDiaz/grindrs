import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ChevronRightIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import api from "../API/axiosConfig";
import Alert from "./Alerts";
import { toast } from "react-toastify";

const tieneScript = (txt) => /<\s*script/i.test(txt);

const RegisterForm = ({ switchToLogin }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const onSubmit = async (data) => {
    setAlert({ type: "", message: "" });
    try {
      await api.post("usuario/", {
        nombre: data.nombre.trim(),
        apellidos: data.apellidos.trim(),
        correo: data.correo.trim(),
        password: data.password,
        rol: 2,
      });
      toast.success("Ahora puedes iniciar sesión.");
      switchToLogin();
    } catch (error) {
      const mensajes = error.response?.data
        ? Object.values(error.response.data).flat().join(" ")
        : "Error desconocido.";
      setAlert({ type: "error", message: mensajes });
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-xs">
        <form className="rounded-2xl py-4 mb-4" onSubmit={handleSubmit(onSubmit)}>
          {alert.message && <Alert type={alert.type} message={alert.message} />}

          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">Nombre</label>
            <input
              {...register("nombre", {
                required: "El nombre es obligatorio",
                minLength: { value: 2, message: "Mínimo 2 caracteres" },
                maxLength: { value: 50, message: "Máximo 50 caracteres" },
                validate: (v) => (!tieneScript(v) ? true : "Entrada no permitida"),
              })}
              className={`mt-1 block w-full border-b text-white sm:text-sm p-2 focus:ring-0 focus:outline-none ${
                errors.nombre ? "border-red-300" : "focus:border-b-yellow-400 hover:border-b-yellow-400"
              }`}
              placeholder="Nombre(s)"
            />
            {errors.nombre && <p className="text-red-300 text-sm mt-1">{errors.nombre.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">Apellidos</label>
            <input
              {...register("apellidos", {
                required: "Los apellidos son obligatorios",
                minLength: { value: 2, message: "Mínimo 2 caracteres" },
                maxLength: { value: 50, message: "Máximo 50 caracteres" },
                validate: (v) => (!tieneScript(v) ? true : "Entrada no permitida"),
              })}
              className={`mt-1 block w-full border-b text-white sm:text-sm p-2 focus:ring-0 focus:outline-none ${
                errors.apellidos ? "border-red-300" : "focus:border-b-yellow-400 hover:border-b-yellow-400"
              }`}
              placeholder="Apellidos"
            />
            {errors.apellidos && <p className="text-red-300 text-sm mt-1">{errors.apellidos.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">Correo electrónico</label>
            <input
              {...register("correo", {
                required: "El correo es obligatorio",
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i,
                  message: "Formato de correo inválido",
                },
                validate: (v) => (!tieneScript(v) ? true : "Entrada no permitida"),
              })}
              className={`mt-1 block w-full border-b text-white sm:text-sm p-2 focus:ring-0 focus:outline-none ${
                errors.correo ? "border-red-300" : "focus:border-b-yellow-400 hover:border-b-yellow-400"
              }`}
              placeholder="Correo electrónico"
            />
            {errors.correo && <p className="text-red-300 text-sm mt-1">{errors.correo.message}</p>}
          </div>

          <div className="mb-6 relative">
            <label className="block text-white text-sm font-bold mb-2">Contraseña</label>
            <input
              {...register("password", {
                required: "La contraseña es obligatoria",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
                validate: (v) => (!tieneScript(v) ? true : "Entrada no permitida"),
              })}
              type={showPassword ? "text" : "password"}
              className={`mt-1 block w-full border-b text-white sm:text-sm p-2 pr-10 focus:ring-0 focus:outline-none ${
                errors.password ? "border-red-300" : "focus:border-b-yellow-400 hover:border-b-yellow-400"
              }`}
              placeholder="Contraseña"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-[38px] text-gray-300"
            >
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
            {errors.password && <p className="text-red-300 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div className="mb-6 relative">
            <label className="block text-white text-sm font-bold mb-2">Confirmar contraseña</label>
            <input
              {...register("confirmPassword", {
                required: "Confirma tu contraseña",
                validate: (v) =>
                  v === watch("password") || "Las contraseñas no coinciden",
              })}
              type={showConfirm ? "text" : "password"}
              className={`mt-1 block w-full border-b text-white sm:text-sm p-2 pr-10 focus:ring-0 focus:outline-none ${
                errors.confirmPassword ? "border-red-300" : "focus:border-b-yellow-400 hover:border-b-yellow-400"
              }`}
              placeholder="Confirmar contraseña"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-2 top-[38px] text-gray-300"
            >
              {showConfirm ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-300 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
            {!errors.confirmPassword && watch("confirmPassword") && watch("password") && (
              <p
                className={`text-sm mt-1 ${
                  watch("password") === watch("confirmPassword") ? "text-yellow-400" : "text-red-300"
                }`}
              >
                {watch("password") === watch("confirmPassword")
                  ? "Las contraseñas coinciden"
                  : "Las contraseñas no coinciden"}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center bg-[#ffbb00] text-black text-sm py-4 font-bold px-4 rounded-sm hover:text-black/80 transition cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-4 border-black border-t-transparent" />
            ) : (
              <>
                REGISTRARME
                <ChevronRightIcon className="w-4 h-4 ml-2 self-center" />
              </>
            )}
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
