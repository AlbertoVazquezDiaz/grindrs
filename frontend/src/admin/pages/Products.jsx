// IMPORTS
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

// COMPONENT
const Products = () => {
  const [componentes, setComponentes] = useState([]);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    marca: "",
    modelo: "",
    descripcion: "",
    precio: "",
    tipo_componente: "",
    stock: "",
    consumo_watts: "0",
    potencia_watts: "0",
    certificacion: "null",
  });
  const [preview, setPreview] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedComponente, setSelectedComponente] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [tiposComponentes, setTiposComponentes] = useState({});
  const [tipoComponente, setTipoComponente] = useState("");
  const [tipoComponenteEditar, setTipoComponenteEditar] = useState("");
  const [displayPrecio, setDisplayPrecio] = useState("");

  useEffect(() => {
    fetchComponentes();
  }, []);

  const handleRemoveImage = (index) => {
    const newPreview = [...preview];
    newPreview.splice(index, 1);

    const newFormData = { ...formData };
    delete newFormData[`imagen${index + 1}`];

    const updatedImages = newPreview.reduce((acc, img, i) => {
      acc[`imagen${i + 1}`] = formData[`imagen${i + 1}`];
      return acc;
    }, {});

    setPreview(newPreview);
    setFormData({
      ...formData,
      ...updatedImages,
    });
  };

  const resertForm = () => {
    setFormData({
      nombre: "",
      marca: "",
      modelo: "",
      descripcion: "",
      precio: "",
      tipo_componente: "",
      stock: "",
      consumo_watts: "0",
      potencia_watts: "0",
      certificacion: "null",
    });
    setDisplayPrecio("");
    setPreview([]);
    setTipoComponente("");
  };

  const handleUpdateComponent = async () => {
    const hasChanges = Object.entries(editFormData).some(
      ([key, value]) => value !== editingComponent[key]
    );

    if (!hasChanges) {
      toast.info("No hay cambios para guardar.");
      return;
    }

    try {
      await api.patch(`componente/${editingComponent.id}/`, editFormData);
      toast.success("Componente actualizado correctamente");
      fetchComponentes();
      setShowEditModal(false);
    } catch (err) {
      console.error("Error al actualizar componente", err);
      toast.error("Error al actualizar el componente.");
    }
  };

  const fetchComponentes = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("componente/");
      setComponentes(response.data);
      const responses = await api.get("tipoComponente/");
      setTiposComponentes(responses.data);
    } catch (error) {
      toast.error("Error al obtener componentes.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComponent = (id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="bg-gray-800 p-6 rounded shadow-lg text-center w-full max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-3 text-yellow-400">
              ¿Eliminar componente?
            </h2>
            <p className="text-sm text-gray-200 mb-6">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={async () => {
                  try {
                    toast.info("Eliminando componente...");
                    await api.delete(`componente/${id}/`);
                    toast.success("Componente eliminado");
                    onClose();
                    fetchComponentes();
                  } catch (err) {
                    console.error("Error al eliminar componente", err);
                    toast.error("Error al eliminar el componente.");
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const total =
      Object.keys(formData).filter((k) => k.startsWith("imagen")).length +
      files.length;
    if (total > 5) {
      toast.error("Máximo 5 imágenes permitidas.");
      return;
    }

    const newpreviews = [...preview];
    const updatedFormData = { ...formData };

    let nextIndex =
      Object.keys(formData).filter((k) => k.startsWith("imagen")).length + 1;

    files.forEach((file) => {
      if (["image/png", "image/jpeg"].includes(file.type)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          updatedFormData[`imagen${nextIndex}`] = reader.result;
          setFormData({ ...updatedFormData });
          nextIndex++;
        };
        reader.readAsDataURL(file);
        newpreviews.push(URL.createObjectURL(file));
      } else {
        toast.error("Solo se permiten imágenes PNG o JPG.");
      }
    });

    setPreview(newpreviews);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat("es-MX").format(value);
  };

  const handlePrecioChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, "");
    const numberValue = Number(rawValue);

    if (!isNaN(numberValue)) {
      setDisplayPrecio(formatNumber(numberValue));
      setFormData({ ...formData, precio: numberValue });
    }
  };

  const handleChange = (e) => {
    const selectedId = e.target.value;
    const tipo = Object.values(tiposComponentes).find(
      (t) => t.id.toString() === selectedId
    );
    setTipoComponente(tipo?.nombre || "");

    if (tipo?.nombre === "Fuente de poder") {
      setFormData({
        ...formData,
        tipo_componente: selectedId,
        consumo_watts: "0",
        potencia_watts: "",
        certificacion: "",
      });
    } else {
      setFormData({
        ...formData,
        tipo_componente: selectedId,
        consumo_watts: "",
        potencia_watts: "0",
        certificacion: "null",
      });
    }
  };

  const openEditModal = (component) => {
    setEditingComponent(component);
    setEditFormData({ ...component });

    const tipo = Object.values(tiposComponentes).find(
      (t) => t.id === component.tipo_componente
    );
    setTipoComponenteEditar(tipo?.nombre || "");

    setShowEditModal(true);
  };

  useEffect(() => {
    fetchComponentes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let dataToSend = { ...formData };

    if (tipoComponente !== "Fuente de poder") {
      delete dataToSend.certificacion;
      delete dataToSend.potencia_watts;

      if (!dataToSend.consumo_watts) {
        delete dataToSend.consumo_watts;
      }
    }

    try {
      await api.post("componente/", dataToSend);
      toast.success("Componente registrado correctamente");
      setShowModal(false);
      fetchComponentes();
      resertForm();
    } catch (err) {
      console.error("Error al registrar componente", err);
      toast.error("Error al registrar el componente.");
    }
  };

  const columns = [
    { name: "Nombre", selector: (row) => row.nombre, sortable: true },
    { name: "Marca", selector: (row) => row.marca },
    { name: "Modelo", selector: (row) => row.modelo },
    { name: "Descripcion", selector: (row) => row.descripcion },
    { name: "Precio", selector: (row) => `$${row.precio}` },
    { name: "Stock", selector: (row) => row.stock },
    {
      name: "Imagen",
      cell: (row) => (
        <img
          src={row.imagen1}
          alt={row.nombre}
          className="w-12 h-12 object-cover"
        />
      ),
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedComponente(row);
              setShowStockModal(true);
            }}
            className="bg-yellow-500 hover:bg-yellow-600 p-2 rounded text-black"
          >
            <PlusCircleIcon className="w-4 h-4" />
          </button>
          <button
            className="bg-gray-600 hover:bg-gray-700 p-2 rounded text-white"
            onClick={() => openEditModal(row)}
          >
            <PencilSquareIcon className="w-4 h-4" />
          </button>
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
          Agregar componente
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-8">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full relative p-12">
            <button
              className="absolute top-6 right-6 text-gray-500 hover:text-black"
              onClick={() => {
                resertForm();
                setShowModal(false);
              }}
            >
              <XMarkIcon className="h-8 w-8 font-extrabold hover:cursor-pointer" />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-white">
              Agregar componente
            </h2>
            <form
              onSubmit={handleSubmit}
              className="flex flex-wrap gap-3 text-white"
            >
              <select
                className="appearance-none border px-3 py-2 rounded w-full focus:outline-none text-gray-500 border-gray-500 "
                value={formData.tipo_componente}
                onChange={handleChange}
              >
                <option value="null">Tipo componente</option>
                {tiposComponentes.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Nombre"
                className="border px-3 py-2 rounded w-full border-gray-500"
                value={formData.nombre || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(
                    /[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/g,
                    ""
                  );
                  setFormData({ ...formData, nombre: e.target.value });
                }}
              />

              <input
                type="text"
                placeholder="Marca"
                className="border px-3 py-2 rounded w-full border-gray-500"
                onChange={(e) =>
                  setFormData({ ...formData, marca: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Modelo"
                className="border px-3 py-2 rounded w-full border-gray-500"
                onChange={(e) =>
                  setFormData({ ...formData, modelo: e.target.value })
                }
              />
              <div className="relative w-full">
                <label className="text-sm font-semibold text-gray-300 mb-1 block">
                  Descripción{" "}
                  <span className="text-yellow-400">(máx. 200 caracteres)</span>
                </label>
                <textarea
                  rows={4}
                  maxLength={200}
                  value={formData.descripcion || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      descripcion: e.target.value.slice(0, 200),
                    })
                  }
                  placeholder="Escribe aquí una descripción..."
                  className="w-full px-4 py-3 border border-gray-500 bg-[#1e1e1e] text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none"
                />
                <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                  {formData.descripcion?.length || 0}/200
                </div>
              </div>
              <input
                type="text"
                placeholder="Precio"
                value={displayPrecio}
                className="border px-3 py-2 rounded w-full border-gray-500"
                onChange={handlePrecioChange}
              />
              <input
                type="number"
                placeholder="Stock"
                min={0}
                max={99999}
                value={formData.stock || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,5}$/.test(value)) {
                    setFormData({ ...formData, stock: value });
                  }
                }}
                className="w-full px-4 py-2 border border-gray-500 rounded text-white"
              />

              {tipoComponente === "Fuente de poder" && (
                <>
                  <input
                    type="number"
                    placeholder="Potencia en watts"
                    className="border px-3 py-2 rounded w-full"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        potencia_watts: e.target.value,
                      })
                    }
                  />
                  <select
                    className="appearance-none border px-3 py-2 rounded w-full focus:outline-none text-gray-500 border-gray-500"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        certificacion: e.target.value,
                      })
                    }
                  >
                    <option value="">Certificación</option>
                    <option value="80 PLUS">80 PLUS</option>
                    <option value="80 PLUS Bronze">80 PLUS Bronze</option>
                    <option value="80 PLUS Silver">80 PLUS Silver</option>
                    <option value="80 PLUS Gold">80 PLUS Gold</option>
                    <option value="80 PLUS Platinum">80 PLUS Platinum</option>
                    <option value="80 PLUS Titanium">80 PLUS Titanium</option>
                  </select>
                </>
              )}

              <label className="cursor-pointer w-full border-dashed border-2 border-yellow-400 px-4 py-3 rounded text-white text-center">
                <PhotoIcon className="w-6 h-6 mx-auto mb-2" />
                Subir imagen
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>

              {preview.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {preview.map((src, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={src}
                        alt={`preview-${idx}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 bg-gray-400 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center hover:bg-gray-500 hover:cursor-pointer"
                        onClick={() => handleRemoveImage(idx)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="submit"
                className="mt-4 bg-yellow-400 px-6 py-2 rounded text-black hover:bg-yellow-500 w-full"
              >
                Registrar
              </button>
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
          data={componentes.filter((c) =>
            c.nombre.toLowerCase().includes(search.toLowerCase())
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

      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-8">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full relative p-12">
            <button
              className="absolute top-6 right-6 text-gray-200 hover:text-gray-400 hover:cursor-pointer"
              onClick={() => setShowEditModal(false)}
            >
              <XMarkIcon className="h-8 w-8" />
            </button>
            <h2 className="text-xl text-gray-200 font-semibold mb-4">
              Editar:{" "}
              <span className="text-yellow-400">
                {editingComponent?.nombre}
              </span>
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateComponent();
              }}
              className="flex flex-wrap gap-3 text-gray-200"
            >
              {[
                "nombre",
                "marca",
                "modelo",
                "descripcion",
                "precio",
                "stock",
              ].map((field) => (
                <input
                  key={field}
                  type={
                    field === "precio" || field === "stock" ? "number" : "text"
                  }
                  placeholder={field}
                  value={editFormData[field] || ""}
                  className="border px-3 py-2 rounded w-full"
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      [field]: e.target.value,
                    })
                  }
                />
              ))}

              <select
                className="border px-3 py-2 rounded w-full"
                value={editFormData.tipo_componente}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const tipo = Object.values(tiposComponentes).find(
                    (t) => t.id.toString() === selectedId
                  );
                  setTipoComponenteEditar(tipo?.nombre || "");

                  if (tipo?.nombre === "Fuente de poder") {
                    setEditFormData({
                      ...editFormData,
                      tipo_componente: selectedId,
                      consumo_watts: "0",
                      potencia_watts: "",
                      certificacion: "",
                    });
                  } else {
                    setEditFormData({
                      ...editFormData,
                      tipo_componente: selectedId,
                      consumo_watts: "",
                      potencia_watts: "0",
                      certificacion: "null",
                    });
                  }
                }}
              >
                <option value="" className="bg-gray-800">
                  Tipo componente
                </option>
                {tiposComponentes.map((tipo) => (
                  <option key={tipo.id} value={tipo.id} className="bg-gray-800">
                    {tipo.nombre}
                  </option>
                ))}
              </select>

              {tipoComponenteEditar === "Fuente de poder" ? (
                <>
                  <input
                    type="number"
                    placeholder="Potencia en watts"
                    value={editFormData.potencia_watts || ""}
                    className="border px-3 py-2 rounded w-full"
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        potencia_watts: e.target.value,
                      })
                    }
                  />
                  <select
                    className="border px-3 py-2 rounded w-full"
                    value={editFormData.certificacion || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        certificacion: e.target.value,
                      })
                    }
                  >
                    <option value="">Certificación</option>
                    <option value="80 PLUS">80 PLUS</option>
                    <option value="80 PLUS Bronze">80 PLUS Bronze</option>
                    <option value="80 PLUS Silver">80 PLUS Silver</option>
                    <option value="80 PLUS Gold">80 PLUS Gold</option>
                    <option value="80 PLUS Platinum">80 PLUS Platinum</option>
                    <option value="80 PLUS Titanium">80 PLUS Titanium</option>
                  </select>
                </>
              ) : (
                <input
                  type="number"
                  placeholder="Consumo en watts"
                  value={editFormData.consumo_watts || ""}
                  className="border px-3 py-2 rounded w-full"
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      consumo_watts: e.target.value,
                    })
                  }
                />
              )}

              <button
                type="submit"
                className="mt-4 bg-yellow-400 px-6 py-2 rounded text-black hover:cursor-pointer hover:bg-yellow-500 w-full"
              >
                Guardar cambios
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
