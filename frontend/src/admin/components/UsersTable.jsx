import { NoSymbolIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import api from "../../API/axiosConfig";



const UsersTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    
    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const response = await api.get("usuario/?rol=2");
            const mappedUsers = response.data.map((user) => ({
                id: user.id,
                name: `${user.nombre} ${user.apellidos}`,
                email: user.correo,
                role: user.rol,
              }));
            setUsers(mappedUsers);
            console.log(response)
          } catch (error) {
            console.error("Error al obtener usuarios:", error);
          }
        };
    
        fetchUsers();
      }, []);
    
    const user = [
        {
            id: 1,
            name: "John Doe",
            email: "",
            role: "Admin",
        },
        {
            id: 2,
            name: "Jane Doe",
            email: "",
            role: "User",
        },
        {
            id: 3,
            name: "Alice",
            email: "",
            role: "User",
        }
    ];

    const filteredUsers = users.filter(
        (user) =>
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="overflow-x-auto">
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar usuarios..."
                    className="border border-gray-300 rounded px-4 py-2 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Nombre</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Rol</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                            <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                            <td className="border border-gray-300 px-4 py-2">{user.email || "N/A"}</td>
                            <td className="border border-gray-300 px-4 py-2">{user.role}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center max-w-fit">
                                <button
                                    className="bg-red-500 text-white rounded px-2 py-1 text-sm hover:bg-red-600 mr-2"
                                    onClick={() => console.log(`Suspend user ${user.id}`)}
                                >
                                    <NoSymbolIcon className="inline-block mr-1" width={16} height={16} />
                                    Bloquear
                                </button>
                                <button
                                    className="bg-blue-500 text-white rounded px-2 py-1 text-sm hover:bg-blue-600"
                                    onClick={() => console.log(`Edit user ${user.id}`)}
                                >
                                    <PencilSquareIcon className="inline-block mr-1" width={16} height={16} />
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersTable;