import React, { useState, useEffect, createContext } from "react";
import { toast } from "react-toastify";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cartItems");
    const parsed = storedCart ? JSON.parse(storedCart) : [];

    return parsed.map((item) => ({
      ...item,
      tipo: item.tipo || "componente",
    }));
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");
    return !!token;
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    const newTotal = cartItems.reduce((acc, item) => {
      const precio = Number(item.price) || 0;
      return acc + precio * item.quantity;
    }, 0);
    setTotalPrice(newTotal);
  }, [cartItems]);

  const decreaseFromCart = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.flatMap((item) =>
        item.id === itemId
          ? item.quantity === 1
            ? []
            : [{ ...item, quantity: item.quantity - 1 }]
          : item
      )
    );
  };

  const addToCart = (item) => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para agregar al carrito");
      return;
    }

    const price = Number(item.precio || item.price || 0);
    const name = item.nombre || item.name || "Producto";
    const image = item.imagen1 || item.image || null;
    const marca = item.marca || "";
    const modelo = item.modelo || "";
    const stock = Number(item.stock || 0);

    let wasAdded = false;
    let wasLimited = false;

    setCartItems((prevItems) => {
      const existing = prevItems.find(
        (p) => p.id === item.id && p.tipo === "componente"
      );
      if (existing) {
        if (existing.quantity >= stock) {
          wasLimited = true;
          return prevItems;
        }
        wasAdded = true;
        return prevItems.map((p) =>
          p.id === item.id && p.tipo === "componente"
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      } else {
        if (stock <= 0) {
          wasLimited = true;
          return prevItems;
        }
        wasAdded = true;
        return [
          ...prevItems,
          {
            ...item,
            price,
            name,
            image,
            marca,
            modelo,
            quantity: 1,
            tipo: "componente",
          },
        ];
      }
    });

    setTimeout(() => {
      if (wasLimited) {
        toast.error(`No puedes agregar más de ${stock} unidades de ${name}`);
      } else if (wasAdded) {
        toast.success(`${name} agregado al carrito`);
      } else if (stock <= 0) {
        toast.error(`No hay stock disponible para ${name}`);
      }
      
    }, 0);
  };

  const addComputerToCart = (computer) => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para agregar al carrito");
      return;
    }

    const price = Number(computer.precio || computer.price || 0);

    setCartItems((prevItems) => {
      const existing = prevItems.find(
        (p) => p.id === computer.id && p.tipo === "computadora"
      );
      if (existing) {
        return prevItems.map((p) =>
          p.id === computer.id && p.tipo === "computadora"
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      } else {
        return [
          ...prevItems,
          { ...computer, price, quantity: 1, tipo: "computadora" },
        ];
      }
    });

    toast.success(`${computer.nombre} agregada al carrito`);
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalPrice,
        addToCart,
        removeFromCart,
        isAuthenticated,
        setIsAuthenticated,
        setCartItems,
        decreaseFromCart,
        clearCart,
        addComputerToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
