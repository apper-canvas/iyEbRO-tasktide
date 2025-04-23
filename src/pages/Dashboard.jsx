import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks, setLoading, setError } from '../store/taskSlice';
import apperService from '../services/apperService';
import TaskForm from '../components/TaskForm';
import Chart from 'react-apexcharts';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { tasks, stats, loading, error } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.user);
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
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
  }, [dispatch]);

  useEffect(() => {
    // Update chart options when tasks change
    setChartOptions({
      chart: {
        type: 'donut',
        background: 'transparent',
      },
      colors: ['#10B981', '#F59E0B'],
      labels: ['Completed', 'Pending'],
      legend: {
        position: 'bottom',
        labels: {
          colors: document.documentElement.classList.contains('dark') ? '#D1D5DB' : '#4B5563',
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              name: {
                show: true,
              },
              value: {
                show: true,
                formatter: (val) => val,
              },
              total: {
                show: true,
                formatter: () => stats.total,
                label: 'Total',
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 300,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    });
  }, [stats, tasks]);

  return (
    <AnimatePresence>
      {loading && tasks.length === 0 ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-surface-200 dark:border-surface-700 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <section className="text-center max-w-3xl mx-auto mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="font-bold mb-4 text-gradient"
            >
              Welcome, {user?.firstName || 'User'}!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg text-surface-600 dark:text-surface-300"
            >
              Organize, track and complete your tasks efficiently
            </motion.p>
          </section>

          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg">
              {error}
            </div>
          )}

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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-6"
            >
              <h2 className="text-xl font-semibold mb-6">Task Status</h2>
              <div className="h-64">
                {stats.total > 0 ? (
                  <Chart
                    options={chartOptions}
                    series={[stats.completed, stats.pending]}
                    type="donut"
                    height="100%"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-surface-500 dark:text-surface-400">No tasks to display</p>
                  </div>
                )}
              </div>
            </motion.div>

            <TaskForm />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Dashboard;