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
    addToCart,
    decreaseFromCart,
    removeFromCart,
    clearCart,
    totalPrice,
  } = useContext(CartContext);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);

  const computadoras = cartItems.filter((item) => item.tipo === "computadora");
  const componentes = cartItems.filter((item) => item.tipo === "componente");
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handlePurchase = async () => {
    if (!user || !token) {
      toast.error("Debes iniciar sesión primero");
      return;
    }

    const detallesVenta = [];

    try {
      setLoading(true);

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

      for (const item of componentes) {
        detallesVenta.push({
          computadora: null,
          componente: item.id,
          cantidad: item.quantity,
          subtotal: item.price * item.quantity,
        });
      }

      const ventaData = {
        usuario: user.id,
        total: totalPrice,
        detalles_input: detallesVenta,
      };

      await api.post("ventas/", ventaData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      generatePDF(cartItems);
      toast.success("Compra realizada con éxito");
      clearCart();
    } catch (error) {
      console.error(error);
      toast.error("Error al registrar la venta.");
    } finally {
      setLoading(false);
    }
  };

  // helpers -----------------------------------------------------------------------------
  const toNumber = (val) => {
    if (val === undefined || val === null) return 0;
    if (typeof val === "number") return val;
    const cleaned = String(val).replace(/[^\d.-]/g, "");
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const getPrice = (obj) =>
    toNumber(
      obj.precio ??
        obj.price ??
        obj.precio_unitario ??
        obj.unitPrice ??
        obj.precioUnit ??
        0
    );


  // generatePDF -------------------------------------------------------------------------
  const generatePDF = (items) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString("es-MX");

    console.log("Estructura real que llega al PDF ⤵️", items);   // ← aquí sí existe


    doc.setFillColor(30, 30, 30);
    doc.rect(0, 0, 210, 297, "F");

    doc.setTextColor(255, 204, 0);
    doc.setFontSize(18);
    doc.text("Resumen de tu compra", 20, 20);
    doc.setFontSize(10);
    doc.setTextColor(200);
    doc.text(`Fecha: ${date}`, 20, 26);

    const body = [];

    items.forEach((item) => {
      if (item.tipo === "computadora") {
        body.push([
          {
            content: "PC Personalizada",
            styles: { fontStyle: "bold", textColor: [255, 255, 255] },
          },
          item.quantity,
          "",
        ]);

        let subtotalPc = 0;

        item.componentes.forEach((c) => {
          const unit = getPrice(c);
          const qty = c.cantidad || 1;
          const compTotal = unit * qty;
          subtotalPc += compTotal;

          body.push([
            {
              content: `  • ${c.nombre}`,
              styles: { textColor: [255, 255, 255] },
            },
            qty,
            `$${compTotal.toLocaleString("es-MX")}`,
          ]);
        });

        body.push([
          {
            content: "Subtotal PC",
            styles: { fontStyle: "bold", textColor: [255, 204, 0] },
          },
          "",
          `$${subtotalPc.toLocaleString("es-MX")}`,
        ]);

        body.push(["", "", ""]);
      } else {
        const unit = getPrice(item);
        const lineTotal = unit * item.quantity;
        body.push([
          {
            content: item.nombre ?? item.name,
            styles: { textColor: [255, 255, 255] },
          },
          item.quantity,
          `$${lineTotal.toLocaleString("es-MX")}`,
        ]);
      }
    });

    autoTable(doc, {
      startY: 35,
      head: [
        [
          { content: "Producto", styles: { textColor: 0 } },
          { content: "Cantidad", styles: { textColor: 0 } },
          { content: "Precio", styles: { textColor: 0 } },
        ],
      ],
      body,
      theme: "grid",
      styles: {
        fontSize: 10,
        textColor: [255, 255, 255],
        fillColor: [45, 45, 45],
        halign: "left",
        valign: "middle",
      },
      headStyles: {
        fillColor: [255, 204, 0],
        textColor: [0, 0, 0],
      },
      alternateRowStyles: {
        fillColor: [35, 35, 35],
      },
    });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text(
      `Total pagado: $${Number(totalPrice).toLocaleString("es-MX")}`,
      20,
      doc.lastAutoTable.finalY + 10
    );

    doc.save("Resumen-de-compra.pdf");
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
            <div key={i} className="bg-[#2d2d2d] p-4 rounded-lg shadow-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-yellow-400">
                  {item.nombre}
                </h2>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  Eliminar
                </button>
              </div>
              <p className="text-gray-400">
                Precio: ${item.precio.toLocaleString("es-MX")}
              </p>
              {item.componentes?.length > 0 && (
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
                    {item.name || item.nombre}
                  </h2>
                </Link>
                <p className="text-gray-400">Precio: ${item.price}</p>
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
                ${totalPrice.toLocaleString("es-MX")}
              </span>
            </h2>

            <button
              onClick={handlePurchase}
              disabled={loading}
              className="mt-4 bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400 transition"
            >
              {loading ? "Procesando..." : "Proceder al pago"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
