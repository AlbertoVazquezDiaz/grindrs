import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "react-confirm-alert/src/react-confirm-alert.css";
import { BuilderProvider } from "./context/BuilderContext";
import { CartProvider } from "./contexts/contexts";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BuilderProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BuilderProvider>
  </StrictMode>
);
