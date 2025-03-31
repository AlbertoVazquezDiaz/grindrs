import { CheckIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Link } from "react-router-dom";
const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product.id}`}
      className="block w-full max-w-[290px] sm:max-w-full"
    >
      <div className="bg-[#292929] rounded-lg overflow-hidden transition duration-300 ease-in-out hover:shadow-yellow-500 relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-100 text-wrap">
            {product.name}
          </h3>
          <p className="text-gray-400 mt-4 text-wrap">{product.description}</p>
          <p className="text-lg font-bold text-gray-200 mt-2">
            ${product.price}
          </p>
        </div>
        <div className="bg-[#E6E8E6] text-black w-fit rounded-lg text-sm font-medium p-2 flex items-center justify-center mx-3">
          <p>{product.stock}</p>{" "}
          <CheckIcon className="w-5 h-5 self-center ml-2" />
        </div>
        <div className="flex justify-end text-black text-sm font-medium p-2 my-2">
          <button className="bg-[#FFBB00] hover:bg-yellow-500 px-4 py-2 rounded-full cursor-pointer flex items-center justify-center sm:justify-start">
            <ShoppingCartIcon className="w-5 h-5 self-center" />
          </button>
        </div>
        <div className="absolute bottom-0 left-1/2 w-0 h-1 bg-yellow-500 transition-all duration-300 ease-in-out group-hover:w-full group-hover:left-0"></div>
      </div>
    </Link>
  );
};

export default ProductCard;
