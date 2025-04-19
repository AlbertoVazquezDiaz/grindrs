import React, { Component, useContext, useState } from "react";
import { CartContext } from "../contexts/contexts";
import { Link } from "react-router-dom";
import api from "../API/axiosConfig";
import { toast } from "react-toastify";

const CartPage = () => {
    const { cartItems, totalPrice, addToCart, decreaseFromCart, clearCart } = useContext(CartContext);
    const [loading, setLoading] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    const componentes = cartItems.filter(item => item.tipo === "componente");
    const computadoras = cartItems.filter(item => item.tipo === "computadora");

    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const handleSubmit = async () => {
        if (!user) return toast.error("Inicia sesión primero");

        setLoading(true);
        try {
            let computadora_ids = [];

            for (let compu of computadoras) {
                const computadoraData = {
                    nombre: compu.nombre,
                    descripcion: compu.descripcion || "",
                    usuario: user.id,
                    detalles: compu.componentes.map(c => ({ componente: c.id, cantidad: c.cantidad || 1 }))
                };

                const response = await api.post("computadoras/", computadoraData, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                computadora_ids.push({ computadora: response.data.computadoira_id, cantidad: compu.quantity, subtotal: compu.precio * compu.quantity });
            }

            const detalles = [
                ...componentes.map(item => ({
                    componente: item.id,
                    cantidad: item.quantity,
                    subtotal: item.price * item.quantity,
                })),
                ...computadora_ids
            ];

            const orderData = {
                usuario: user.id,
                total: totalPrice,
                detalles
            };
            console.log(orderData);
            await api.post("ventas/", orderData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("Compra realizada con éxito");
            clearCart();
        } catch (error) {
            console.error(error);
            toast.error("Hubo un error al procesar tu compra");
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="bg-[#1e1e1e]  min-h-screen text-white px-6 py-10">
            <h1 className="text-4xl font-bold text-center text-yellow-400 mb-8">Carrito de Compras</h1>

            {cartItems.length === 0 ? (
                <p className="text-gray-300">Tu carrito está vacío.</p>
            ) : (
                <div className="grid gap-6">
                    {/*{computadoras.map((item, i) => (
                        <div key={`compu-${i}`} className="bg-[#2d2d2d] p-4 rounded-lg shadow-lg">
                            <h2 className="text-xl font-semibold text-yellow-400">{item.nombre}</h2>
                            <p className="text-gray-400">Precio: ${item.precio}</p>
                            <p className="text-gray-300 font-bold mt-2">Componentes:</p>
                            <ul className="text-gray-400 text-sm list-disc list-inside">
                                {item.componentes.map((c, index) => (
                                    <li key={index}>{c.nombre} x{c.cantidad}</li>
                                ))}
                            </ul>
                        </div>
                    ))}*/}
                    {computadoras.length > 0 ? computadoras.map((item, i) => (
                        <div key={`compu-${i}`} className="bg-[#2d2d2d] p-4 rounded-lg shadow-lg">
                            <h2 className="text-xl font-semibold text-yellow-400">{item.nombre}</h2>
                            <p className="text-gray-400">Precio: ${item.precio}</p>

                            {Array.isArray(item.componentes) && item.componentes.length > 0 ? (
                                <>
                                    <p className="text-gray-300 font-bold mt-2">Componentes:</p>
                                    <ul className="text-gray-400 text-sm list-disc list-inside">
                                        {item.componentes.map((c, index) => (
                                            <li key={index}>{c.nombre} x{c.cantidad}</li>
                                        ))}
                                    </ul>
                                </>
                            ) : (
                                <p className="text-gray-500 text-sm italic">Sin componentes definidos</p>
                            )}
                        </div>
                    )) : (
                        <div>
                            <p className="text-gray-500 text-sm italic">No hay computadoras en el carrito</p>
                        </div>
                    )}

                    {/*{componentes.map((item) => (*/}
                    {componentes.length > 0 ? componentes.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col md:flex-row bg-[#2d2d2d] p-4 rounded-lg shadow-lg gap-4"
                        >
                            <Link to={`/ProductView/${item.id}`} className="w-full md:w-48">
                                <img
                                    src={
                                        item.image?.startsWith("data:image")
                                            ? item.image
                                            : `data:image/jpeg;base64,${item.image}`
                                    }
                                    alt={item.name}
                                    className="w-full h-40 object-cover rounded"
                                />
                            </Link>

                            <div className="flex flex-col justify-between flex-grow">
                                <Link to={`/ProductView/${item.id}`}>
                                    <h2 className="text-xl font-semibold text-yellow-400">{item.name}</h2>
                                </Link>
                                <p className="text-gray-400">Precio: ${item.price}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <button
                                        onClick={() => decreaseFromCart(item.id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                    >
                                        -
                                    </button>
                                    <span className="text-white">{item.quantity}</span>
                                    <button
                                        onClick={() => addToCart(item)}
                                        className="bg-green-500 text-white px-2 py-1 rounded"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    )): (
                        <div>
                            <p className="text-gray-500 text-sm italic">No hay componentes en el carrito</p>
                        </div>
                    )}

                    <div className="mt-10 border-t border-gray-600 pt-6 text-right">
                        <h2 className="text-2xl font-semibold text-white">
                            Total de Artículos: <span className="text-yellow-400">{totalQuantity}</span>
                        </h2>
                        <h2 className="text-2xl font-semibold text-white mt-2">
                            Total a Pagar: <span className="text-yellow-400">${totalPrice.toFixed(2)}</span>
                        </h2>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="mt-4 bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400 transition"
                        >
                            {loading ? "Procesando..." : "Proceder al Pago"}
                        </button>
                    </div>
                </div>


            )}
        </div>
    );
};

export default CartPage;
