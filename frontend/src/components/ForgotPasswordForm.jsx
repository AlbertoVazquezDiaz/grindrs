import React, { useState } from "react";
import api from "../API/axiosConfig";
const ForgotPasswordForm = ({ switchToLogin }) => {

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await api.post("send-code/", { email });

            if (response.statusText === "OK") {
                setMessage(response.data.message);
            } else {
                setMessage(data.error);
            }
        } catch (err) {
            setMessage("Hubo un error. Intenta más tarde.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-white text-center text-lg font-semibold mb-4">
                Recuperar contraseña
            </h2>
            <p className="text-sm text-gray-300 mb-4 text-center">
                Ingresa el correo electrónico de tu cuenta
            </p>
            <input
                className="w-full p-2 mb-4 border-b text-white bg-transparent focus:outline-none focus:border-yellow-400"
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-400 text-black py-2 rounded-sm font-bold hover:bg-yellow-500 transition"
            >
                {loading ? "Enviando..." : "Enviar"}
            </button>
            {message && (
                <p className="text-sm mt-4 text-center text-yellow-300">{message}</p>
            )}
            <p className="mt-6 text-center text-sm text-gray-300">
                <button
                    className="text-yellow-400 hover:text-yellow-500"
                    type="button"
                    onClick={switchToLogin}
                >
                    Volver al inicio de sesión
                </button>
            </p>
        </form>
    )
}

export default ForgotPasswordForm;
