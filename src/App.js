import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";

// Auth Components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// Admin Components
import AdminDashboard from "./components/admin/AdminDashboard";
import PatientForm from "./components/admin/PatientForm";
import DoctorForm from "./components/admin/DoctorForm";
import DoctorList from "./components/admin/DoctorList";
import PatientList from "./components/admin/PatientList";
import PatientView from './components/admin/PatientView';
// Doctor Components
import DoctorDashboard from "./components/doctor/DoctorDashboard";
import UpdatePatient from "./components/doctor/UpdatePatient";

// Shared Components
import ProtectedRoute from "./components/shared/ProtectedRoute";

const UnauthorizedPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-8 rounded shadow-md max-w-md w-full">
      <h2 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h2>
      <p className="mb-4">You do not have permission to access this page.</p>
      <a
        href="/"
        className="block w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center"
      >
        Go Home
      </a>
    </div>
  </div>
);

function App() {
  // On app load, set the Authentication header if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Setting token in App component");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    // Add event listener for route changes to refresh the token
    const handleRouteChange = () => {
      const token = localStorage.getItem("token");
      if (token) {
        console.log("Refreshing token on route change");
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    };

    // Listen for route changes
    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={<ProtectedRoute allowedRoles={["admin"]} />}
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="doctors" element={<DoctorList />} />
          <Route path="patients/add" element={<PatientForm />} />
            <Route path="patients/:id" element={<PatientView />} /> 
          <Route path="patients/:id/edit" element={<PatientForm />} />
          <Route path="doctors/add" element={<DoctorForm />} />
          <Route path="doctors/:id/edit" element={<DoctorForm />} />
          <Route path="patients" element={<PatientList />} />
        </Route>

        {/* Doctor Routes */}
        <Route
          path="/doctor"
          element={<ProtectedRoute allowedRoles={["doctor"]} />}
        >
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="patients/:id/update" element={<UpdatePatient />} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
