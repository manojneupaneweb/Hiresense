import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import ProtectedRoute from "../utils/ProtectedRoute.jsx";


// Pages
import App from "./App.jsx";
import Home from './pages/Home.jsx'
import Jobs from "./pages/jobs.jsx";
import Pricing from "./pages/Pricing.jsx";
import Contact from "./pages/Contact.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;


// company route
import Dashboard from "./pages/organization/Dashboard.jsx";
import Layout from "./pages/organization/Layout.jsx";
import Profile from "./pages/UserPage.jsx/Profile.jsx";



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/job", element: <Jobs /> },
      { path: "/pricing", element: <Pricing /> },
      { path: "/contact", element: <Contact /> },
      { path: "/work", element: <HowItWorks /> },


      //protected route 
      {
        path: "/profile",
        element: (
          // <ProtectedRoute allowedRoles={['user']}>
            <Profile />
          // </ProtectedRoute>
        ),
      },
    ],

  },
  {
    path: "/organization",
    element: <Layout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },

    ]
  }
]);

const root = createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);