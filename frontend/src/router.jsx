import { createBrowserRouter } from "react-router-dom";
import Landing from "./pages/Landing";
import LoginForm from "./pages/LoginForm";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Landing /> },
      { path: "/login", element: <LoginForm /> },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
        { path: "login", element: <LoginForm /> },
    ]

  }
]);

export default router;
