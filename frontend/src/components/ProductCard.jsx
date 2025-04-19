import { CheckIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../contexts/contexts";
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  //const [isAuthenticated, setIsAuthenticated] = useState(false);

  /*useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);
  */
  const { isAuthenticated, addToCart, cartItems, decreaseFromCart } = useContext(CartContext);
  //const existingItem = cartItems.find((item) => item.id === product.id);
  const existingItem = cartItems.find((item) => item.id === product.id && item.tipo === "componente");



  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Inicia sesion primero')
    } else {
      addToCart(product);
    }
  };

  return (
    <Link
      to={`/ProductView/${product.id}`}
      className="block w-full max-w-[300px] sm:max-w-[260px] md:max-w-[270px] lg:max-w-[290px] xl:max-w-sm group"
    >
      <div className="bg-[#292929] h-[460px] flex flex-col justify-between rounded-lg overflow-hidden transition duration-300 ease-in-out hover:shadow-yellow-500 relative">
        <div className="w-full aspect-[4/3] overflow-hidden">
          <img
            src={
              product.image
                ? product.image.startsWith("data:image")
                  ? product.image
                  : `data:image/jpeg;base64,${product.image}`
                : "https://fakeimg.pl/300x200/cccccc/909090?text=Sin+imagen&font=museo"
            }
            alt={product.name || "Producto"}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-4 flex flex-col gap-2 flex-grow">
          <h3 className="text-lg font-semibold text-gray-100 line-clamp-1">
            {product.name || "Sin nombre"}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2">
            {product.description || "Sin descripción"}
          </p>
          <p className="text-gray-400 text-sm line-clamp-2">
            {product.detail || "Sin detalles"}
          </p>
          <p className="text-lg font-bold text-gray-200">${product.price}</p>
        </div>

        <div className="flex justify-between items-center px-4 pb-4">
          <div className="bg-[#E6E8E6] text-black rounded-lg text-sm font-medium px-3 py-1 flex items-center">
            <p>{product.stock > 0 ? `Stock: ${product.stock}` : "Agotado"}</p>
            {product.stock > 0 && (
              <CheckIcon className="w-4 h-4 self-center ml-1" />
            )}
          </div>
          {existingItem && existingItem.quantity > 0 ? (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  decreaseFromCart(product.id);
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
              className="bg-[#FFBB00] hover:bg-yellow-500 px-3 py-2 rounded-full"
            >
              <ShoppingCartIcon className="w-5 h-5" />
            </button>
          )}



          {/*<button
            onClick={handleAddToCart}
            className="bg-[#FFBB00] hover:bg-yellow-500 px-3 py-2 rounded-full cursor-pointer flex items-center justify-center"
          >
            <ShoppingCartIcon className="w-5 h-5 self-center" />
          </button>*/}
        </div>

        <div className="absolute bottom-0 left-1/2 w-0 h-1 bg-yellow-400 transition-all duration-300 ease-in-out group-hover:w-full group-hover:left-0"></div>
      </div>
    </Link>
  );
};

export default ProductCard;
