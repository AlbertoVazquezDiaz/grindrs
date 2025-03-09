import { ChevronRightIcon } from "@heroicons/react/24/outline";
import React from "react";

const RegisterForm = ({ switchToLogin }) => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-xs">
        <form className="rounded-2xl py-4 mb-4">
          <div className="mb-4">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="username"
            >
              Nombre
            </label>
            <input
              className="mt-1 block w-full border-b  shadow-sm  text-white sm:text-sm p-2 focus:ring-0 focus:outline-none focus:border-b-yellow-400 hover:border-b-yellow-400"
              id="username"
              type="text"
              placeholder="Nombre(s)"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="username"
            >
              Apellidos
            </label>
            <input
              className="mt-1 block w-full border-b  shadow-sm  text-white sm:text-sm p-2 focus:ring-0 focus:outline-none focus:border-b-yellow-400 hover:border-b-yellow-400"
              id="username"
              type="text"
              placeholder="Apellido"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="email"
            >
              Correo electrónico
            </label>
            <input
              className="mt-1 block w-full border-b  shadow-sm  text-white sm:text-sm p-2 focus:ring-0 focus:outline-none focus:border-b-yellow-400 hover:border-b-yellow-400"
              id="email"
              type="email"
              placeholder="Correo electrónico"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="password"
            >
              Contraseña
            </label>
            <input
              className="mt-1 block w-full border-b  shadow-sm  text-white sm:text-sm p-2 focus:ring-0 focus:outline-none focus:border-b-yellow-400 hover:border-b-yellow-400"
              id="password"
              type="password"
              placeholder="Contraseña"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="password"
            >
              Confirmar contraseña
            </label>
            <input
              className="mt-1 block w-full border-b  shadow-sm  text-white sm:text-sm p-2 focus:ring-0 focus:outline-none focus:border-b-yellow-400 hover:border-b-yellow-400"
              id="password"
              type="password"
              placeholder="Confirmar contraseña"
            />
          </div>
          <button className="w-full flex items-center justify-center bg-[#ffbb00] text-black text-sm py-4 font-bold px-4 rounded-sm hover:text-black/80 transition cursor-pointer">
            REGISTRARME
            <ChevronRightIcon className="w-4 h-4 ml-2 self-center" />
          </button>

          <div className="flex flex-col mt-8">
            <p className="text-center text-sm text-gray-500">
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
