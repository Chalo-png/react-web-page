import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaLock } from 'react-icons/fa';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate(from);
    } catch (err) {
      setError('Invalid credentials - please try again');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-rich-black text-gold p-4"
    >
      <motion.form
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onSubmit={handleLogin}
        className="bg-velvet-black border border-gold/20 rounded-xl p-8 sm:p-12 shadow-gold-glow w-full max-w-md backdrop-blur-lg relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-gold-light" />
        <FaShieldAlt className="text-gold/10 absolute -top-8 -right-8 text-32" size={128} />

        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center mb-8"
          >
            <FaLock className="text-gold mb-4" size={32} />
            <h2 className="text-3xl font-cinzel text-center bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              Monaco Administration
            </h2>
            <p className="text-gold/60 text-sm mt-2">Exclusive Access Portal</p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-3 bg-gold/10 border border-gold/20 rounded-lg text-gold text-sm flex items-center gap-2"
            >
              <FaShieldAlt className="flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-cinzel text-gold/80 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-base-200 border border-gold/20 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/30 placeholder:text-gold/40"
                placeholder="administrator@monaco.com"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-cinzel text-gold/80 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-base-200 border border-gold/20 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/30 placeholder:text-gold/40"
                placeholder="••••••••"
                required
              />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-gold/90 to-gold-light/80 text-primary rounded-lg font-cinzel hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <FaLock className="flex-shrink-0" />
              Authenticate Access
            </motion.button>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
}

export default AdminLogin;