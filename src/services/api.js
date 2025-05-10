import axios from 'axios';

const API_URL = 'http://doctor-back.test/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add token to ALL requests
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage for every request
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 Unauthorized errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log error details for debugging
    console.error('API Error:', error.response?.status, error.response?.data);
    
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized response detected - logging out');
      // Handle token expiration or invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if not already on the login page to avoid redirect loops
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  register: (userData) => api.post('/register', userData),
  login: (credentials) => api.post('/login', credentials),
  logout: () => api.post('/logout'),
  getCurrentUser: () => api.get('/user'),
};

// Admin services
export const adminService = {
  createAdmin: (data) => api.post('/admins', data),
  getAdmins: () => api.get('/admins'),
  getAdmin: (id) => api.get(`/admins/${id}`),
  updateAdmin: (id, data) => api.put(`/admins/${id}`, data),
  deleteAdmin: (id) => api.delete(`/admins/${id}`),
};

// Doctor services
export const doctorService = {
  createDoctor: (data) => api.post('/doctors', data),
  getDoctors: () => api.get('/doctors'),
  getDoctor: (id) => api.get(`/doctors/${id}`),
  updateDoctor: (id, data) => api.put(`/doctors/${id}`, data),
  deleteDoctor: (id) => api.delete(`/doctors/${id}`),
};

// Patient services
export const patientService = {
  createPatient: (data) => api.post('/patients', data),
  getPatients: () => api.get('/patients'),
  getPatient: (id) => api.get(`/patients/${id}`),
  updatePatient: (id, data) => api.put(`/patients/${id}`, data),
  deletePatient: (id) => api.delete(`/patients/${id}`),
  getDoctorPatients: () => api.get('/doctor/patients'),

};

export default api;