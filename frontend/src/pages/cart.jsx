import React, { useContext, useState } from "react";
import { CartContext } from "../contexts/contexts";
import { Link } from "react-router-dom";
import api from "../API/axiosConfig";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const CartPage = () => {
  const {
    cartItems,
    clearCart,
    totalPrice,
    decreaseFromCart,
    addToCart,
    removeFromCart,
  } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const componentes = cartItems.filter((item) => item.tipo === "componente");
  const computadoras = cartItems.filter((item) => item.tipo === "computadora");
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const generatePDF = (items) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(255, 204, 0);
    doc.text("Resumen de tu compra", 20, 20);

    const body = items.map((item) => [
      item.tipo === "computadora"
        ? "PC Personalizada"
        : item.nombre || item.name,
      item.quantity,
      `$${Number(item.price || item.precio).toLocaleString("es-MX")}`,
    ]);

    autoTable(doc, {
      startY: 30,
      head: [["Producto", "Cantidad", "Precio"]],
      body,
      theme: "striped",
      styles: {
        fontSize: 10,
        textColor: 20,
      },
      headStyles: {
        fillColor: [255, 204, 0],
        textColor: 0,
      },
    });

    doc.setFontSize(12);
    doc.text(
      `Total pagado: $${Number(totalPrice).toLocaleString("es-MX")}`,
      20,
      doc.lastAutoTable.finalY + 10
    );

    doc.save("Resumen-de-compra.pdf");
  };

  const handlePDFCheckout = async () => {
    if (!token || !user) {
      toast.error("Debes iniciar sesión para generar el PDF.");
      return;
    }

    try {
      setLoading(true);
      const detallesVenta = [];

      for (const compu of computadoras) {
        const compuData = {
          nombre: compu.nombre,
          descripcion: compu.descripcion || "PC personalizada",
          usuario: user.id,
          detalles: compu.componentes.map((c) => ({
            componente: c.id,
            cantidad: c.cantidad || 1,
          })),
        };

        const response = await api.post("computadoras/", compuData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        detallesVenta.push({
          computadora: response.data.computadora_id,
          componente: null,
          cantidad: compu.quantity,
          subtotal: compu.precio * compu.quantity,
        });
      }

      const ventaData = {
        usuario: user.id,
        total: totalPrice,
        detalles: detallesVenta,
      };

      await api.post("ventas/", ventaData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Venta registrada con éxito");
      clearCart();
      generatePDF(cartItems);
    } catch (error) {
      toast.error("Error al registrar la venta.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1e1e1e] min-h-screen text-white px-6 py-10">
      <h1 className="text-4xl font-bold text-center text-yellow-400 mb-8">
        Carrito de compras
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-300 text-center text-2xl">
          Tu carrito está vacío.
        </p>
      ) : (
        <div className="grid gap-6">
          {computadoras.map((item, i) => (
            <div
              key={`compu-${i}`}
              className="bg-[#2d2d2d] p-4 rounded-lg shadow-lg relative"
            >
              <button
                onClick={() => removeFromCart(item.id)}
                className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                title="Eliminar del carrito"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <h2 className="text-xl font-semibold text-yellow-400">
                {item.nombre}
              </h2>
              <p className="text-gray-400">
                Precio: $
                {item.precio.toLocaleString("es-MX", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>

              {item.componentes?.length > 0 ? (
                <>
                  <p className="text-gray-300 font-bold mt-2">Componentes:</p>
                  <ul className="text-gray-400 text-sm list-disc list-inside">
                    {item.componentes.map((c, index) => (
                      <li key={index}>
                        {c.nombre} x{c.cantidad}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-gray-500 text-sm italic">
                  Sin componentes definidos
                </p>
              )}
            </div>
          ))}

          {componentes.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row bg-[#2d2d2d] p-4 rounded-lg shadow-lg gap-4"
            >
              <Link to={`/ProductView/${item.id}`} className="w-full md:w-48">
                <img
                  src={
                    item.image?.startsWith("data:image")
                      ? item.image
                      : `data:image/jpeg;base64,${item.image}`
                  }
                  alt={item.name}
                  className="w-full h-40 object-cover rounded"
                />
              </Link>
              <div className="flex flex-col justify-between flex-grow">
                <Link to={`/ProductView/${item.id}`}>
                  <h2 className="text-xl font-semibold text-yellow-400">
                    {item.name}
                  </h2>
                </Link>
                <p className="text-gray-400">
                  Precio: $
                  {item.price.toLocaleString("es-MX", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => decreaseFromCart(item.id)}
                    className="bg-red-400 text-white px-2 rounded hover:bg-red-500"
                  >
                    -
                  </button>
                  <span className="text-white">{item.quantity}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-green-400 text-white px-2 rounded hover:bg-green-500"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-10 border-t border-gray-600 pt-6 text-right">
            <h2 className="text-2xl font-semibold">
              Total de artículos:{" "}
              <span className="text-yellow-400">{totalQuantity}</span>
            </h2>
            <h2 className="text-2xl font-semibold mt-2">
              Total a pagar:{" "}
              <span className="text-yellow-400">
                $
                {totalPrice.toLocaleString("es-MX", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </h2>

            {computadoras.length > 0 ? (
              <button
                onClick={handlePDFCheckout}
                disabled={loading}
                className="mt-4 bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400 transition"
              >
                {loading ? "Generando PDF..." : "Proceder al pago"}
              </button>
            ) : (
              <p className="text-gray-400 mt-4">
                No se puede generar PDF sin computadoras armadas.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
