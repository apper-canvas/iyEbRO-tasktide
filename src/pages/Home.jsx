import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainFeature from '../components/MainFeature';

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [stats, setStats] = useState({
    completed: 0,
    pending: 0,
    total: 0
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Update stats when tasks change
  const updateStats = (tasks) => {
    const completed = tasks.filter(task => task.completed).length;
    setStats({
      completed,
      pending: tasks.length - completed,
      total: tasks.length
    });
  };

  return (
    <AnimatePresence>
      {isLoaded ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
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
              className="text-lg text-surface-600 dark:text-surface-300"
            >
              Create, organize, and track your tasks with our intuitive interface.
            </motion.p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="neu-card"
            >
              <h3 className="text-2xl font-bold text-center mb-2">{stats.total}</h3>
              <p className="text-center text-surface-500 dark:text-surface-400">Total Tasks</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="neu-card"
            >
              <h3 className="text-2xl font-bold text-center mb-2 text-secondary">{stats.completed}</h3>
              <p className="text-center text-surface-500 dark:text-surface-400">Completed</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="neu-card"
            >
              <h3 className="text-2xl font-bold text-center mb-2 text-primary">{stats.pending}</h3>
              <p className="text-center text-surface-500 dark:text-surface-400">Pending</p>
            </motion.div>
          </section>

          <MainFeature onTasksChange={updateStats} />
        </motion.div>
      ) : (
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-surface-200 dark:border-surface-700 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Home;