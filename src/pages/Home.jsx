import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks, setLoading, setError } from '../store/taskSlice';
import apperService from '../services/apperService';
import Dashboard from './Dashboard';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  const { tasks, stats, loading } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchTasks = async () => {
        dispatch(setLoading(true));
        try {
          const taskData = await apperService.fetchTasks();
          dispatch(setTasks(taskData));
        } catch (err) {
          console.error('Error fetching tasks:', err);
          dispatch(setError('Failed to load tasks. Please try again.'));
        }
      };

      fetchTasks();
    }
  }, [isAuthenticated, dispatch]);

  if (!isAuthenticated) {
    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <section className="text-center max-w-3xl mx-auto mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="font-bold mb-4 text-gradient"
            >
              Organize Your Day with TaskTide
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg text-surface-600 dark:text-surface-300 mb-8"
            >
              Create, organize, and track your tasks with our intuitive interface.
            </motion.p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="btn btn-primary px-6 py-3"
              >
                Sign In
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/signup')}
                className="btn btn-outline px-6 py-3"
              >
                Create Account
              </motion.button>
            </div>
          </section>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="card p-6 text-center">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Tasks</h3>
              <p className="text-surface-600 dark:text-surface-400">
                Easily add new tasks with titles, descriptions, due dates, and priority levels.
              </p>
            </div>
            
            <div className="card p-6 text-center">
              <div className="bg-secondary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Organize</h3>
              <p className="text-surface-600 dark:text-surface-400">
                Sort and filter your tasks by various criteria to stay organized.
              </p>
            </div>
            
            <div className="card p-6 text-center">
              <div className="bg-accent/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Complete</h3>
              <p className="text-surface-600 dark:text-surface-400">
                Track your progress and mark tasks as completed when finished.
              </p>
            </div>
          </div>
          
          <div className="card p-8 bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-surface-600 dark:text-surface-300 mb-6 max-w-xl mx-auto">
              Join TaskTide today and take control of your tasks, boost your productivity, and achieve your goals.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
              className="btn btn-primary px-6 py-3"
            >
              Create Free Account
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return <Dashboard />;
};

export default Home;