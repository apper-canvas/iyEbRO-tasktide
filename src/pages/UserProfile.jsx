import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { User, Shield, Mail, Phone, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { clearUser } from '../store/userSlice';
import apperService from '../services/apperService';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await apperService.logout();
      dispatch(clearUser());
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <section className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="font-bold mb-4 text-gradient"
          >
            User Profile
          </motion.h1>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6 text-center lg:col-span-1"
          >
            <div className="flex justify-center mb-4">
              {user?.AvatarUrl ? (
                <img 
                  src={user.AvatarUrl} 
                  alt={`${user.firstName} ${user.lastName}`} 
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold border-4 border-primary">
                  {user?.firstName?.[0] || 'U'}
                </div>
              )}
            </div>
            
            <h2 className="text-xl font-semibold">
              {user?.firstName} {user?.lastName}
            </h2>
            
            <p className="text-surface-500 dark:text-surface-400 mt-1">
              {user?.emailAddress}
            </p>
            
            <div className="mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="btn btn-outline w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-300 dark:border-red-700"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6 lg:col-span-2"
          >
            <h2 className="text-xl font-semibold mb-6">Account Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-3 rounded-lg bg-surface-100 dark:bg-surface-800">
                <User className="mt-1 text-primary" size={20} />
                <div>
                  <h3 className="font-medium">Personal Information</h3>
                  <p className="text-surface-600 dark:text-surface-400 text-sm mt-1">
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-3 rounded-lg bg-surface-100 dark:bg-surface-800">
                <Mail className="mt-1 text-primary" size={20} />
                <div>
                  <h3 className="font-medium">Email Address</h3>
                  <p className="text-surface-600 dark:text-surface-400 text-sm mt-1">
                    {user?.emailAddress}
                    {user?.IsEmailVerified && (
                      <span className="ml-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                  </p>
                </div>
              </div>
              
              {user?.Phone && (
                <div className="flex items-start gap-4 p-3 rounded-lg bg-surface-100 dark:bg-surface-800">
                  <Phone className="mt-1 text-primary" size={20} />
                  <div>
                    <h3 className="font-medium">Phone Number</h3>
                    <p className="text-surface-600 dark:text-surface-400 text-sm mt-1">
                      {user.Phone}
                      {user?.IsPhoneVerified && (
                        <span className="ml-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs px-2 py-0.5 rounded-full">
                          Verified
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )}
              
              {user?.IsTwoFactorEnabled && (
                <div className="flex items-start gap-4 p-3 rounded-lg bg-surface-100 dark:bg-surface-800">
                  <Shield className="mt-1 text-primary" size={20} />
                  <div>
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <p className="text-surface-600 dark:text-surface-400 text-sm mt-1">
                      Enabled ({user.MfaMethod || 'Authenticator'})
                    </p>
                  </div>
                </div>
              )}
              
              {user?.LastLoginDate && (
                <div className="flex items-start gap-4 p-3 rounded-lg bg-surface-100 dark:bg-surface-800">
                  <Calendar className="mt-1 text-primary" size={20} />
                  <div>
                    <h3 className="font-medium">Last Login</h3>
                    <p className="text-surface-600 dark:text-surface-400 text-sm mt-1">
                      {format(new Date(user.LastLoginDate), 'PPpp')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;