import { FaSearch, FaShoppingBag, FaBars, FaTimes, FaMoon, FaSun } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { logout } from '../utils/auth';
import useAuthSession from '../utils/useAuthSession';
import { useEffect, useState } from 'react';

function Navbar({ searchTerm, setSearchTerm }) {



  const navigate = useNavigate();
  const user = useAuthSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // 1. Verificar localStorage primero
    const savedTheme = localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    // 2. Aplicar el tema al documento
    document.documentElement.setAttribute('data-theme', savedTheme);
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';

    // 3. Guardar en localStorage
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    setTheme(newTheme);
  };
  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Catálogo', path: '/catalog' },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-base-100 text-base-content px-4 sm:px-8 py-4 border-b border-primary/20 sticky top-0 z-50 shadow-sm backdrop-blur-lg mb-4"
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left Section - Brand & Mobile Menu */}
        <div className="flex items-center justify-between w-full lg:w-auto">
  {/* Izquierda: Hamburguesa + Nombre */}
  <div className="flex items-center gap-3">
    <button
      className="lg:hidden text-primary p-2 hover:text-primary/80 transition-colors"
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    >
      {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
    </button>

    <motion.button
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-2 group"
      onClick={() => navigate('/')}
    >
      <FaShoppingBag className="text-2xl text-primary transition-transform group-hover:rotate-12" />
      <span className="font-cinzel text-xl text-primary">
        Monaco Talagante
      </span>
    </motion.button>
  </div>

  {/* Derecha: Modo claro/oscuro */}
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="btn btn-ghost btn-circle lg:hidden"
    onClick={toggleTheme}
    aria-label="Cambiar tema"
  >
    {theme === 'light' ? (
      <FaMoon className="w-5 h-5 text-base-content" />
    ) : (
      <FaSun className="w-5 h-5 text-base-content" />
    )}
  </motion.button>
</div>


        {/* Center Section - Navigation Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-8 mx-8">
          {navLinks.map((link) => (
            <motion.button
              key={link.name}
              whileHover={{ y: -2 }}
              className="text-base-content/80 hover:text-primary text-sm uppercase tracking-wider transition-colors"
              onClick={() => {
                navigate(link.path);
                setIsMobileMenuOpen(false);
              }}
            >
              {link.name}
            </motion.button>
          ))}
        </div>

        {/* Right Section - Search & Auth */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          {/* Search Bar */}
          <motion.div
            className="hidden md:flex relative w-full max-w-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <input
              type="text"
              placeholder="Buscar por descripción o código..."
              className="w-full pl-6 pr-12 py-2 bg-base-200 border border-primary/30 rounded-full focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-base-content/40 transition-all duration-300 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/buscar?query=${encodeURIComponent(searchTerm)}`);
                  setIsMobileMenuOpen(false);
                }
              }}
            />
            <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/60" />
          </motion.div>

          {/* Auth Section */}
          <div className="hidden lg:flex items-center gap-4 ml-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="btn btn-ghost btn-circle"
              onClick={toggleTheme}
              aria-label="Cambiar tema"
            >
              {theme === 'light' ? (
                <FaMoon className="w-5 h-5 text-base-content" />
              ) : (
                <FaSun className="w-5 h-5 text-base-content" />
              )}
            </motion.button>
            {user ? (
              <>
                <motion.div
                  className="text-sm text-base-content/70 hidden xl:inline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Bienvenido,{' '}
                  <span className="font-medium text-primary">
                    {user.displayName || user.email}
                  </span>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 border border-primary/30 rounded-full text-sm hover:bg-primary/10 transition-all"
                  onClick={() => navigate('/admin/panel')}
                >
                  Panel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-primary text-primary-content rounded-full text-sm hover:opacity-90 transition-opacity"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 border border-primary/30 rounded-full text-sm hover:bg-primary/10 transition-all"
                onClick={() => navigate('/admin')}
              >
                Iniciar sesión
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden mt-4 space-y-4 bg-base-100 rounded-lg p-4 shadow-lg"
          >
            {/* Search Bar Mobile */}
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  className="text-base-content/80 hover:text-primary py-2 text-sm uppercase border-b border-base-200"
                  onClick={() => {
                    navigate(link.path);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {link.name}
                </button>
              ))}
            </div>
            <div className="flex md:hidden relative w-full">
              <input
                type="text"
                placeholder="Buscar por descripción o código..."
                className="w-full pl-6 pr-12 py-2 bg-base-200 border border-primary/30 rounded-full focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-base-content/40 transition-all duration-300 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/buscar?query=${encodeURIComponent(searchTerm)}`);
                    setIsMobileMenuOpen(false);
                  }
                }}
              />
              <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/60" />
            </div>

            <div className="pt-4 border-t border-base-200">
              {user ? (
                <>
                  <button
                    className="w-full py-3 text-center border border-primary/30 rounded-lg mb-2 hover:bg-primary/10"
                    onClick={() => navigate('/admin/panel')}
                  >
                    Panel
                  </button>
                  <button
                    className="w-full py-3 text-center bg-primary text-primary-content rounded-lg hover:opacity-90"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <button
                  className="w-full py-3 text-center bg-primary text-primary-content rounded-lg hover:opacity-90"
                  onClick={() => navigate('/admin')}
                >
                  Iniciar sesión
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
export default Navbar;