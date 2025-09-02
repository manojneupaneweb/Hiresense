import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import ProtectedRoute from "../utils/ProtectedRoute.jsx";

// Pages
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Jobs from "./pages/jobs.jsx";
import Pricing from "./pages/Pricing.jsx";
import Contact from "./pages/Contact.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";

// Organization pages
import Dashboard from "./pages/organization/Dashboard.jsx";
import Layout from "./pages/organization/Layout.jsx";
import JobManagement from "./pages/organization/JobManagement.jsx";
import JobDetails from "./pages/organization/JobDetails.jsx";
import ViewjobApplicants from "./pages/organization/ViewjobApplicants.jsx";
import ViewDetails from "./pages/organization/ViewDetails.jsx";

// User page
import Profile from "./pages/UserPage.jsx/Profile.jsx";

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
      { path: "/contact", element: <Contact /> },
      { path: "/work", element: <HowItWorks /> },
      { path: "jobs/:id", element: <JobDetails /> },

      // Protected user route
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
      { path: "jobs", element: <JobManagement /> },
      { path: "jobs/:id/applicants", element: <ViewjobApplicants /> },
      { path: "jobs/:id/applicants/:applicantId", element: <ViewDetails /> },
    ],
  },
]);

const root = createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
