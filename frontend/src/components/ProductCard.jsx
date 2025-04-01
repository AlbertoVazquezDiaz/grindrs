import { CheckIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link
  to={`/product/${product.id}`}
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
      <p className="text-lg font-bold text-gray-200">${product.price}</p>
    </div>

    <div className="flex justify-between items-center px-4 pb-4">
      <div className="bg-[#E6E8E6] text-black rounded-lg text-sm font-medium px-3 py-1 flex items-center">
        <p>{product.stock > 0 ? `Stock: ${product.stock}` : "Agotado"}</p>
        {product.stock > 0 && (
          <CheckIcon className="w-4 h-4 self-center ml-1" />
        )}
      </div>

      <button className="bg-[#FFBB00] hover:bg-yellow-500 px-3 py-2 rounded-full cursor-pointer flex items-center justify-center">
        <ShoppingCartIcon className="w-5 h-5 self-center" />
      </button>
    </div>
  </div>
</Link>

  );
};

export default ProductCard;
