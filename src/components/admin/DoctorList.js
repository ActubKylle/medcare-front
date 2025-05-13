// src/components/admin/DoctorList.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorService } from '../../services/api';
import Navbar from '../shared/Navbar';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await doctorService.getDoctors();
        setDoctors(response.data);
        setFilteredDoctors(response.data);
      } catch (err) {
        setError('Failed to fetch doctors. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctors();
  }, []);

   useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDoctors(doctors);
      return;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    const results = doctors.filter(doctor => {
      const doctorName = doctor.user?.name || doctor.admin?.user?.name || '';
      return (
        doctorName.toLowerCase().includes(lowerSearchTerm) ||
        doctor.procedure?.toLowerCase().includes(lowerSearchTerm) ||
        doctor.diagnosis?.toLowerCase().includes(lowerSearchTerm)
      );
    });
    
    setFilteredDoctors(results);
  }, [searchTerm, doctors]);


  const handleDeleteDoctor = (id) => {
    if (window.confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) {
      doctorService.deleteDoctor(id)
        .then(() => {
          setDoctors(doctors.filter(doctor => doctor.id !== id));
        })
        .catch(err => {
          console.error('Failed to delete doctor:', err);
          setError('Failed to delete doctor. Please try again.');
        });
    }
  };

    return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">All Doctors</h1>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Back to Dashboard
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search doctors by name, specialization, or expertise..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="mt-2 text-sm text-gray-600">
              Found {filteredDoctors.length} {filteredDoctors.length === 1 ? 'doctor' : 'doctors'} matching "{searchTerm}"
            </p>
          )}
        </div>
        
        <div className="mb-8 flex flex-wrap gap-4">
          <button
            onClick={() => navigate('/admin/doctors/add')}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-300 shadow-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Doctor
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            {filteredDoctors.length === 0 ? (
              <div className="text-center py-8">
                {searchTerm ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-500">No doctors found matching your search.</p>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="mt-4 text-blue-500 hover:text-blue-700 font-medium"
                    >
                      Clear search
                    </button>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-gray-500">No doctors found.</p>
                    <button
                      onClick={() => navigate('/admin/doctors/add')}
                      className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
                    >
                      Add Your First Doctor
                    </button>
                  </>
                )}
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
                    {filteredDoctors.map(doctor => (
                      <tr key={doctor.id} className="text-gray-700 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 font-medium">{doctor.user?.name || doctor.admin?.user?.name || `Doctor #${doctor.id}`}</td>
                        <td className="px-4 py-4">{doctor.procedure}</td>
                        <td className="px-4 py-4">{doctor.diagnosis}</td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => navigate(`/admin/doctors/${doctor.id}/edit`)}
                              className="text-green-500 hover:text-green-700 transition-colors"
                              title="Edit Doctor"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleDeleteDoctor(doctor.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Delete Doctor"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
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
        )}
      </div>
    </div>
  );
};

export default DoctorList;