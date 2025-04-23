import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks, setLoading, setError } from '../store/taskSlice';
import apperService from '../services/apperService';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.tasks);
  
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      dispatch(setLoading(true));
      try {
        // Construct orderBy parameter based on current sort settings
        let orderBy = [];
        switch (sortBy) {
          case 'priority':
            // Sorting by priority is handled client-side
            orderBy = [{ field: 'createdAt', direction: sortDirection }];
            break;
          case 'dueDate':
            orderBy = [{ field: 'dueDate', direction: sortDirection }];
            break;
          default:
            orderBy = [{ field: 'createdAt', direction: sortDirection }];
        }

        // Construct filter parameter based on current filter
        let filterParam = undefined;
        if (filter === 'completed') {
          filterParam = { completed: true };
        } else if (filter === 'pending') {
          filterParam = { completed: false };
        }

        const taskData = await apperService.fetchTasks({
          orderBy,
          filter: filterParam,
        });

        dispatch(setTasks(taskData));
      } catch (err) {
        console.error('Error fetching tasks:', err);
        dispatch(setError('Failed to load tasks. Please try again.'));
      }
    };

    fetchTasks();
  }, [dispatch, filter, sortBy, sortDirection]);

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingTask(null);
  };

  // If priority is the sort key, we need to sort client-side
  const sortedTasks = [...tasks];
  if (sortBy === 'priority') {
    sortedTasks.sort((a, b) => {
      const priorityValues = { high: 3, medium: 2, low: 1 };
      const comparison = priorityValues[a.priority] - priorityValues[b.priority];
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <TaskForm existingTask={editingTask} onCancel={cancelEdit} />
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <div className="p-4 border-b border-surface-200 dark:border-surface-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Your Tasks</h2>
          
          <div className="flex flex-wrap gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 text-sm"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            
            <div className="flex items-center gap-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 text-sm"
              >
                <option value="createdAt">Date Created</option>
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
              </select>
              
              <button
                onClick={toggleSortDirection}
                className="p-1.5 rounded-lg bg-surface-100 dark:bg-surface-700 border border-surface-200 dark:border-surface-600"
              >
                {sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>
        </div>

        {loading && tasks.length === 0 ? (
          <div className="p-8 flex justify-center">
            <div className="relative w-12 h-12">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-surface-200 dark:border-surface-700 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">
            <AlertCircle size={24} className="mx-auto mb-2" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-200 dark:divide-surface-700">
            <AnimatePresence>
              {sortedTasks.length > 0 ? (
                sortedTasks.map(task => (
                  <TaskCard key={task.Id} task={task} onEdit={handleEditTask} />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 text-center"
                >
                  <div className="flex justify-center mb-3">
                    <AlertCircle size={24} className="text-surface-400" />
                  </div>
                  <h3 className="text-lg font-medium text-surface-600 dark:text-surface-400">No tasks found</h3>
                  <p className="text-surface-500 dark:text-surface-500 mt-1">
                    {filter !== 'all' 
                      ? `No ${filter} tasks available. Try changing your filter.` 
                      : "You don't have any tasks yet. Add one above!"}
                  </p>
                  
                  {filter !== 'all' && (
                    <button
                      onClick={() => setFilter('all')}
                      className="mt-4 btn btn-outline text-sm"
                    >
                      Show all tasks
                    </button>
                  )}
                  
                  {filter === 'all' && tasks.length === 0 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => document.getElementById('title').focus()}
                      className="mt-4 btn btn-primary text-sm inline-flex items-center gap-1"
                    >
                      <Plus size={16} />
                      Add your first task
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TaskList;