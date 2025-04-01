import React, { useState, useEffect } from "react";
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

const Products = () => {
  const [componentes, setComponentes] = useState([]);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    marca: "",
    modelo: "",
    precio: "",
    tipo_componente: "",
    stock: "",
    //imagen1: null,
  });
  const [preview, setPreview] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedComponente, setSelectedComponente] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchComponentes();
  }, []);

  const fetchComponentes = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("componente/");
      setComponentes(response.data);
    } catch (error) {
      toast.error("Error al obtener componentes.");
      console.error("Error al obtener componentes:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  /*
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error("Máximo 5 imágenes permitidas.");
      return; 
    }

    const previews = [];
    const updatedFormData = { ...formData };

    files.forEach((file, index) => {
      if (["image/png", "image/jpeg"].includes(file.type)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          updatedFormData[`imagen${index + 1}`] = reader.result;
          setFormData(updatedFormData);
        };
        reader.readAsDataURL(file);
        previews.push(URL.createObjectURL(file));
      } else {
        toast.error("Solo se permiten imágenes PNG o JPG.");
      }
    });

    setPreview(previews);
  };
  */

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const total = Object.keys(formData).filter(k => k.startsWith("imagen")).length + files.length;
    if (total > 5) {
      toast.error("Máximo 5 imágenes permitidas.");
      return; 
    }

    const newpreviews = [ ...preview];
    const updatedFormData = { ...formData };

    let nextIndex = Object.keys(formData).filter(k => k.startsWith("imagen")).length + 1;

    files.forEach((file) => {
      if (["image/png", "image/jpeg"].includes(file.type)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          updatedFormData[`imagen${nextIndex}`] = reader.result;
          setFormData({ ...updatedFormData});
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      await api.post("componente/", formData);
      toast.success("Componente registrado correctamente");
      setShowModal(false);
      fetchComponentes();
      console.log(formData);
    } catch (err) {
      console.error("Error al registrar componente", err);
      toast.error("Error al registrar el componente.");
    }
  };

  const columns = [
    { name: "Nombre", selector: (row) => row.nombre, sortable: true },
    { name: "Marca", selector: (row) => row.marca },
    { name: "Modelo", selector: (row) => row.modelo },
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
          <button className="bg-gray-600 hover:bg-gray-700 p-2 rounded text-white">
            <PencilSquareIcon className="w-4 h-4" />
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
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full relative p-12">
            <button
              className="absolute top-6 right-6 text-gray-500 hover:text-black"
              onClick={() => setShowModal(false)}
            >
              <XMarkIcon className="h-8 w-8 font-extrabold hover:cursor-pointer" />
            </button>
            <h2 className="text-xl font-semibold mb-4">Registrar Componente</h2>
            <form
              onSubmit={handleSubmit}
              className="flex flex-wrap gap-3"
              encType="multipart/form-data"
            >
              <input
                type="text"
                placeholder="Nombre"
                className="border px-3 py-2 rounded w-full"
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Marca"
                className="border px-3 py-2 rounded w-full"
                onChange={(e) =>
                  setFormData({ ...formData, marca: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Modelo"
                className="border px-3 py-2 rounded w-full"
                onChange={(e) =>
                  setFormData({ ...formData, modelo: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Precio"
                className="border px-3 py-2 rounded w-full"
                onChange={(e) =>
                  setFormData({ ...formData, precio: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Stock"
                className="border px-3 py-2 rounded w-full"
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Tipo componente ID"
                className="border px-3 py-2 rounded w-full"
                onChange={(e) =>
                  setFormData({ ...formData, tipo_componente: e.target.value })
                }
              />
              <label className="cursor-pointer w-full bg-white border-dashed border-2 border-yellow-400 px-4 py-3 rounded text-gray-700 text-center">
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
                    <img
                      key={idx}
                      src={src}
                      alt={`preview-${idx}`}
                      className="w-20 h-20 object-cover rounded"
                    />
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
    </div>
  );
};

export default Products;
