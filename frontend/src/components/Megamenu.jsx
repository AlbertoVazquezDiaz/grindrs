import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingBagIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import LoginModal from "./LoginModal";
import { CartContext } from "../contexts/contexts";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";

const initialNavigation = [
  { name: "Inicio", href: "/", current: true },
  { name: "Builder", href: "/builder", current: false },
  { name: "Contáctanos", href: "/contact", current: false },
  { name: "Registrarme", action: "openRegisterModal", current: false },
  { name: "Iniciar sesión", action: "openLoginModal", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Megamenu = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [navigation, setNavigation] = useState(initialNavigation);
  const { isAuthenticated, setIsAuthenticated, cartItems, setCartItems } =
    useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const updatedNavigation = initialNavigation.map((item) => ({
      ...item,
      current: item.href === location.pathname,
    }));
    setNavigation(updatedNavigation);
  }, [location]);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    checkAuth();
    window.addEventListener("authChange", checkAuth);
    return () => window.removeEventListener("authChange", checkAuth);
  }, [location.pathname]);

  return (
    <>
      <Disclosure as="nav" className="bg-black">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
                <Bars3Icon
                  aria-hidden="true"
                  className="block size-6 group-data-open:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden size-6 group-data-open:block"
                />
              </DisclosureButton>
            </div>

            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                <img
                  alt="Grindrs logo"
                  src="/grindr.svg"
                  className="h-10 w-auto"
                />
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {navigation.slice(0, 3).map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "text-yellow-400"
                          : "text-gray-300 hover:text-yellow-400",
                        "rounded-md px-3 py-2 text-sm font-medium"
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden sm:ml-6 sm:block ml-auto">
              <div className="flex items-center space-x-4">
                {!isAuthenticated ? (
                  navigation.slice(3).map((item) =>
                    item.action === "openLoginModal" ? (
                      <button
                        key={item.name}
                        onClick={() => {
                          setIsRegisterMode(false);
                          setIsModalOpen(true);
                        }}
                        className="text-gray-300 hover:text-yellow-400 rounded-md px-3 py-2 text-sm font-medium cursor-pointer"
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
                        className="text-gray-300 hover:text-yellow-400 rounded-md px-3 py-2 text-sm font-medium cursor-pointer"
                      >
                        {item.name}
                      </button>
                    ) : null
                  )
                ) : (
                  <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center text-gray-300 hover:text-yellow-400 p-2 rounded-md">
                      <UserIcon className="h-5 w-5" />
                    </Menu.Button>
                    <Menu.Items className="absolute right-0 mt-2 w-48 bg-[#1e1e1e] border border-gray-700 rounded-md shadow-lg z-50">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active
                                  ? "bg-gray-700 text-yellow-400"
                                  : "text-gray-300"
                              } w-full text-left px-4 py-2 text-sm`}
                              onClick={() => navigate("/my-orders")}
                            >
                              Mis pedidos
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active
                                  ? "bg-gray-700 text-red-400"
                                  : "text-red-300"
                              } w-full text-left px-4 py-2 text-sm`}
                              onClick={() => {
                                confirmAlert({
                                  customUI: ({ onClose }) => (
                                    <div className="bg-gray-800 p-6 rounded shadow-lg text-center w-full max-w-md mx-auto">
                                      <h2 className="text-lg font-bold mb-3 text-yellow-400">
                                        ¿Cerrar sesión?
                                      </h2>
                                      <p className="text-sm text-gray-200 mb-6">
                                        Se cerrará tu sesión actual. ¿Deseas
                                        continuar?
                                      </p>
                                      <div className="flex justify-center gap-4">
                                        <button
                                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                          onClick={() => {
                                            localStorage.clear();
                                            setCartItems([]);
                                            setIsAuthenticated(false);
                                            window.dispatchEvent(
                                              new Event("authChange")
                                            );
                                            navigate("/");
                                            toast.success(
                                              "Saliste de tu cuenta."
                                            );
                                            onClose();
                                          }}
                                        >
                                          Sí, cerrar sesión
                                        </button>
                                        <button
                                          className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded text-gray-800"
                                          onClick={onClose}
                                        >
                                          Cancelar
                                        </button>
                                      </div>
                                    </div>
                                  ),
                                });
                              }}
                            >
                              Cerrar sesión
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Menu>
                )}

                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      setIsRegisterMode(false);
                      setIsModalOpen(true);
                    } else {
                      navigate("/cart");
                    }
                  }}
                  className="text-gray-300 hover:text-yellow-400 rounded-md px-3 py-2 text-sm font-medium cursor-pointer"
                >
                  <ShoppingBagIcon className="h-5 w-5" aria-hidden="true" />
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0) >
                    0 && (
                    <span className="absolute mt-3 -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full px-1.5 py-0.5">
                      {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {navigation.map((item) =>
              item.action === "openLoginModal" && !isAuthenticated ? (
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
              ) : item.action === "openRegisterModal" && !isAuthenticated ? (
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

      <LoginModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        isRegister={isRegisterMode}
      />
    </>
  );
};

export default Megamenu;
