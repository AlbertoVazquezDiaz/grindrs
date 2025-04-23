import React, { useState, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import api from "../../API/axiosConfig";
import { toast } from "react-toastify";
import {
  XMarkIcon,
  PlusCircleIcon,
  PencilSquareIcon,
  PhotoIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import DataTable from "react-data-table-component";
import AddStockModal from "../components/AddStockModal";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [tiposComponentes, setTiposComponentes] = useState({});
  const [tipoComponente, setTipoComponente] = useState("");
  const [tipoComponenteEditar, setTipoComponenteEditar] = useState("");
  const [displayPrecio, setDisplayPrecio] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchComponentes();
  }, []);

  const fetchComponentes = async () => {
    try {
      setIsLoading(true);
      const [componentsRes, tiposRes] = await Promise.all([
        api.get("componente/"),
        api.get("tipoComponente/"),
      ]);
      setComponentes(componentsRes.data);
      setTiposComponentes(tiposRes.data);
    } catch (error) {
      toast.error("Error al obtener componentes.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (value) => new Intl.NumberFormat("es-MX").format(value);

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
    setErrors({});
  };

  const campoVacio = (v) =>
    v === undefined || v === null || v.toString().trim() === "";
  const superaMax = (v) => Number(v) > 999999;
  const esCeroONeg = (v) => Number(v) <= 0;
  const tieneScript = (txt) => /<\s*script/i.test(txt);

  const validateForm = () => {
    const errores = [];

    if (
      campoVacio(formData.tipo_componente) ||
      formData.tipo_componente === "null"
    )
      errores.push("Debes seleccionar un tipo de componente.");

    if (campoVacio(formData.nombre)) errores.push("El nombre es obligatorio.");
    if (campoVacio(formData.marca)) errores.push("La marca es obligatoria.");
    if (campoVacio(formData.modelo)) errores.push("El modelo es obligatorio.");
    if (campoVacio(formData.descripcion))
      errores.push("La descripción es obligatoria.");
    if (campoVacio(formData.precio)) errores.push("El precio es obligatorio.");
    if (campoVacio(formData.stock)) errores.push("El stock es obligatorio.");

    if (!campoVacio(formData.descripcion) && tieneScript(formData.descripcion))
      errores.push("La descripción no es válida.");

    if (!campoVacio(formData.precio)) {
      const precioNum = Number(formData.precio);
      if (esCeroONeg(precioNum))
        errores.push("El precio debe ser un número mayor a 0.");
      else if (superaMax(precioNum))
        errores.push("El precio no puede ser mayor a 999,999.");
    }

    if (!campoVacio(formData.stock)) {
      const stockNum = Number(formData.stock);
      if (esCeroONeg(stockNum))
        errores.push("El stock debe ser un número mayor a 0.");
      else if (superaMax(stockNum))
        errores.push("El stock no puede ser mayor a 999,999.");
    }

    if (tipoComponente === "Fuente de poder") {
      if (campoVacio(formData.potencia_watts))
        errores.push("La potencia en watts es obligatoria.");
      if (campoVacio(formData.certificacion))
        errores.push("La certificación es obligatoria.");

      if (!campoVacio(formData.potencia_watts)) {
        const pw = Number(formData.potencia_watts);
        if (esCeroONeg(pw)) errores.push("La potencia en watts debe ser > 0.");
        else if (superaMax(pw))
          errores.push("La potencia en watts no puede ser mayor a 999,999.");
      }
    } else {
      if (!campoVacio(formData.consumo_watts)) {
        const cw = Number(formData.consumo_watts);
        if (esCeroONeg(cw))
          errores.push("El consumo en watts debe ser mayor a 0.");
        else if (superaMax(cw))
          errores.push("El consumo en watts no puede ser mayor a 999,999.");
      }
    }

    if (errores.length) {
      errores.forEach((msg) => toast.error(msg));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (preview.length === 0) {
      toast.error("Debes subir al menos una imagen.");
      return;
    }

    if (!validateForm()) return;

    let dataToSend = { ...formData };
    if (tipoComponente !== "Fuente de poder") {
      delete dataToSend.certificacion;
      delete dataToSend.potencia_watts;
      if (!dataToSend.consumo_watts) delete dataToSend.consumo_watts;
    }

    try {
      setIsSubmitting(true);
      await api.post("componente/", dataToSend);
      toast.success("Componente registrado correctamente");
      setShowModal(false);
      fetchComponentes();
      resertForm();
    } catch (err) {
      console.error("Error al registrar componente", err);
      toast.error("Error al registrar el componente.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const currentCount = Object.keys(formData).filter((k) =>
      k.startsWith("imagen")
    ).length;
    const total = currentCount + files.length;

    if (total > 5) {
      toast.error("Máximo 5 imágenes permitidas.");
      return;
    }

    const newPreviews = [...preview];
    const updatedFormData = { ...formData };
    let nextIndex = currentCount + 1;

    files.forEach((file) => {
      if (["image/png", "image/jpeg"].includes(file.type)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          updatedFormData[`imagen${nextIndex}`] = reader.result;
          setFormData({ ...updatedFormData });
          nextIndex++;
        };
        reader.readAsDataURL(file);
        newPreviews.push(URL.createObjectURL(file));
      } else {
        toast.error("Solo se permiten imágenes PNG o JPG.");
      }
    });
    setPreview(newPreviews);
  };

  const handlePrecioChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, "");
    const numberValue = Number(rawValue);
    if (!isNaN(numberValue) && rawValue.length <= 6) {
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

  const handleDeleteComponent = (id) => {
    confirmAlert({
      customUI: ({ onClose }) => (
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
      ),
    });
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

  const validateEditForm = () => {
    const errores = [];

    if (campoVacio(editFormData.nombre))
      errores.push("El nombre es obligatorio.");
    if (campoVacio(editFormData.marca))
      errores.push("La marca es obligatoria.");
    if (campoVacio(editFormData.modelo))
      errores.push("El modelo es obligatorio.");
    if (campoVacio(editFormData.descripcion))
      errores.push("La descripción es obligatoria.");
    if (
      !campoVacio(editFormData.descripcion) &&
      tieneScript(editFormData.descripcion)
    )
      errores.push("La descripción no puede contener scripts.");

    if (campoVacio(editFormData.precio))
      errores.push("El precio es obligatorio.");
    if (campoVacio(editFormData.stock))
      errores.push("El stock es obligatorio.");

    if (!campoVacio(editFormData.precio)) {
      const num = Number(editFormData.precio);
      if (esCeroONeg(num)) errores.push("El precio debe ser mayor a 0.");
      else if (superaMax(num))
        errores.push("El precio no puede ser mayor a 999,999.");
    }

    if (!campoVacio(editFormData.stock)) {
      const num = Number(editFormData.stock);
      if (esCeroONeg(num)) errores.push("El stock debe ser mayor a 0.");
      else if (superaMax(num))
        errores.push("El stock no puede ser mayor a 999,999.");
    }

    if (tipoComponenteEditar === "Fuente de poder") {
      if (campoVacio(editFormData.potencia_watts))
        errores.push("La potencia en watts es obligatoria.");
      if (campoVacio(editFormData.certificacion))
        errores.push("La certificación es obligatoria.");

      if (!campoVacio(editFormData.potencia_watts)) {
        const num = Number(editFormData.potencia_watts);
        if (esCeroONeg(num)) errores.push("La potencia debe ser mayor a 0.");
        else if (superaMax(num))
          errores.push("La potencia no puede ser mayor a 999,999.");
      }
    } else {
      if (!campoVacio(editFormData.consumo_watts)) {
        const num = Number(editFormData.consumo_watts);
        if (esCeroONeg(num)) errores.push("El consumo debe ser mayor a 0.");
        else if (superaMax(num))
          errores.push("El consumo no puede ser mayor a 999,999.");
      }
    }

    if (errores.length) {
      errores.forEach((msg) => toast.error(msg));
      return false;
    }
    return true;
  };

  const handleUpdateComponent = async () => {
    if (!validateEditForm()) return;

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
      toast.error("Error al actualizar el componente.");
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
              className="absolute top-6 right-6 text-gray-200 hover:text-gray-400"
              onClick={() => {
                resertForm();
                setShowModal(false);
              }}
            >
              <XMarkIcon className="h-8 w-8" />
            </button>

            <h2 className="text-xl font-semibold mb-6 text-white">
              Agregar componente
            </h2>

            <form
              onSubmit={handleSubmit}
              className="flex flex-wrap gap-4 text-white"
            >
              {/* SELECT TIPO COMPONENTE */}
              <div className="relative w-full">
                <select
                  className="appearance-none w-full border border-gray-500 bg-[#1e1e1e] px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  value={formData.tipo_componente}
                  onChange={handleChange}
                >
                  <option value="null">Tipo componente</option>
                  {tiposComponentes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nombre}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute top-3 right-3 h-4 w-4 text-gray-400" />
              </div>

              {/* INPUTS GENERALES */}
              <input
                type="text"
                placeholder="Nombre"
                value={formData.nombre || ""}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                className="border border-gray-500 bg-[#1e1e1e] px-3 py-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-yellow-400"
              />

              <input
                type="text"
                placeholder="Marca"
                onChange={(e) =>
                  setFormData({ ...formData, marca: e.target.value })
                }
                className="border border-gray-500 bg-[#1e1e1e] px-3 py-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-yellow-400"
              />

              <input
                type="text"
                placeholder="Modelo"
                onChange={(e) =>
                  setFormData({ ...formData, modelo: e.target.value })
                }
                className="border border-gray-500 bg-[#1e1e1e] px-3 py-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-yellow-400"
              />

              {/* DESCRIPCIÓN */}
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
                placeholder="Descripción (máx. 200 caracteres)"
                className="w-full border border-gray-500 bg-[#1e1e1e] px-3 py-2 rounded resize-none focus:outline-none focus:ring-1 focus:ring-yellow-400"
              />

              <input
                type="text"
                placeholder="Precio"
                value={displayPrecio}
                onChange={handlePrecioChange}
                className="border border-gray-500 bg-[#1e1e1e] px-3 py-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-yellow-400"
              />

              <input
                type="number"
                placeholder="Stock"
                min={0}
                max={99999}
                value={formData.stock || ""}
                onChange={(e) => {
                  if (/^\d{0,5}$/.test(e.target.value))
                    setFormData({ ...formData, stock: e.target.value });
                }}
                className="border border-gray-500 bg-[#1e1e1e] px-3 py-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-yellow-400"
              />

              {/* CAMPOS ESPECÍFICOS */}
              {tipoComponente === "Fuente de poder" ? (
                <>
                  <input
                    type="number"
                    placeholder="Potencia en watts"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        potencia_watts: e.target.value,
                      })
                    }
                    className="border border-gray-500 bg-[#1e1e1e] px-3 py-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  />

                  <div className="relative w-full">
                    <select
                      className="appearance-none w-full border border-gray-500 bg-[#1e1e1e] px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-yellow-400"
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
                    <ChevronDownIcon className="pointer-events-none absolute top-3 right-3 h-4 w-4 text-gray-400" />
                  </div>
                </>
              ) : (
                <input
                  type="number"
                  placeholder="Consumo en watts"
                  onChange={(e) =>
                    setFormData({ ...formData, consumo_watts: e.target.value })
                  }
                  className="border border-gray-500 bg-[#1e1e1e] px-3 py-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-yellow-400"
                />
              )}

              {/* INPUT SUBIR IMAGEN */}
              <label className="cursor-pointer w-full border-dashed border-2 border-yellow-400 px-4 py-3 rounded text-center">
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
                        className="absolute -top-2 -right-2 bg-gray-400 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
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
                className="mt-4 w-full bg-yellow-400 px-6 py-2 rounded text-black hover:bg-yellow-500 transition"
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
              className="absolute top-6 right-6 text-gray-200 hover:text-gray-400"
              onClick={() => setShowEditModal(false)}
            >
              <XMarkIcon className="h-8 w-8" />
            </button>

            <h2 className="text-xl text-gray-200 font-semibold mb-6">
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
              className="flex flex-wrap gap-4 text-gray-200"
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
                  className="border border-gray-500 bg-[#1e1e1e] px-3 py-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      [field]: e.target.value,
                    })
                  }
                />
              ))}

              <div className="relative w-full">
                <select
                  className="appearance-none w-full border border-gray-500 bg-[#1e1e1e] px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-yellow-400 text-gray-200"
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
                  <option value="">Tipo componente</option>
                  {tiposComponentes.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute top-3 right-3 h-4 w-4 text-gray-400" />
              </div>

              {tipoComponenteEditar === "Fuente de poder" ? (
                <>
                  <input
                    type="number"
                    placeholder="Potencia en watts"
                    value={editFormData.potencia_watts || ""}
                    className="border border-gray-500 bg-[#1e1e1e] px-3 py-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-yellow-400"
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        potencia_watts: e.target.value,
                      })
                    }
                  />
                  <select
                    className="appearance-none w-full border border-gray-500 bg-[#1e1e1e] px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-yellow-400 text-gray-200"
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
                  className="border border-gray-500 bg-[#1e1e1e] px-3 py-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-yellow-400"
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
                className="mt-4 w-full bg-yellow-400 px-6 py-2 rounded text-black hover:bg-yellow-500 transition"
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
