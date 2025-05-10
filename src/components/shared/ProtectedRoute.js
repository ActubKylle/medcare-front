import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ allowedRoles }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  
  useEffect(() => {
    const checkAuthentication = () => {
      try {
        // Get stored token and user data
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');
        
        console.log(`ProtectedRoute: Checking auth for path ${location.pathname}`);
        console.log(`ProtectedRoute: Token exists: ${!!token}`);
        
        if (!token || !userString) {
          console.log('No token or user found in localStorage');
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        // Set token in axios defaults for all future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Parse user data
        const userData = JSON.parse(userString);
        setUser(userData);
        setIsAuthenticated(true);
        setIsLoading(false);
        
        console.log(`ProtectedRoute: User authenticated as ${userData.role}`);
      } catch (error) {
        console.error('Authentication check failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };
    
    // Run authentication check
    checkAuthentication();
    
    // Add an event listener for storage changes to handle logout in other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'token' && !e.newValue) {
        // Token was removed in another tab
        setIsAuthenticated(false);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location.pathname]);
  
  // Show loading indicator
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If roles are specified, check user role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log(`Unauthorized role: ${user.role}, required: ${allowedRoles.join(', ')}`);
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }
  
  // If authenticated and authorized, render the protected component
  return <Outlet />;
};

export default ProtectedRoute;