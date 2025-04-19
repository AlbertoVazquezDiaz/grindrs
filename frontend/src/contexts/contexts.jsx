import React, { useState, useEffect, createContext } from 'react';
import { toast } from 'react-toastify';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const storedCart = localStorage.getItem("cartItems");
        const parsed = storedCart ? JSON.parse(storedCart) : [];

        return parsed.map(item => ({
            ...item,
            tipo: item.tipo || 'componente'  // si no tiene tipo, lo asumimos componente
        }));
    });
    const [totalPrice, setTotalPrice] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const token = localStorage.getItem("token");
        return !!token;
    });

    // Cargar desde localStorage al iniciar
    /*useEffect(() => {
        const storedCart = localStorage.getItem('cartItems');
        const token = localStorage.getItem("token");

        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }

        setIsAuthenticated(!!token);
    }, []);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");
            setIsAuthenticated(!!token);
        };

        checkAuth(); // <-- Ejecutar de entrada

        window.addEventListener("authChange", checkAuth);

        return () => window.removeEventListener("authChange", checkAuth);
    }, []);*/

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        const newTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotalPrice(newTotal);
    }, [cartItems]);

    const decreaseFromCart = (itemId) => {
        setCartItems((prevItems) => {
            return prevItems.flatMap(item => {
                if (item.id === itemId) {
                    return item.quantity === 1
                        ? []
                        : [{ ...item, quantity: item.quantity - 1 }];
                }
                return item;
            });
        });
    };

    const addToCart = (item) => {
        if (!isAuthenticated) {
            toast.error("Debes iniciar sesión para agregar al carrito");
            return;
        }

        setCartItems((prevItems) => {
            const existing = prevItems.find(p => p.id === item.id && p.tipo === 'componente');
            if (existing) {
                return prevItems.map(p =>
                    p.id === item.id && p.tipo === 'componente'
                        ? { ...p, quantity: p.quantity + 1 }
                        : p
                );
            } else {
                return [...prevItems, { ...item, quantity: 1, tipo: 'componente' }];
            }
        });

        //setTotalPrice((prevPrice) => prevPrice + parseFloat(item.price));
        toast.success(`${item?.nombre || item?.name || 'Producto'} agregado al carrito`);

    };

    const addComputerToCart = (computer) => {
        if (!isAuthenticated) {
            toast.error("Debes iniciar sesión para agregar al carrito");
            return;
        }

        setCartItems((prevItems) => {
            const existing = prevItems.find(p => p.id === computer.id && p.tipo === 'computadora');
            if (existing) {
                return prevItems.map(p =>
                    p.id === computer.id && p.tipo === 'computadora'
                        ? { ...p, quantity: p.quantity + 1 }
                        : p
                );
            } else {
                return [...prevItems, { ...computer, quantity: 1, tipo: 'computadora' }];
            }
        });

        toast.success(`${computer.nombre} agregada al carrito`);
    };

    const removeFromCart = (itemId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
        const clearCart = () => {
            setCartItems([]);
            localStorage.removeItem("cartItems");
        };
        /*setCartItems((prevItems) => {
            const itemToRemove = prevItems.find(item => item.id === itemId);
            if (itemToRemove) {
                setTotalPrice(prevPrice => prevPrice - itemToRemove.price);
            }
            return prevItems.filter(item => item.id !== itemId);
        });*/
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem("cartItems");
    };

    return (
        <CartContext.Provider value={{ cartItems, totalPrice, addToCart, removeFromCart, isAuthenticated, setIsAuthenticated, setCartItems, decreaseFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}