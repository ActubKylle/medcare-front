import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { patientService, doctorService } from "../../services/api";
import Navbar from "../shared/Navbar";

const AdminDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch patients and doctors
        const patientResponse = await patientService.getPatients();
        const doctorResponse = await doctorService.getDoctors();

        setPatients(patientResponse.data);
        setDoctors(doctorResponse.data);
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddPatient = () => {
    navigate("/admin/patients/add");
  };

  const handleAddDoctor = () => {
    navigate("/admin/doctors/add");
  };

  const handleDeleteDoctor = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this doctor? This action cannot be undone."
      )
    ) {
      doctorService
        .deleteDoctor(id)
        .then(() => {
          setDoctors(doctors.filter((doctor) => doctor.id !== id));
        })
        .catch((err) => {
          console.error("Failed to delete doctor:", err);
          setError("Failed to delete doctor. Please try again.");
        });
    }
  };

  const handlePatientsViewAll = () => {
    console.log("Navigating to /admin/patients");
    localStorage.setItem('last_navigation', '/admin/patients');
    navigate('/admin/patients');
  };

  const handleDoctorsViewAll = () => {
    console.log("Navigating to /admin/doctors");
    // Store a debug marker in localStorage
    localStorage.setItem("last_navigation", "/admin/doctors");
    navigate("/admin/doctors");
  };

  const handleDeletePatient = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this patient? This action cannot be undone."
      )
    ) {
      patientService
        .deletePatient(id)
        .then(() => {
          setPatients(patients.filter((patient) => patient.id !== id));
        })
        .catch((err) => {
          console.error("Failed to delete patient:", err);
          setError("Failed to delete patient. Please try again.");
        });
    }
  };

  // Calculate dashboard stats
  const totalPatients = patients.length;
  const totalDoctors = doctors.length;

  // Get recent patients (last 5)
  const recentPatients = [...patients]
    .sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    })
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Admin Dashboard
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
                <h3 className="text-gray-500 text-sm font-medium mb-2">
                  Total Patients
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  {totalPatients}
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
                <h3 className="text-gray-500 text-sm font-medium mb-2">
                  Total Doctors
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {totalDoctors}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mb-8 flex flex-wrap gap-4">
              <button
                onClick={handleAddPatient}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add New Patient
              </button>

              <button
                onClick={handleAddDoctor}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-300 shadow-md flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add New Doctor
              </button>
            </div>

            {/* Recent Patients */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 transition-all hover:shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Recent Patients
                </h2>
                 <button 
              onClick={handlePatientsViewAll}
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              View All
            </button>
              </div>

              {recentPatients.length === 0 ? (
                <div className="text-center py-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <p className="text-gray-500">No patients found.</p>
                  <button
                    onClick={handleAddPatient}
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
                  >
                    Add Your First Patient
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <th className="px-4 py-3 rounded-tl-lg">Name</th>
                        <th className="px-4 py-3">Age</th>
                        <th className="px-4 py-3">Gender</th>
                        <th className="px-4 py-3">Diagnosis</th>
                        <th className="px-4 py-3 rounded-tr-lg">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentPatients.map((patient) => (
                        <tr
                          key={patient.id}
                          className="text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-4 font-medium">{`${patient.first_name} ${patient.last_name}`}</td>
                          <td className="px-4 py-4">{patient.age}</td>
                          <td className="px-4 py-4">{patient.gender}</td>
                          <td className="px-4 py-4">{patient.diagnosis}</td>
                          <td className="px-4 py-4 flex gap-2">
                            <button
                              onClick={() =>
                                navigate(`/admin/patients/${patient.id}`)
                              }
                              className="text-blue-500 hover:text-blue-700 transition-colors"
                              title="View"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path
                                  fillRule="evenodd"
                                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() =>
                                navigate(`/admin/patients/${patient.id}/edit`)
                              }
                              className="text-green-500 hover:text-green-700 transition-colors"
                              title="Edit"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeletePatient(patient.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Delete Patient"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Doctors List */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 transition-all hover:shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Doctors</h2>
                <button
                  onClick={handleDoctorsViewAll}
                  className="text-blue-500 hover:text-blue-700 font-medium"
                >
                  View All
                </button>
              </div>

              {doctors.length === 0 ? (
                <div className="text-center py-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <p className="text-gray-500">No doctors found.</p>
                  <button
                    onClick={handleAddDoctor}
                    className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
                  >
                    Add Your First Doctor
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <th className="px-4 py-3 rounded-tl-lg">Name</th>
                        <th className="px-4 py-3">Specialization</th>
                        <th className="px-4 py-3">Expertise</th>
                        <th className="px-4 py-3 rounded-tr-lg">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {doctors.map((doctor) => (
                        <tr
                          key={doctor.id}
                          className="text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-4 font-medium">
                            {doctor.user?.name ||
                              doctor.admin?.user?.name ||
                              `Doctor #${doctor.id}`}
                          </td>
                          <td className="px-4 py-4">{doctor.procedure}</td>
                          <td className="px-4 py-4">{doctor.diagnosis}</td>
                          <td className="px-4 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  navigate(`/admin/doctors/${doctor.id}/edit`)
                                }
                                className="text-green-500 hover:text-green-700 transition-colors"
                                title="Edit Doctor"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteDoctor(doctor.id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                                title="Delete Doctor"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
