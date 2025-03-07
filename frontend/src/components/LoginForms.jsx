import React from "react";

const LoginForms = ({ switchToRegister }) => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-xs">
        <form className="rounded-2xl py-4 mb-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Correo electrónico
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Correo electrónico"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Contraseña
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Contraseña"
            />
          </div>
          <button className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition">
            Iniciar sesión
          </button>

          <div className="flex flex-col mt-8">
            <p className="text-center text-sm">
              ¿No tienes una cuenta?{" "}
              <button
                className="text-blue-500 hover:text-blue-800 cursor-pointer"
                onClick={switchToRegister} // 🔹 Cambia a Registro sin cerrar el modal
              >
                Regístrate
              </button>
            </p>
            <div className="flex items-center justify-center mt-4">
              <hr className="w-1/4" />
              <p className="mx-4 text-sm text-gray-500">O</p>
              <hr className="w-1/4" />
            </div>
            <p className="text-center text-sm mt-8">
              <a
                className="text-blue-500 hover:text-blue-800"
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
