import { createBrowserRouter } from "react-router-dom";
import Landing from "./pages/Landing";
import MainLayout from "./layouts/MainLayout";
import ContactUs from "./pages/ContactUs";
import BlackLayout from "./layouts/BlackLayout";

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
  }
]);

export default router;
