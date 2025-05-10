import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doctorService, adminService } from '../../services/api';
import Navbar from '../shared/Navbar';

const DoctorForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    procedure: '',
    diagnosis: '',
    history: '',
    admin_id: '',
    user: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: 'doctor'
    }
  });
  
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingAdmins, setFetchingAdmins] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setFetchingAdmins(true);
        console.log("Fetching admins...");
        const response = await adminService.getAdmins();
        console.log("Admins received:", response.data);
        setAdmins(response.data);
        
        // Set the first admin as default if available
        if (response.data.length > 0) {
          setFormData(prevData => ({
            ...prevData,
            admin_id: response.data[0].id
          }));
          console.log("Default admin ID set to:", response.data[0].id);
        } else {
          console.log("No admins found to set as default");
        }
      } catch (err) {
        console.error('Failed to fetch admins:', err);
        setError('Failed to load administrators. Please try again.');
      } finally {
        setFetchingAdmins(false);
      }
    };
    
    const fetchDoctor = async () => {
      if (!isEditMode) return;
      
      try {
        setLoading(true);
        const response = await doctorService.getDoctor(id);
        setFormData({
          procedure: response.data.procedure || '',
          diagnosis: response.data.diagnosis || '',
          history: response.data.history || '',
          admin_id: response.data.admin_id || '',
          user: {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            role: 'doctor'
          }
        });
      } catch (err) {
        console.error('Failed to fetch doctor:', err);
        setError('Failed to load doctor data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdmins();
    if (isEditMode) {
      fetchDoctor();
    }
  }, [id, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('user.')) {
      // Handle nested user object fields
      const userField = name.split('.')[1];
      setFormData(prevData => ({
        ...prevData,
        user: {
          ...prevData.user,
          [userField]: value
        }
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };
  
  // In DoctorForm.js, check how formData is being handled
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setSuccess('');
  
  // Validate password match
  if (!isEditMode && formData.user.password !== formData.user.password_confirmation) {
    setError('Passwords do not match');
    setLoading(false);
    return;
  }
  
  console.log("Submitting doctor data:", formData);
  
  try {
    if (isEditMode) {
      // When editing, don't update user credentials
      const { user, ...doctorData } = formData;
      await doctorService.updateDoctor(id, doctorData);
      setSuccess('Doctor updated successfully!');
    } else {
      // Make sure user data is included when creating a new doctor
      await doctorService.createDoctor(formData);
      setSuccess('Doctor added successfully!');
      // Reset form
      setFormData({
        procedure: '',
        diagnosis: '',
        history: '',
        admin_id: formData.admin_id, // Keep the current admin
        user: {
          name: '',
          email: '',
          password: '',
          password_confirmation: '',
          role: 'doctor'
        }
      });
    }
    
    // Redirect back to dashboard after a short delay
    setTimeout(() => {
      navigate('/admin/dashboard');
    }, 1500);
  } catch (err) {
    console.error('Form submission failed:', err);
    console.error('Error details:', err.response?.data);
    setError(err.response?.data?.message || 'Failed to save doctor. Please try again.');
  } finally {
    setLoading(false);
  }
};
  
  if ((loading && isEditMode) || fetchingAdmins) {
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
        <h1 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Doctor' : 'Add New Doctor'}</h1>
        
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
            {!isEditMode && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Doctor Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="user.name">
                      Full Name *
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="user.name"
                      type="text"
                      name="user.name"
                      placeholder="Doctor's Full Name"
                      value={formData.user.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="user.email">
                      Email *
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="user.email"
                      type="email"
                      name="user.email"
                      placeholder="doctor@example.com"
                      value={formData.user.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="user.password">
                      Password *
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="user.password"
                      type="password"
                      name="user.password"
                      placeholder="Password"
                      value={formData.user.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="user.password_confirmation">
                      Confirm Password *
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="user.password_confirmation"
                      type="password"
                      name="user.password_confirmation"
                      placeholder="Confirm Password"
                      value={formData.user.password_confirmation}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            
            <h3 className="text-lg font-semibold mb-4">Medical Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="admin_id">
                  Supervising Administrator *
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="admin_id"
                  name="admin_id"
                  value={formData.admin_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select an administrator</option>
                  {admins.map(admin => (
                    <option key={admin.id} value={admin.id}>
                      {admin.user?.name || `Admin #${admin.id}`}
                    </option>
                  ))}
                </select>
                {admins.length === 0 && (
                  <p className="text-red-500 text-xs italic mt-1">
                    No administrators found. Please register an administrator first.
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="procedure">
                  Specialization/Procedure *
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="procedure"
                  type="text"
                  name="procedure"
                  placeholder="E.g., Cardiology, Surgery, etc."
                  value={formData.procedure}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="diagnosis">
                  Primary Diagnosis Focus *
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="diagnosis"
                  type="text"
                  name="diagnosis"
                  placeholder="E.g., Heart Disease, Orthopedics, etc."
                  value={formData.diagnosis}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="history">
                  Professional Background *
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="history"
                  name="history"
                  rows="3"
                  placeholder="Brief professional background and experience"
                  value={formData.history}
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
                disabled={loading || admins.length === 0}
                className={`${
                  loading || admins.length === 0
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-700'
                } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
              >
                {loading ? 'Saving...' : isEditMode ? 'Update Doctor' : 'Add Doctor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorForm;