import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Check, Edit, Trash2, Calendar } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { updateTask, removeTask, setError } from '../store/taskSlice';
import apperService from '../services/apperService';

const TaskCard = ({ task, onEdit }) => {
  const dispatch = useDispatch();

  const handleToggleComplete = async () => {
    try {
      const updatedTask = await apperService.toggleTaskCompletion(task.Id, task.completed);
      dispatch(updateTask(updatedTask));
    } catch (error) {
      console.error('Error toggling task completion:', error);
      dispatch(setError('Failed to update task status'));
    }
  };

  const handleDelete = async () => {
    try {
      await apperService.deleteTask(task.Id);
      dispatch(removeTask(task.Id));
    } catch (error) {
      console.error('Error deleting task:', error);
      dispatch(setError('Failed to delete task'));
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500 dark:text-red-400';
      case 'medium': return 'text-amber-500 dark:text-amber-400';
      case 'low': return 'text-green-500 dark:text-green-400';
      default: return 'text-surface-500 dark:text-surface-400';
    }
  };

  const getPriorityBg = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 dark:bg-red-900/20';
      case 'medium': return 'bg-amber-100 dark:bg-amber-900/20';
      case 'low': return 'bg-green-100 dark:bg-green-900/20';
      default: return 'bg-surface-100 dark:bg-surface-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="p-4 flex flex-col gap-3 border-b border-surface-200 dark:border-surface-700 last:border-0"
    >
      <div className="flex items-start gap-3">
        <button
          onClick={handleToggleComplete}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            task.completed 
              ? 'bg-secondary border-secondary text-white' 
              : 'border-surface-300 dark:border-surface-600 hover:border-secondary'
          }`}
        >
          {task.completed && <Check size={14} />}
        </button>
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium break-words ${
            task.completed ? 'line-through text-surface-400 dark:text-surface-500' : ''
          }`}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className={`mt-1 text-sm break-words ${
              task.completed ? 'text-surface-400 dark:text-surface-500' : 'text-surface-600 dark:text-surface-400'
            }`}>
              {task.description}
            </p>
          )}
          
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className={`px-2 py-1 rounded-full ${getPriorityBg(task.priority)} ${getPriorityColor(task.priority)}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
            
            {task.dueDate && (
              <span className="flex items-center gap-1 text-surface-500 dark:text-surface-400">
                <Calendar size={12} />
                {format(new Date(task.dueDate), 'MMM d, yyyy')}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500 hover:text-primary dark:text-surface-400 dark:hover:text-primary-light transition-colors"
          >
            <Edit size={16} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            className="p-1.5 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500 hover:text-red-500 dark:text-surface-400 dark:hover:text-red-400 transition-colors"
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;