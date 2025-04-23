import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, CheckSquare, User, LogOut, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../store/userSlice';
import apperService from '../services/apperService';

const Sidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      await apperService.logout();
      dispatch(clearUser());
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '-100%', opacity: 0 },
  };

  const overlayVariants = {
    open: { opacity: 0.5 },
    closed: { opacity: 0 },
  };

  const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
        ${isActive 
          ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light' 
          : 'hover:bg-surface-100 dark:hover:bg-surface-700'}
      `}
      onClick={() => onClose?.()}
    >
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 bg-black z-20 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Always visible on large screens */}
      <motion.aside
        className="fixed lg:static top-0 left-0 z-30 h-full lg:h-auto w-64 bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 overflow-auto lg:block"
        initial={isOpen ? "open" : "closed"}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="p-4 flex justify-between items-center lg:hidden">
          <span className="font-bold text-xl text-primary">TaskTide</span>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-1">
          <NavItem to="/" icon={Home} label="Home" />
          
          {isAuthenticated && (
            <>
              <NavItem to="/tasks" icon={CheckSquare} label="Tasks" />
              <NavItem to="/profile" icon={User} label="Profile" />
              
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          )}
        </nav>
      </motion.aside>
    </>
  );
};

export default Sidebar;