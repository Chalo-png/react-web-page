import ProductCard from './ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FaSort, FaSortAmountDown, FaSortAmountUp, FaSortAlphaDown, FaSortAlphaUp } from 'react-icons/fa';

export default function ProductList({ products }) {
  const [sortOption, setSortOption] = useState('default');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sortingOptions = [
    { value: 'default', label: 'Orden por defecto', icon: <FaSort /> },
    { value: 'price-asc', label: 'Precio: Menor a Mayor', icon: <FaSortAmountDown /> },
    { value: 'price-desc', label: 'Precio: Mayor a Menor', icon: <FaSortAmountUp /> },
    { value: 'name-asc', label: 'Nombre: A - Z', icon: <FaSortAlphaDown /> },
    { value: 'name-desc', label: 'Nombre: Z - A', icon: <FaSortAlphaUp /> },
  ];

  const getSortedProducts = () => {
    switch (sortOption) {
      case 'price-asc':
        return [...products].sort((a, b) => a.discountPrice - b.discountPrice);
      case 'price-desc':
        return [...products].sort((a, b) => b.discountPrice - a.discountPrice);
      case 'name-asc':
        return [...products].sort((a, b) => a.description.localeCompare(b.description));
      case 'name-desc':
        return [...products].sort((a, b) => b.description.localeCompare(a.description));
      default:
        return products;
    }
  };

  const sortedProducts = getSortedProducts();
  const selectedOption = sortingOptions.find(opt => opt.value === sortOption);

  return (
    <div className="space-y-6">
      {/* Barra de ordenación */}
      <div className="flex justify-start">
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 bg-base-100 px-4 py-2 rounded-lg border border-primary/20 hover:border-primary/40 transition-all"
          >
            {selectedOption.icon}
            <span className="text-sm font-medium">{selectedOption.label}</span>
            <motion.div
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              className="text-primary/60"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </motion.button>

          {/* Dropdown */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-64 origin-top-right bg-base-100 rounded-lg shadow-lg border border-primary/20 z-50"
              >
                <div className="p-2 space-y-1">
                  {sortingOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortOption(option.value);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-md ${
                        sortOption === option.value
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-base-200'
                      } transition-colors`}
                    >
                      <span className="text-primary/80">{option.icon}</span>
                      {option.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence initial={false}>
          {sortedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>

        {sortedProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-24"
          >
            <div className="text-gold/60 text-lg font-cinzel">
              No se encontraron piezas que coincidan con tu selección
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}