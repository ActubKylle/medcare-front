import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { patientService } from '../../services/api';
import Navbar from '../shared/Navbar';

const UpdatePatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [patientData, setPatientData] = useState({
    diagnosis: '',
    procedure: '',
    history: '',
    prescription: ''
  });
  
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [debugInfo, setDebugInfo] = useState({});
  
  useEffect(() => {
  const fetchPatient = async () => {
    try {
      setLoading(true);
      
      // Log the ID we're trying to fetch
      console.log(`Fetching patient with ID: ${id}`);
      
      // Make the API call directly to get the full patient data
      // This is a workaround for the API issue
      const token = localStorage.getItem('token');
      const response = await fetch(`http://doctor-back.test/api/patients/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Full patient data:", data);
      
      if (data) {
        setPatient(data);
        setPatientData({
          diagnosis: data.diagnosis || '',
          procedure: data.procedure || '',
          history: data.history || '',
          prescription: data.prescription || ''
        });
      } else {
        console.error('Invalid response format:', data);
        setError('Patient data is in an invalid format');
      }
    } catch (err) {
      console.error('Failed to fetch patient:', err);
      setError('Failed to load patient data. Please try again.');
      
      // If unauthorized, redirect to login
      if (err.response && err.response.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };
  
  fetchPatient();
}, [id, navigate]);
  
  // Display debug information for development
  const renderDebugInfo = () => {
    if (Object.keys(debugInfo).length === 0) return null;
    
    return (
      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Debug Information</h3>
        <pre className="text-xs overflow-auto max-h-60 bg-gray-100 p-2 rounded">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
        
        {patient && (
          <div className="mt-2">
            <h4 className="font-semibold">Patient Object Properties:</h4>
            <ul className="list-disc pl-5">
              <li>first_name: {typeof patient.first_name} - {String(patient.first_name || 'undefined')}</li>
              <li>last_name: {typeof patient.last_name} - {String(patient.last_name || 'undefined')}</li>
              <li>dob: {typeof patient.dob} - {String(patient.dob || 'undefined')}</li>
              <li>age: {typeof patient.age} - {String(patient.age || 'undefined')}</li>
              <li>gender: {typeof patient.gender} - {String(patient.gender || 'undefined')}</li>
              <li>address: {typeof patient.address} - {String(patient.address || 'undefined')}</li>
            </ul>
          </div>
        )}
      </div>
    );
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };
  
  const calculateAge = (dateString) => {
    if (!dateString) return '';
    
    try {
      const birthDate = new Date(dateString);
      // Check if date is valid
      if (isNaN(birthDate.getTime())) return '';
      
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      // Adjust age if birthday hasn't occurred yet this year
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age;
    } catch (error) {
      console.error('Age calculation error:', error);
      return '';
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      console.log("Submitting data:", patientData);
      const response = await patientService.updatePatient(id, patientData);
      console.log("Update response:", response);
      
      setSuccess('Patient medical information updated successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/doctor/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Update failed:', err);
      setError(err.response?.data?.message || 'Failed to update patient. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Patient not found or you don't have permission to view this patient.</span>
            </div>
          </div>
          {renderDebugInfo()}
          <button
            onClick={() => navigate('/doctor/dashboard')}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  // Safely access patient properties with fallbacks
  const patientName = patient ? `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || 'Unnamed Patient' : 'Unknown Patient';
  const patientAge = patient && patient.age ? patient.age : (patient && patient.dob ? calculateAge(patient.dob) : '');
  const birthDateDisplay = patient && patient.dob ? formatDate(patient.dob) : 'Not available';
  const ageDisplay = patientAge ? `${patientAge} years` : '';
  const birthAndAge = `${birthDateDisplay}${ageDisplay ? ` (${ageDisplay})` : ''}`;
  const gender = patient && patient.gender ? patient.gender : 'Not specified';
  const address = patient && patient.address ? patient.address : 'Not available';
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/doctor/dashboard')}
            className="mr-4 text-blue-600 hover:text-blue-800 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Update Patient Medical Information</h1>
        </div>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
            <div className="flex">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md">
            <div className="flex">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{success}</span>
            </div>
          </div>
        )}
        
        {/* Debug info for development - remove in production */}
        {process.env.NODE_ENV !== 'production' && renderDebugInfo()}
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6 text-white">
            <h2 className="text-xl font-bold">Patient Information</h2>
            <p className="text-blue-100 text-sm mt-1">Review and update medical details</p>
          </div>
          
          <div className="p-6">
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Patient Name</p>
                  <p className="text-gray-800 font-semibold text-lg">{patientName}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Date of Birth & Age</p>
                  <p className="text-gray-800 font-semibold">{birthAndAge}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Gender</p>
                  <p className="text-gray-800 font-semibold">{gender}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Address</p>
                  <p className="text-gray-800 font-semibold">{address}</p>
                </div>
                {patient && patient.spouse && (
                  <div>
                    <p className="text-gray-500 text-sm">Spouse</p>
                    <p className="text-gray-800 font-semibold">{patient.spouse}</p>
                  </div>
                )}
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Update Medical Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="diagnosis">
                    Diagnosis *
                  </label>
                  <input
                    className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    id="diagnosis"
                    type="text"
                    name="diagnosis"
                    placeholder="Primary diagnosis"
                    value={patientData.diagnosis}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="procedure">
                    Procedure *
                  </label>
                  <input
                    className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    id="procedure"
                    type="text"
                    name="procedure"
                    placeholder="Recommended procedure"
                    value={patientData.procedure}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="history">
                  Medical History *
                </label>
                <textarea
                  className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  id="history"
                  name="history"
                  rows="3"
                  placeholder="Patient's medical history"
                  value={patientData.history}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="prescription">
                  Prescription *
                </label>
                <textarea
                  className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  id="prescription"
                  name="prescription"
                  rows="3"
                  placeholder="Medication and dosage"
                  value={patientData.prescription}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => navigate('/doctor/dashboard')}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className={`${
                    submitting
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'
                  } text-white font-bold py-2 px-6 rounded-lg focus:outline-none transition-all duration-300 flex items-center`}
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    'Update Patient'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePatient;