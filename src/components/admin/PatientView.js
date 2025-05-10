// src/components/admin/PatientView.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { patientService } from '../../services/api';
import Navbar from '../shared/Navbar';

const PatientView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Add explicit handling and logging
  const handleNavigation = (path) => {
    console.log(`PatientView - Navigating to: ${path}`);
    localStorage.setItem('last_navigation', path);
    navigate(path);
  };

  useEffect(() => {
    console.log("PatientView component mounted");
    
    const fetchPatient = async () => {
      try {
        setLoading(true);
        console.log(`Fetching patient with ID: ${id}`);
        
        const response = await patientService.getPatient(id);
        console.log("Patient data received:", response.data);
        
        setPatient(response.data);
      } catch (err) {
        console.error('Failed to fetch patient:', err);
        setError('Failed to load patient data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatient();
    
    return () => {
      console.log("PatientView component unmounted");
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
            <div className="flex">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error || 'Patient not found'}</span>
            </div>
          </div>
          <button
            onClick={() => handleNavigation('/admin/dashboard')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Patient Details</h1>
          <div className="flex gap-2">
            <button
              onClick={() => handleNavigation('/admin/patients')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              All Patients
            </button>
            <button
              onClick={() => handleNavigation('/admin/dashboard')}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              Dashboard
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-500 p-6 text-white">
            <h2 className="text-xl font-bold">{`${patient.first_name} ${patient.last_name}`}</h2>
            <p className="text-sm text-blue-100 mt-1">Patient ID: {patient.id}</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">Personal Information</h3>
                <div className="bg-gray-50 rounded p-4">
                  <p className="mb-2"><span className="font-semibold">Age:</span> {patient.age}</p>
                  <p className="mb-2"><span className="font-semibold">Date of Birth:</span> {new Date(patient.dob).toLocaleDateString()}</p>
                  <p className="mb-2"><span className="font-semibold">Gender:</span> {patient.gender}</p>
                  <p className="mb-2"><span className="font-semibold">Address:</span> {patient.address}</p>
                  {patient.spouse && (
                    <p><span className="font-semibold">Spouse:</span> {patient.spouse}</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">Medical Information</h3>
                <div className="bg-gray-50 rounded p-4">
                  <p className="mb-2"><span className="font-semibold">Diagnosis:</span> {patient.diagnosis}</p>
                  <p className="mb-2"><span className="font-semibold">Procedure:</span> {patient.procedure}</p>
                  <p><span className="font-semibold">Doctor:</span> {patient.doctor_id}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-gray-500 text-sm font-medium mb-1">Medical History</h3>
              <div className="bg-gray-50 rounded p-4">
                <p>{patient.history}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-gray-500 text-sm font-medium mb-1">Prescription</h3>
              <div className="bg-gray-50 rounded p-4">
                <p>{patient.prescription}</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => handleNavigation(`/admin/patients/${patient.id}/edit`)}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Patient
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientView;