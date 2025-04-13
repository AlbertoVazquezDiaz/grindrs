import React, { useState, useEffect } from "react";
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

const initialNavigation = [
  { name: "Inicio", href: "/", current: true },
  { name: "Configurador", href: "/builder", current: false },
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
                    <Menu.Button className="flex items-center text-gray-300 hover:text-yellow-400 p-2 rounded-md cursor-pointer">
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
                              } w-full text-left px-4 py-2 text-sm cursor-pointer`}
                              onClick={() => navigate("/MyOrders")}
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
                              } w-full text-left px-4 py-2 text-sm cursor-pointer`}
                              onClick={() => {
                                localStorage.clear();
                                setIsAuthenticated(false);
                                window.dispatchEvent(new Event("authChange"));
                                navigate("/");
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

                <button className="text-gray-300 hover:text-yellow-400 rounded-md px-3 py-2 text-sm font-medium cursor-pointer">
                  <ShoppingBagIcon className="h-5 w-5" aria-hidden="true" />
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
