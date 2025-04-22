import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../API/axiosConfig";
import ImageGallery from "react-image-gallery";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import "react-image-gallery/styles/css/image-gallery.css";
import { CartContext } from "../contexts/contexts";
import { toast } from "react-toastify";

const ProductView = () => {
  const { isAuthenticated, addToCart, cartItems, decreaseFromCart } =
    useContext(CartContext);
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`componente/${productId}/`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error al obtener producto:", err);
      }
    };

    const fetchRelated = async () => {
      try {
        const res = await api.get("componente/");
        const related = res.data
          .filter((p) => p.id !== parseInt(productId))
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (err) {
        console.error("Error al obtener productos relacionados:", err);
      }
    };

    fetchProduct();
    fetchRelated();
  }, [productId]);

  if (!product) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-yellow-400 border-t-transparent"></div>
      </div>
    );
  }

  const existingItem = cartItems.find((item) => item.id === product.id);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Inicia sesión primero");
    } else {
      addToCart(product);
    }
  };

  const images = ["imagen1", "imagen2", "imagen3", "imagen4", "imagen5"]
    .map((key) => product[key])
    .filter((url) => !!url)
    .map((url) => ({
      original: url.startsWith("data:image")
        ? url
        : `data:image/jpeg;base64,${url}`,
      thumbnail: url.startsWith("data:image")
        ? url
        : `data:image/jpeg;base64,${url}`,
    }));

  return (
    <div className="px-4 sm:px-6 lg:px-24 py-6 w-full bg-[#1E1E1E] min-h-screen text-white">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 w-full max-w-screen-xl mx-auto">
        <div className="w-full max-w-full">
          <ImageGallery
            items={images}
            showPlayButton={false}
            showFullscreenButton={true}
            renderItem={(item) => (
              <div className="w-full aspect-[4/3] bg-[#1e1e1e]">
                <img
                  src={item.original}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          />
        </div>

        <div className="flex flex-col gap-4 w-full max-w-full">
          <h1 className="text-3xl font-bold text-yellow-400">
            {product.nombre}
          </h1>
          <p className="text-base">
            Marca:{" "}
            <span className="font-medium text-white">{product.marca}</span>
          </p>
          <p className="text-base">
            Modelo:{" "}
            <span className="font-medium text-white">{product.modelo}</span>
          </p>
          <p className="text-2xl font-semibold text-yellow-400">
            {Number(product.precio).toLocaleString("es-MX", {
              style: "currency",
              currency: "MXN",
            })}
          </p>
          <p className="text-sm text-gray-300">
            {product.stock > 0
              ? `Stock disponible: ${product.stock}`
              : "Agotado"}
          </p>

          {existingItem && existingItem.quantity > 0 ? (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  decreaseFromCart(Number(productId));
                }}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                -
              </button>
              <span className="text-white">{existingItem.quantity}</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product);
                }}
                className="bg-green-500 text-white px-2 py-1 rounded"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="relative hover:cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded w-full sm:w-auto overflow-hidden group transition duration-300 flex items-center justify-center gap-2"
            >
              Agregar al carrito
              <span className="opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
                <ShoppingBagIcon className="w-5 h-5 text-black" />
              </span>
            </button>
          )}

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-white mb-2">
              Descripción
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              {product.descripcion ||
                "Este producto no tiene una descripción detallada disponible."}
            </p>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-20 w-full max-w-screen-xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-yellow-400">
            Productos Relacionados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rp) => (
              <Link
                to={`/ProductView/${rp.id}`}
                key={rp.id}
                className="bg-[#2D2D2D] border border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-yellow-500 transition"
              >
                <img
                  src={
                    rp.imagen1?.startsWith("data:image")
                      ? rp.imagen1
                      : `data:image/jpeg;base64,${rp.imagen1}`
                  }
                  alt={rp.nombre}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-sm font-medium text-white truncate">
                    {rp.nombre}
                  </h3>
                  <p className="text-sm text-gray-300">
                    {rp.marca} - {rp.modelo}
                  </p>
                  <p className="text-sm text-yellow-400 font-semibold mt-1">
                    {Number(rp.precio).toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductView;
