import { createBrowserRouter } from "react-router-dom";
import Landing from "./pages/Landing";
import MainLayout from "./layouts/MainLayout";
import ContactUs from "./pages/ContactUs";
import BlackLayout from "./layouts/BlackLayout";
import ProductView from "./pages/ProductView";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import Products from "./admin/pages/Products";
import Compatibility from "./admin/pages/Compatibility";
import Users from "./admin/pages/Users";
import Settings from "./admin/pages/Settings";
import ProtectedRoute from "./admin/components/ProtectedRoute";
import ResetPassword from "./pages/ResetPassword";
import CartPage from "./pages/CartPage";
import Builder from "./pages/Builder";
import MyOrders from "./pages/MyOrders";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [{ path: "/", element: <Landing /> }],
  },
  {
    path: "/contact",
    element: <BlackLayout />,
    children: [{ path: "/contact", element: <ContactUs /> }],
  },
  {
    path: "/builder",
    element: <BlackLayout />,
    children: [{ path: "/builder", element: <Builder /> }],
  },
  {
    path: "/cart",
    element: <BlackLayout />,
    children: [{ path: "/cart", element: <CartPage /> }],
  },
  {
    path: "/my-orders",
    element: <BlackLayout />,
    children: [{ path: "/my-orders", element: <MyOrders /> }],
  },
  {
    path: "/ProductView",
    element: <MainLayout />,
    children: [{ path: "/ProductView/:productId", element: <ProductView /> }],
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <AdminLayout />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "products", element: <Products /> },
          { path: "users", element: <Users /> },
          { path: "settings", element: <Settings /> },
          { path: "compatibilities", element: <Compatibility /> },
        ],
      },
    ],
  },
]);

export default router;
