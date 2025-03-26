import axios from "axios";
const publicRoutes = ["login", "register", "token/refresh"];

const api = axios.create({
    baseURL: " http://127.0.0.1:8000/estancias/",
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  // Agregar el token a las solicitudes si existe en localStorage
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken"); 
    const isPublic = publicRoutes.some((route) => config.url.includes(route));

    if (token && isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  
  export default api;
  