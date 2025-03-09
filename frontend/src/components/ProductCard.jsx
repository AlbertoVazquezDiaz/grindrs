import { CheckIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Link } from "react-router-dom";
const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product.id}`}
      className="flex justify-end text-nowrap"
    >
      <div className="shadow-sm bg-[#292929] rounded-lg overflow-hidden hover:shadow-md transition duration-300 ease-in-out hover:shadow-yellow-500">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-100">
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
          <button className="bg-[#FFBB00] hover:bg-yellow-500 px-8 py-2 rounded-full cursor-pointer flex items-center justify-center">
            <ShoppingCartIcon className="w-5 h-5 self-center me-2" />
            Comprar
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
