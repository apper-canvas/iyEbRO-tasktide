import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { setUser, setError } from '../store/userSlice';
import apperService from '../services/apperService';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, error } = useSelector((state) => state.user);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    apperService.setupAuthUI({
      target: '#authentication',
      view: 'login',
      onSuccess: function(user) {
        dispatch(setUser(user));
        navigate('/');
      },
      onError: function(error) {
        console.error("Login failed:", error);
        dispatch(setError("Authentication failed. Please try again."));
      }
    });

    apperService.showLogin("#authentication");

    // Cleanup function
    return () => {
      const authElement = document.querySelector('#authentication');
      if (authElement) {
        authElement.innerHTML = '';
      }
    };
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl font-bold text-gradient"
          >
            Welcome to TaskTide
          </motion.h1>
          <p className="mt-2 text-surface-600 dark:text-surface-400">
            Sign in to manage your tasks
          </p>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div id="authentication" className="min-h-[400px] flex items-center justify-center"></div>

        <div className="text-center">
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Don't have an account?{' '}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
              className="text-primary dark:text-primary-light font-medium hover:underline"
            >
              Sign up
            </motion.button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;