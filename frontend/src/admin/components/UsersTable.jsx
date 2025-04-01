import { NoSymbolIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import api from "../../API/axiosConfig";
import DataTable from "react-data-table-component";

const UsersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("usuario/?rol=2");
        const mappedUsers = response.data.map((user) => ({
          id: user.id,
          name: `${user.nombre} ${user.apellidos}`,
          email: user.correo,
        }));
        setUsers(mappedUsers);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Nombre",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex justify-center gap-2">
          <button
            className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
            onClick={() => console.log(`Suspend user ${row.id}`)}
          >
            <NoSymbolIcon className="w-5 h-5" />
          </button>
          <button
            className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-600"
            onClick={() => console.log(`Edit user ${row.id}`)}
          >
            <PencilSquareIcon className="w-5 h-5" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="p-6">
      <input
        type="text"
        placeholder="Buscar usuarios..."
        className="border border-gray-300 rounded px-4 py-2 w-full mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <DataTable
        columns={columns}
        data={filteredUsers}
        pagination
        highlightOnHover
        striped
        responsive
        progressPending={isLoading}
        progressComponent={
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-yellow-400 border-t-transparent"></div>
          </div>
        }
      />
    </div>
  );
};

export default UsersTable;
