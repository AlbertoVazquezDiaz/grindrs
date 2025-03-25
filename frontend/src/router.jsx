import { createBrowserRouter } from "react-router-dom";
import Landing from "./pages/Landing";
import MainLayout from "./layouts/MainLayout";
import ContactUs from "./pages/ContactUs";
import BlackLayout from "./layouts/BlackLayout";
import ProductView from './pages/ProductView';
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import Products from "./admin/pages/Products";
import Users from "./admin/pages/Users";
import Settings from "./admin/pages/Settings";


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Landing /> },
    ],
  },
  {
    path: "/contact",
    element: <BlackLayout />,
    children: [
      { path: "/contact", element: <ContactUs /> },
    ]
  },
  {
    path: "/ProductView",
    element: <ProductView />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "products", element: <Products /> },
      { path: "users", element: <Users /> },
      { path: "settings", element: <Settings /> },
    ]
  }

]);

export default router;
