import React, { useState } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import LoginModal from "./LoginModal"; // Importa el modal de login

const navigation = [
  { name: "Inicio", href: "/", current: true },
  { name: "Builder", href: "#", current: false },
  { name: "Contáctanos", href: "#", current: false },
  { name: "Registro", action: "openRegisterModal", current: false }, // Ahora abre el modal en modo Registro
  { name: "Iniciar sesión", action: "openLoginModal", current: false }, // Sigue abriendo el modal en modo Login
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Megamenu = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false); // Nuevo estado para alternar entre Login y Registro

  return (
    <>
      <Disclosure as="nav" className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            {/* Botón del menú móvil */}
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
                <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
              </DisclosureButton>
            </div>

            {/* Logo y enlaces */}
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                <img
                  alt="Grindrs logo"
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                  className="h-8 w-auto"
                />
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {navigation.map((item) =>
                    item.action === "openLoginModal" ? (
                      <button
                        key={item.name}
                        onClick={() => {
                          setIsRegisterMode(false);
                          setIsModalOpen(true);
                        }}
                        className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                      >
                        {item.name}
                      </button>
                    ) : item.action === "openRegisterModal" ? (
                      <button
                        key={item.name}
                        onClick={() => {
                          setIsRegisterMode(true);
                          setIsModalOpen(true);
                        }}
                        className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                      >
                        {item.name}
                      </button>
                    ) : (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                      >
                        {item.name}
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {navigation.map((item) =>
              item.action === "openLoginModal" ? (
                <button
                  key={item.name}
                  onClick={() => {
                    setIsRegisterMode(false);
                    setIsModalOpen(true);
                  }}
                  className="block text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium w-full text-left"
                >
                  {item.name}
                </button>
              ) : item.action === "openRegisterModal" ? (
                <button
                  key={item.name}
                  onClick={() => {
                    setIsRegisterMode(true);
                    setIsModalOpen(true);
                  }}
                  className="block text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium w-full text-left"
                >
                  {item.name}
                </button>
              ) : (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                >
                  {item.name}
                </DisclosureButton>
              )
            )}
          </div>
        </DisclosurePanel>
      </Disclosure>

      {/* Modal de Login/Registro */}
      <LoginModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        isRegister={isRegisterMode}
      />
    </>
  );
};

export default Megamenu;
