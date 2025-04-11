import { motion } from 'framer-motion';
import { FaShoppingBag } from 'react-icons/fa';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-base-100 text-base-content/80 py-12 border-t border-primary/20 mt-4"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col items-center gap-6">
          {/* Branding */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 group cursor-pointer"
            onClick={() => navigate('/')}
          >
            <FaShoppingBag className="text-xl text-primary animate-pulse" />
            <span className="font-cinzel text-lg text-primary animate-pulse">
              Monaco Talagante
            </span>
          </motion.div>

          {/* Divider */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent my-4" />

          {/* Copyright */}
          <p className="text-sm font-light text-center">
            © {new Date().getFullYear()} Monaco Talagante<br />
            <span className="text-base-content/60">Catálogo exclusivo para clientes selectos</span>
          </p>

          {/* Social Links */}
          <div className="flex gap-6 mt-4">
            <motion.a
              whileHover={{ y: -2 }}
              href="https://www.instagram.com/tienda.monaco.talagante/"
              className="text-base-content/60 hover:text-primary transition-colors flex items-center gap-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="text-lg" />
              <span>Instagram</span>
            </motion.a>

            <motion.a
              whileHover={{ y: -2 }}
              href="https://wa.me/56991687712"
              className="text-base-content/60 hover:text-primary transition-colors flex items-center gap-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp className="text-lg" />
              <span>Contacto</span>
            </motion.a>
          </div>

          {/* Legal Links <div className="flex gap-4 mt-6 text-xs text-base-content/50">
            <a href="/politicas-privacidad" className="hover:text-primary transition-colors">
              Políticas de privacidad
            </a>
            <span>•</span>
            <a href="/terminos-servicio" className="hover:text-primary transition-colors">
              Términos de servicio
            </a>
          </div>*/}
          
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;