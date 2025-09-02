import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";

// Pages
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Jobs from "./pages/jobs.jsx";
import Pricing from "./pages/Pricing.jsx";
import Contact from "./pages/Contact.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";
import Dashboard from "./pages/organization/Dashboard.jsx";
import Layout from "./pages/organization/Layout.jsx";
import JobManagement from "./pages/organization/JobManagement.jsx";
import JobDetails from "./pages/organization/JobDetails.jsx";
import ViewApplicants from "./pages/organization/ViewApplicants.jsx";
import ViewDetails from "./pages/organization/ViewDetails.jsx";

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

// company route

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
    ],
  },
  {
    path: "/organization",
    element: <Layout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "jobs", element: <JobManagement /> },
      { path: "jobs/:id", element: <JobDetails /> },
      { path: "jobs/:id/applicants", element: <ViewApplicants /> },
      { path: "jobs/:id/applicants/:applicantId", element: <ViewDetails /> },
      // ... other child routes
    ],
  },
]);

const root = createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
