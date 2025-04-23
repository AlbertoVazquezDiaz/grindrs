import React, { useState, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import api from "../../API/axiosConfig";
import { toast } from "react-toastify";
import {
  XMarkIcon,
  PlusCircleIcon,
  PencilSquareIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import DataTable from "react-data-table-component";
import AddStockModal from "../components/AddStockModal";

const Compatibility = () => {
  const [compatibilidad, setCompatibilidad] = useState([]);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState([
    { componente_base: "", componente_compatible: "" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedComponente, setSelectedComponente] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [componentes, setComponentes] = useState({});

  useEffect(() => {
    fetchComponentes();
  }, []);

  const fetchComponentes = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("compatibilidades/");
      setCompatibilidad(response.data);
      const responses = await api.get("componente/");
      setComponentes(responses.data);
    } catch (error) {
      toast.error("Error al obtener componentes.");
      console.error("Error al obtener componentes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = formData.every(
      (pair) =>
        pair.componente_base &&
        pair.componente_compatible &&
        pair.componente_base !== pair.componente_compatible
    );

    if (!isValid) {
      toast.error(
        "No puedes dejar campos vacíos ni elegir el mismo componente dos veces."
      );
      return;
    }

    // 🚫 Verifica duplicados con los ya existentes
    const existeDuplicado = formData.some((nuevo) => {
      return compatibilidad.some(
        (existente) =>
          (Number(existente.componente_base.id) ===
            Number(nuevo.componente_base) &&
            Number(existente.componente_compatible.id) ===
              Number(nuevo.componente_compatible)) ||
          (Number(existente.componente_base.id) ===
            Number(nuevo.componente_compatible) &&
            Number(existente.componente_compatible.id) ===
              Number(nuevo.componente_base))
      );
    });

    if (existeDuplicado) {
      toast.error(
        "Una o más compatibilidades ya existen (en cualquier orden)."
      );
      return;
    }

    try {
      const payload = {
        compatibilidades: formData.map((item) => ({
          componente_base: Number(item.componente_base),
          componente_compatible: Number(item.componente_compatible),
        })),
      };

      await api.post("compatibilidades/", payload);
      toast.success("Compatibilidades registradas correctamente");
      setShowModal(false);
      setFormData([{ componente_base: "", componente_compatible: "" }]);
      fetchComponentes(); // refrescar tabla
    } catch (err) {
      toast.error("Error al registrar compatibilidades");
      console.error(err);
    }
  };

  const handleDeleteComponent = (id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="bg-gray-800 p-6 rounded shadow-lg text-center w-full max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-3 text-yellow-400">
              ¿Eliminar compatibilidad?
            </h2>
            <p className="text-sm text-gray-200 mb-6">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={async () => {
                  try {
                    toast.info("Eliminando compatibilidad...");
                    await api.delete(`compatibilidades/${id}/`);
                    toast.success("Compatibilidad eliminada");
                    onClose();
                    fetchComponentes();
                  } catch (err) {
                    console.error("Error al eliminar compatibilidad", err);
                    toast.error("Error al eliminar la compatibilidad");
                  }
                }}
              >
                Sí, eliminar
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded text-gray-800"
                onClick={onClose}
              >
                Cancelar
              </button>
            </div>
          </div>
        );
      },
    });
  };

  const columns = [
    {
      name: "Componente base",
      selector: (row) => row.componente_base.nombre,
      sortable: true,
    },
    {
      name: "Componente compatible",
      selector: (row) => row.componente_compatible.nombre,
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            className="bg-red-500 hover:bg-red-600 p-2 rounded text-white"
            onClick={() => handleDeleteComponent(row.id)}
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Buscar componente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-1/2"
        />
        <button
          onClick={() => setShowModal(true)}
          className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded text-black"
        >
          Agregar compatibilidad
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full relative p-12">
            <button
              className="absolute top-6 right-6 text-gray-500 hover:text-black"
              onClick={() => {
                setShowModal(false);
                setFormData([
                  { componente_base: "", componente_compatible: "" },
                ]);
              }}
            >
              <XMarkIcon className="h-8 w-8 font-extrabold hover:cursor-pointer" />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              Registrar Compatibilidades
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {formData.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <select
                    className="appearance-none bg-gray-100 text-gray-800 border border-gray-300 focus:border-yellow-400 focus:ring focus:ring-yellow-200 focus:ring-opacity-50 px-4 py-2 rounded-md shadow-sm transition duration-200"
                    value={item.componente_base}
                    onChange={(e) => {
                      const updated = [...formData];
                      updated[index].componente_base = e.target.value;
                      setFormData(updated);
                    }}
                  >
                    <option value="" disabled>
                      Componente base
                    </option>
                    {componentes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>

                  <select
                    className="appearance-none bg-gray-100 text-gray-800 border border-gray-300 focus:border-yellow-400 focus:ring focus:ring-yellow-200 focus:ring-opacity-50 px-4 py-2 rounded-md shadow-sm transition duration-200"
                    value={item.componente_compatible}
                    onChange={(e) => {
                      const updated = [...formData];
                      updated[index].componente_compatible = e.target.value;
                      setFormData(updated);
                    }}
                  >
                    <option value="" disabled>
                      Componente compatible
                    </option>
                    {componentes
                      .filter((c) => c.id.toString() !== item.componente_base)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre}
                        </option>
                      ))}
                  </select>
                </div>
              ))}

              <div className="flex flex-wrap justify-between items-center gap-4 mt-4">
                <button
                  type="button"
                  disabled={formData.length >= 5}
                  onClick={() => {
                    if (formData.length < 5) {
                      setFormData([
                        ...formData,
                        { componente_base: "", componente_compatible: "" },
                      ]);
                    }
                  }}
                  className="bg-gray-200 text-sm px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Agregar compatibilidad
                </button>
                <button
                  type="submit"
                  className="bg-yellow-400 px-6 py-2 rounded text-black hover:bg-yellow-500"
                >
                  Registrar compatibilidades
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-yellow-400 border-t-transparent"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={compatibilidad.filter(
            (c) =>
              c.componente_base?.nombre
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
              c.componente_compatible?.nombre
                ?.toLowerCase()
                .includes(search.toLowerCase())
          )}
          pagination
          highlightOnHover
          striped
          responsive
        />
      )}
      <AddStockModal
        isOpen={showStockModal}
        onClose={() => setShowStockModal(false)}
        componente={selectedComponente}
        onStockUpdated={fetchComponentes}
      />
    </div>
  );
};

export default Compatibility;
