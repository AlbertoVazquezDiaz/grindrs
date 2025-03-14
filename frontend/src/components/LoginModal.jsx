import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import LoginForms from "./LoginForms";
import RegisterForm from "./RegisterForm";

const LoginModal = ({ isOpen, closeModal, isRegister }) => {
  const [currentView, setCurrentView] = useState("login");

  // 🔹 Sincroniza el estado del modal cuando se abre
  useEffect(() => {
    setCurrentView(isRegister ? "register" : "login");
  }, [isOpen, isRegister]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <div className="fixed inset-0 bg-black/70" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-black border-1 border-yellow-400/50 rounded-lg shadow-lg p-6">
            <Dialog.Title className="text-xl text-center py-4 font-semibold text-white">
              {currentView === "register" ? "Regístrate" : "Iniciar sesión"}
            </Dialog.Title>

            {/* 🔹 Muestra el formulario correcto */}
            {currentView === "register" ? (
              <RegisterForm switchToLogin={() => setCurrentView("login")} />
            ) : (
              <LoginForms switchToRegister={() => setCurrentView("register")} />
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default LoginModal;
