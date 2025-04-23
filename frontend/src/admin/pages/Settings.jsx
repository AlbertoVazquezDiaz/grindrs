import React, { useEffect, useState } from "react";
import {
  PhotoIcon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import api from "../../API/axiosConfig";
import { set } from "react-hook-form";

const SliderSettings = () => {
  const [previewFiles, setPreviewFiles] = useState([]);
  const [base64Files, setBase64Files] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setIsLoadingGallery(true);
    try {
      const res = await api.get("slider/");
      setGallery(res.data);
    } catch {
      toast.error("Error al cargar imágenes del slider.");
    } finally {
      setIsLoadingGallery(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const total = previewFiles.length + files.length;

    if (total > 5) {
      toast.error("Máximo 5 imágenes permitidas.");
      return;
    }

    files.forEach((file) => {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        toast.error("Solo se permiten imágenes PNG o JPG.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setBase64Files((prev) => [...prev, reader.result]);
        setPreviewFiles((prev) => [...prev, URL.createObjectURL(file)]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePreview = (index) => {
    const previews = [...previewFiles];
    const base64 = [...base64Files];
    previews.splice(index, 1);
    base64.splice(index, 1);
    setPreviewFiles(previews);
    setBase64Files(base64);
  };

  const handleDeleteImage = (id) => {
    let toastId = toast.info(
      ({ closeToast }) => (
        <div className="text-sm text-gray-200">
          <p>¿Eliminar esta imagen del slider?</p>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={async () => {
                try {
                  toast.dismiss(toastId);
                  await api.delete(`slider/${id}/`);
                  toast.success("Imagen eliminada correctamente.");
                  fetchGallery();
                } catch {
                  toast.dismiss(toastId);
                  toast.error("No se pudo eliminar la imagen.");
                }
              }}
              className="bg-red-500 text-white px-3 py-1 rounded text-xs"
            >
              Sí, eliminar
            </button>
            <button
              onClick={() => toast.dismiss(toastId)}
              className="bg-gray-300 text-black px-3 py-1 rounded text-xs"
            >
              Cancelar
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeButton: false,
        draggable: false,
        closeOnClick: false,
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (base64Files.length === 0) {
      toast.error("Debes subir al menos una imagen.");
      return;
    }

    try {
      for (const base64 of base64Files) {
        await api.post("slider/", { imagen: base64 });
      }
      toast.success("Imágenes subidas correctamente.");
      setBase64Files([]);
      setPreviewFiles([]);
      fetchGallery();
    } catch {
      toast.error("Error al subir las imágenes.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      toast.error("La nueva contraseña es obligatoria.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    try {
      await api.patch(
        `usuario/1/`,
        {
          password: newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Contraseña actualizada correctamente.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Error al cambiar la contraseña.");
      console.error(error);
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Configuración del Slider</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded-lg shadow-lg"
        >
          <label className="cursor-pointer w-full border-dashed border-2 border-yellow-400 px-4 py-3 rounded text-center block">
            <PhotoIcon className="w-6 h-6 mx-auto mb-2" />
            Subir imágenes (máx. 5)
            <input
              type="file"
              accept="image/png, image/jpeg"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />
          </label>

          {previewFiles.length > 0 && (
            <div className="mt-4">
              <h2 className="text-sm text-yellow-400 mb-2">Previsualización</h2>
              <div className="flex flex-wrap gap-3">
                {previewFiles.map((src, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={src}
                      alt={`preview-${idx}`}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePreview(idx)}
                      className="absolute -top-2 -right-2 bg-gray-500 text-white w-6 h-6 rounded-full text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="mt-6 bg-yellow-400 px-6 py-2 rounded text-black hover:bg-yellow-500 w-full"
          >
            Guardar imágenes
          </button>
        </form>

        <div>
          <h2 className="text-lg font-semibold mb-3 text-yellow-400">
            Galería actual
          </h2>
          {isLoadingGallery ? (
            <div className="flex justify-center items-center py-6">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-yellow-400 border-t-transparent" />
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {gallery.map((img) => (
                <div key={img.id} className="relative">
                  <img
                    src={img.imagen}
                    alt="slider-img"
                    className="w-24 h-24 object-cover rounded"
                  />
                  <button
                    onClick={() => handleDeleteImage(img.id)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cambio de contraseña */}
      <form
        onSubmit={handlePasswordChange}
        className="mt-12 bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Cambiar contraseña</h2>

        <div className="relative mb-4">
          <input
            type={showCurrent ? "text" : "password"}
            placeholder="Contraseña actual"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-2 pr-10 border border-gray-500 rounded bg-gray-700 text-white placeholder-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute inset-y-0 right-3 flex items-center"
          >
            {showCurrent ? (
              <EyeSlashIcon className="h-5 w-5 text-white" />
            ) : (
              <EyeIcon className="h-5 w-5 text-white" />
            )}
          </button>
        </div>

        <div className="relative mb-4">
          <input
            type={showNew ? "text" : "password"}
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 pr-10 border border-gray-500 rounded bg-gray-700 text-white placeholder-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute inset-y-0 right-3 flex items-center"
          >
            {showNew ? (
              <EyeSlashIcon className="h-5 w-5 text-white" />
            ) : (
              <EyeIcon className="h-5 w-5 text-white" />
            )}
          </button>
        </div>

        <div className="relative mb-1">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 pr-10 border border-gray-500 rounded bg-gray-700 text-white placeholder-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute inset-y-0 right-3 flex items-center"
          >
            {showConfirm ? (
              <EyeSlashIcon className="h-5 w-5 text-white" />
            ) : (
              <EyeIcon className="h-5 w-5 text-white" />
            )}
          </button>
        </div>

        <p
          className={`text-sm mt-1 ${
            newPassword && confirmPassword
              ? newPassword === confirmPassword
                ? "text-green-400"
                : "text-red-400"
              : ""
          }`}
        >
          {newPassword && confirmPassword
            ? newPassword === confirmPassword
              ? "Las contraseñas coinciden."
              : "Las contraseñas no coinciden."
            : ""}
        </p>

        <button
          type="submit"
          className="mt-4 bg-yellow-400 px-6 py-2 rounded text-black hover:bg-yellow-500 w-full"
        >
          Cambiar contraseña
        </button>
      </form>
    </div>
  );
};

export default SliderSettings;
