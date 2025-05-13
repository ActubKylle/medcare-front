import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { patientService, doctorService } from '../../services/api';
import Navbar from '../shared/Navbar';

const PatientForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    age: '',
    dob: '',
    gender: 'Male',
    address: '',
    spouse: '',
    diagnosis: '',
    procedure: '',
    history: '',
    prescription: '',
    doctor_id: ''
  });
  
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await doctorService.getDoctors();
        setDoctors(response.data);
        
        // Set first doctor as default if available
        if (response.data.length > 0 && !isEditMode) {
          setFormData(prevData => ({
            ...prevData,
            doctor_id: response.data[0].id
          }));
        }
      } catch (err) {
        console.error('Failed to fetch doctors:', err);
        setError('Failed to load doctors. Please try again.');
      }
    };
    
    const fetchPatient = async () => {
      if (!isEditMode) return;
      
      try {
        setLoading(true);
        const response = await patientService.getPatient(id);
        setFormData(response.data);
      } catch (err) {
        console.error('Failed to fetch patient:', err);
        setError('Failed to load patient data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctors();
    fetchPatient();
  }, [id, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (isEditMode) {
        await patientService.updatePatient(id, formData);
        setSuccess('Patient updated successfully!');
      } else {
        await patientService.createPatient(formData);
        setSuccess('Patient added successfully!');
        // Reset form if not in edit mode
        setFormData({
          first_name: '',
          last_name: '',
          age: '',
          dob: '',
          gender: 'Male',
          address: '',
          spouse: '',
          diagnosis: '',
          procedure: '',
          history: '',
          prescription: '',
          doctor_id: doctors.length > 0 ? doctors[0].id : ''
        });
      }
      
      // Redirect back to dashboard after a short delay
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Form submission failed:', err);
      setError(err.response?.data?.message || 'Failed to save patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && isEditMode) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Patient' : 'Add New Patient'}</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        <div className="bg-white rounded shadow p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="first_name">
                  First Name *
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="first_name"
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="last_name">
                  Last Name *
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="last_name"
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">
                  Age *
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="age"
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dob">
                  Date of Birth *
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="dob"
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">
                  Gender *
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                  Address *
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="address"
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="spouse">
                  Spouse (optional)
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="spouse"
                  type="text"
                  name="spouse"
                  placeholder="Spouse Name"
                  value={formData.spouse}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="doctor_id">
                  Assigned Doctor *
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="doctor_id"
                  name="doctor_id"
                  value={formData.doctor_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a doctor</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                     {doctor.user?.name || doctor.admin?.user?.name || `Doctor #${doctor.id}`} - {doctor.procedure}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-4">Medical Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="diagnosis">
                  Diagnosis *
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="diagnosis"
                  type="text"
                  name="diagnosis"
                  placeholder="Diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="procedure">
                  Procedure *
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="procedure"
                  type="text"
                  name="procedure"
                  placeholder="Procedure"
                  value={formData.procedure}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="history">
                  Medical History *
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="history"
                  name="history"
                  rows="3"
                  placeholder="Medical History"
                  value={formData.history}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="prescription">
                  Prescription *
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="prescription"
                  name="prescription"
                  rows="3"
                  placeholder="Prescription"
                  value={formData.prescription}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {loading ? 'Saving...' : isEditMode ? 'Update Patient' : 'Add Patient'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientForm;