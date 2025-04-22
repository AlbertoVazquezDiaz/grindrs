import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useContext } from "react";
import { CartContext } from "../contexts/contexts";
import api from "../API/axiosConfig";
import { toast } from "react-toastify";

const Resume = () => {
  const { cartItems, clearCart, totalPrice } = useContext(CartContext);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleDownloadPDF = async () => {
    if (!token || !user) {
      toast.error("Debes iniciar sesión para generar el PDF.");
      return;
    }

    const computadoras = cartItems.filter((item) => item.tipo === "computadora");
    const componentes = cartItems.filter((item) => item.tipo === "componente");

    const detallesVenta = [];

    try {
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

      detallesVenta.push(
        ...componentes.map((c) => ({
          componente: c.id,
          computadora: null,
          cantidad: c.quantity,
          subtotal: c.price * c.quantity,
        }))
      );

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
    }
  };

  const generatePDF = (items) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(255, 204, 0);
    doc.text("Resumen de tu compra", 20, 20);

    const body = items.map((item) => [
      item.tipo === "computadora" ? "PC Personalizada" : item.nombre || item.name,
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

  return (
    <button
      onClick={handleDownloadPDF}
      className="mt-4 bg-yellow-400 px-4 py-2 rounded text-black hover:bg-yellow-500"
    >
      Descargar PDF y finalizar compra
    </button>
  );
};

export default Resume;
