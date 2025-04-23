import { useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './store/userSlice';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import TaskList from './pages/TaskList';
import UserProfile from './pages/UserProfile';
import NotFound from './pages/NotFound';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  // Check for existing user session on application startup
  useEffect(() => {
    // Check if Apper SDK is loaded and user is logged in
    const checkAuthStatus = () => {
      if (window.ApperSDK) {
        const { ApperClient } = window.ApperSDK;
        
        // If there's a logged in user in ApperSDK, it will automatically
        // restore the session from cookies/local storage
        if (ApperClient.isLoggedIn) {
          // The SDK handles authentication tokens automatically
          // Set the user in Redux state from localStorage or sessionStorage
          const storedUser = localStorage.getItem('apperUser');
          if (storedUser) {
            try {
              const user = JSON.parse(storedUser);
              dispatch(setUser(user));
            } catch (error) {
              console.error('Error parsing stored user:', error);
            }
          }
        }
      }
    };

    // If SDK is already loaded, check auth status
    if (window.ApperSDK) {
      checkAuthStatus();
    } else {
      // If SDK is not yet loaded, wait for it
      const sdkInterval = setInterval(() => {
        if (window.ApperSDK) {
          checkAuthStatus();
          clearInterval(sdkInterval);
        }
      }, 100);

      // Clean up interval if component unmounts
      return () => clearInterval(sdkInterval);
    }
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        
        {/* Protected Routes */}
        <Route path="dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="tasks" element={
          <ProtectedRoute>
            <TaskList />
          </ProtectedRoute>
        } />
        
        <Route path="profile" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
        
        {/* Auth Routes */}
        <Route path="login" element={
          isAuthenticated ? <Navigate to="/" replace /> : <Login />
        } />
        
        <Route path="signup" element={
          isAuthenticated ? <Navigate to="/" replace /> : <Signup />
        } />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;