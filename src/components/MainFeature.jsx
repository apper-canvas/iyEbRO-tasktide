import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Edit, Trash2, Calendar, AlertCircle, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';

const MainFeature = ({ onTasksChange }) => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium'
  });
  
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    if (onTasksChange) {
      onTasksChange(tasks);
    }
  }, [tasks, onTasksChange]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
    setError('');
  };
  
  const handleAddTask = (e) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) {
      setError('Task title is required');
      return;
    }
    
    const task = {
      id: Date.now().toString(),
      ...newTask,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setTasks(prev => [task, ...prev]);
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium'
    });
  };
  
  const handleToggleComplete = (id) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() } 
          : task
      )
    );
  };
  
  const handleDeleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };
  
  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority
    });
  };
  
  const handleUpdateTask = (e) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) {
      setError('Task title is required');
      return;
    }
    
    setTasks(prev => 
      prev.map(task => 
        task.id === editingTask.id 
          ? { 
              ...task, 
              title: newTask.title,
              description: newTask.description,
              dueDate: newTask.dueDate,
              priority: newTask.priority,
              updatedAt: new Date().toISOString()
            } 
          : task
      )
    );
    
    setEditingTask(null);
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium'
    });
  };
  
  const cancelEdit = () => {
    setEditingTask(null);
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium'
    });
    setError('');
  };
  
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });
  
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityValues = { high: 3, medium: 2, low: 1 };
      const comparison = priorityValues[a.priority] - priorityValues[b.priority];
      return sortDirection === 'asc' ? comparison : -comparison;
    }
    
    if (sortBy === 'dueDate') {
      if (!a.dueDate) return sortDirection === 'asc' ? 1 : -1;
      if (!b.dueDate) return sortDirection === 'asc' ? -1 : 1;
      const comparison = new Date(a.dueDate) - new Date(b.dueDate);
      return sortDirection === 'asc' ? comparison : -comparison;
    }
    
    // Default sort by createdAt
    const comparison = new Date(a.createdAt) - new Date(b.createdAt);
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
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
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-6"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editingTask ? 'Edit Task' : 'Add New Task'}
        </h2>
        
        <form onSubmit={editingTask ? handleUpdateTask : handleAddTask} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
              Task Title*
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={newTask.title}
              onChange={handleInputChange}
              placeholder="What needs to be done?"
              className="input"
            />
            {error && (
              <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={newTask.description}
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
                value={newTask.dueDate}
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
                value={newTask.priority}
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
              {editingTask ? 'Update Task' : 'Add Task'}
            </motion.button>
            
            {editingTask && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={cancelEdit}
                className="btn btn-outline"
              >
                Cancel
              </motion.button>
            )}
          </div>
        </form>
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
        
        <div className="divide-y divide-surface-200 dark:divide-surface-700">
          <AnimatePresence>
            {sortedTasks.length > 0 ? (
              sortedTasks.map(task => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 flex flex-col gap-3"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleComplete(task.id)}
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
                        onClick={() => handleEditTask(task)}
                        className="p-1.5 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500 hover:text-primary dark:text-surface-400 dark:hover:text-primary-light transition-colors"
                      >
                        <Edit size={16} />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500 hover:text-red-500 dark:text-surface-400 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
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
      </motion.div>
    </div>
  );
};

export default MainFeature;