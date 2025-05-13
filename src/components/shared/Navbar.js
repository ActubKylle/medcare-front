import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Use location to determine current path
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  
  const handleLogout = async () => {
    try {
      await authService.logout();
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Helper function to check if link is active
  const isActive = (path) => {
    // For dashboard links, check exact match
    if (path.endsWith('dashboard')) {
      return location.pathname === path;
    }
    // For other links, check if the current path starts with the link path
    return location.pathname.startsWith(path);
  };

  // CSS classes for active and inactive links
  const activeLinkClass = "text-white bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center";
  const inactiveLinkClass = "text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center";
  
  // Mobile menu active/inactive classes
  const activeMobileLinkClass = "block px-4 py-2 text-white bg-blue-700 rounded-md text-base font-medium";
  const inactiveMobileLinkClass = "block px-4 py-2 text-white hover:bg-blue-700 rounded-md text-base font-medium";

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => user && (user.role === 'admin' ? navigate('/admin/dashboard') : navigate('/doctor/dashboard'))}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <span className="text-white font-bold text-xl">MediCare</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {user && (
              <>
                <div className="px-4 py-2 text-white font-medium">
                  Welcome, <span className="font-bold">{user.name}</span>
                  <span className="ml-2 bg-blue-900 text-white text-xs py-1 px-2 rounded-full">{user.role}</span>
                </div>
                
                {user.role === 'admin' && (
                  <div className="flex items-center">
                    <a
                      href="/admin/dashboard"
                      className={isActive('/admin/dashboard') ? activeLinkClass : inactiveLinkClass}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/admin/dashboard');
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                      Dashboard
                    </a>
                    <a
                      href="/admin/patients"
                      className={isActive('/admin/patients') ? activeLinkClass : inactiveLinkClass}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/admin/patients');
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      Patients 
                    </a>
                    <a
                      href="/admin/doctors"
                      className={isActive('/admin/doctors') ? activeLinkClass : inactiveLinkClass}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/admin/doctors');
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      Doctors
                    </a>
                  </div>
                )}
                
                {user.role === 'doctor' && (
                  <div className="flex items-center">
                    <a
                      href="/doctor/dashboard"
                      className={isActive('/doctor/dashboard') ? activeLinkClass : inactiveLinkClass}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/doctor/dashboard');
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                      Dashboard
                    </a>
                    <a
                      href="/doctor/patients"
                      className={isActive('/doctor/patients') ? activeLinkClass : inactiveLinkClass}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/doctor/patients');
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      Patients
                    </a>
                  </div>
                )}
                
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center ml-4"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414a1 1 0 00-.293-.707L11.414 2.414A1 1 0 0010.707 2H4a1 1 0 00-1 1zm9 3a1 1 0 01-1-1V2.414l3.293 3.293-2 2A1.003 1.003 0 019 6z" clipRule="evenodd" />
                  </svg>
                  Logout
                </button>
              </>
            )}
            
            {!user && (
              <div className="flex items-center space-x-4">
                <a
                  href="/login"
                  className={isActive('/login') ? activeLinkClass : inactiveLinkClass}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/login');
                  }}
                >
                  Login
                </a>
                <a
                  href="/register"
                  className={isActive('/register') 
                    ? "bg-blue-700 text-white hover:bg-blue-800 px-4 py-2 rounded-md text-sm font-medium transition-colors" 
                    : "bg-white text-blue-700 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/register');
                  }}
                >
                  Register
                </a>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-2 pb-4 border-t border-blue-400">
            {user ? (
              <div>
                <div className="px-4 py-3 text-white font-medium border-b border-blue-400">
                  Welcome, <span className="font-bold">{user.name}</span>
                  <span className="ml-2 bg-blue-900 text-white text-xs py-1 px-2 rounded-full">{user.role}</span>
                </div>
                
                {user.role === 'admin' && (
                  <div className="space-y-1 mt-2">
                    <a
                      href="/admin/dashboard"
                      className={isActive('/admin/dashboard') ? activeMobileLinkClass : inactiveMobileLinkClass}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/admin/dashboard');
                        setMobileMenuOpen(false);
                      }}
                    >
                      Dashboard
                    </a>
                    <a
                      href="/admin/patients"
                      className={isActive('/admin/patients') ? activeMobileLinkClass : inactiveMobileLinkClass}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/admin/patients');
                        setMobileMenuOpen(false);
                      }}
                    >
                      Patients
                    </a>
                    <a
                      href="/admin/doctors"
                      className={isActive('/admin/doctors') ? activeMobileLinkClass : inactiveMobileLinkClass}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/admin/doctors');
                        setMobileMenuOpen(false);
                      }}
                    >
                      Doctors
                    </a>
                  </div>
                )}
                
                {user.role === 'doctor' && (
                  <div className="space-y-1 mt-2">
                    <a
                      href="/doctor/dashboard"
                      className={isActive('/doctor/dashboard') ? activeMobileLinkClass : inactiveMobileLinkClass}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/doctor/dashboard');
                        setMobileMenuOpen(false);
                      }}
                    >
                      Dashboard
                    </a>
                    <a
                      href="/doctor/patients"
                      className={isActive('/doctor/patients') ? activeMobileLinkClass : inactiveMobileLinkClass}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/doctor/patients');
                        setMobileMenuOpen(false);
                      }}
                    >
                      Patients
                    </a>
                  </div>
                )}
                
                <div className="mt-4 px-4">
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414a1 1 0 00-.293-.707L11.414 2.414A1 1 0 0010.707 2H4a1 1 0 00-1 1zm9 3a1 1 0 01-1-1V2.414l3.293 3.293-2 2A1.003 1.003 0 019 6z" clipRule="evenodd" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 px-4 pt-2">
                <a
                  href="/login"
                  className={isActive('/login') ? activeMobileLinkClass : inactiveMobileLinkClass}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                >
                  Login
                </a>
                <a
                  href="/register"
                  className={isActive('/register') 
                    ? "block bg-blue-700 text-white px-3 py-2 rounded-md text-base font-medium" 
                    : "block bg-white text-blue-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/register');
                    setMobileMenuOpen(false);
                  }}
                >
                  Register
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;