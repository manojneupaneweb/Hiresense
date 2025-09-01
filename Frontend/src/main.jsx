import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";


// Pages
import App from "./App.jsx";
import Home from './pages/Home.jsx'
import Jobs from "./pages/jobs.jsx";
import Pricing from "./pages/Pricing.jsx";

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/job", element: <Jobs /> },
      { path: "/pricing", element: <Pricing /> },
    ],
  },
]);

const root = createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);