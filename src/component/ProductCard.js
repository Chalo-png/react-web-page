import { useNavigate } from 'react-router-dom';
import { FaEdit, FaEye } from 'react-icons/fa';
import useAuthSession from '../utils/useAuthSession';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const user = useAuthSession();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative overflow-hidden bg-velvet-black rounded-xl shadow-xl hover:shadow-gold-glow transition-all duration-500 border border-gold/20"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-square">
        <LazyLoadImage
          src={product.image || '/images/placeholder.jpg'}
          alt={product.name}
          effect="opacity"
          className="w-full h-full object-cover transform transition-all duration-700 group-hover:scale-105"
          wrapperClassName="w-full h-full"
          placeholder={
            <div className="w-full h-full bg-gradient-to-br from-gold/10 to-black-pearl animate-pulse" />
          }
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Classification Badge */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute top-4 right-4 backdrop-blur-sm bg-black/40 rounded-full px-4 py-2 border border-gold/30"
        >
          <span className="text-sm text-gold font-light uppercase tracking-wider">
            {product.classification}
          </span>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="p-6 space-y-4">
        {/* Title & Price */}
        <div className="border-b border-gold/20 pb-4">
          <h3 className="font-cinzel text-xl text-gold truncate">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-gold/70 text-sm">Precio</span>
            <span className="font-cinzel text-xl bg-gradient-to-r from-gold to-gold-light bg-clip-text text-primary">
              ${product.discountPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Sizes */}
        {product.sizes?.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-gold/70">Tallas Disponibles</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <motion.span
                  key={size}
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-1.5 text-sm border border-gold/30 rounded-full text-gold/80 hover:text-gold hover:border-gold/50 transition-all"
                >
                  {size}
                </motion.span>
              ))}
            </div>
          </div>
        )}


        {/* Actions */}
        <div className="flex justify-between items-center pt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 bg-gradient-to-r from-gold/90 text-primary to-gold-light/90 px-6 py-2.5 rounded-full text-sm font-cinzel hover:opacity-90 transition-opacity"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <FaEye className="w-4 h-4" />
            Ver Detalles
          </motion.button>

          {user && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="p-2.5 rounded-full bg-black/40 backdrop-blur-sm border border-gold/30 hover:border-gold/50 text-gold hover:text-gold-light transition-all"
              onClick={() => navigate(`/edit/${product.id}`)}
            >
              <FaEdit className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>

      {/* New Arrival Ribbon */}
      {product.isNew && (
        <div className="absolute top-4 left-4 bg-gold text-black px-4 py-1.5 rounded-r-full text-xs font-cinzel uppercase tracking-wide shadow-md">
          New Arrival
        </div>
      )}
    </motion.div>
  );
}

export default ProductCard;