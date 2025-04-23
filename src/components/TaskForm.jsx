import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { addTask, updateTask, setError, setLoading } from '../store/taskSlice';
import apperService from '../services/apperService';

const TaskForm = ({ existingTask, onCancel }) => {
  const dispatch = useDispatch();
  const [formError, setFormError] = useState('');

  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
  });

  // Initialize form if editing an existing task
  useEffect(() => {
    if (existingTask) {
      setTaskData({
        title: existingTask.title || '',
        description: existingTask.description || '',
        dueDate: existingTask.dueDate || '',
        priority: existingTask.priority || 'medium',
      });
    }
  }, [existingTask]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({ ...prev, [name]: value }));
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!taskData.title.trim()) {
      setFormError('Task title is required');
      return;
    }
    
    dispatch(setLoading(true));
    
    try {
      if (existingTask) {
        // Update existing task
        const updatedTask = await apperService.updateTask(existingTask.Id, taskData);
        dispatch(updateTask(updatedTask));
      } else {
        // Create new task
        const newTask = await apperService.createTask(taskData);
        dispatch(addTask(newTask));
      }
      
      // Reset form after successful submission
      setTaskData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
      });
      
      if (onCancel) {
        onCancel();
      }
    } catch (error) {
      console.error('Task operation failed:', error);
      setFormError('Failed to save task. Please try again.');
      dispatch(setError('Task operation failed'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold mb-4">
        {existingTask ? 'Edit Task' : 'Add New Task'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
            Task Title*
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={taskData.title}
            onChange={handleInputChange}
            placeholder="What needs to be done?"
            className="input"
          />
          {formError && (
            <p className="mt-1 text-sm text-red-500">{formError}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={taskData.description}
            onChange={handleInputChange}
            placeholder="Add details about this task..."
            rows="3"
            className="input"
          ></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
              Due Date (Optional)
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={taskData.dueDate}
              onChange={handleInputChange}
              className="input"
            />
          </div>
          
          <div>
            <label htmlFor="priority" className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={taskData.priority}
              onChange={handleInputChange}
              className="input"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        
        <div className="flex gap-3 pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="btn btn-primary flex-1"
          >
            {existingTask ? 'Update Task' : 'Add Task'}
          </motion.button>
          
          {(existingTask || onCancel) && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onCancel}
              className="btn btn-outline"
            >
              Cancel
            </motion.button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TaskForm;