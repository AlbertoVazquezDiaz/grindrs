import { useState } from "react";
import api from "../../API/axiosConfig";
import { toast } from "react-toastify";
import { XMarkIcon } from "@heroicons/react/24/outline";

const AddStockModal = ({ isOpen, onClose, componente, onStockUpdated }) => {
  const [cantidad, setCantidad] = useState("");

  const handleSubmit = async () => {
    const num = parseInt(cantidad);
    if (isNaN(num) || num < 1) return;

    try {
      await api.patch(`componente/${componente.id}/`, {
        stock: componente.stock + num,
      });
      toast.success("Stock actualizado");
      onStockUpdated(); // recargar la lista
      onClose(); // cerrar el modal
    } catch (err) {
      toast.error("Error al actualizar stock");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center p-6">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4">
          Agregar stock a <span className="text-blue-600">{componente.nombre}</span>
        </h2>
        <input
          type="number"
          className="w-full border px-3 py-2 mb-4 rounded"
          placeholder="Cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-600">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStockModal;
