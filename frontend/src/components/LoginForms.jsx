import React from "react";

const LoginForms = ({ switchToRegister }) => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-xs">
        <form className="rounded-2xl py-4 mb-4">
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
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-white text-sm mb-2"
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
          <button className="w-full bg-[#ffbb00] text-black text-sm py-3 font-bold px-4 rounded-sm hover:text-black/80 transition cursor-pointer">
            INICIAR SESIÓN
          </button>

          <div className="flex flex-col mt-8">
            <p className="text-center text-sm text-gray-400">
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
