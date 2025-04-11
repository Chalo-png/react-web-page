import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import ProductList from '../component/ProductList';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';

function SearchResults({ products }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query') || '';

  const [filters, setFilters] = useState({
    classification: '',
    gender: '',
    priceRange: '',
    store: '',
    size: ''
  });

  const filteredProducts = products.filter(product =>
    (filters.classification === '' || product.classification === filters.classification) &&
    (filters.gender === '' || product.gender === filters.gender) &&
    (filters.priceRange === '' || product.discountPrice <= parseInt(filters.priceRange)) &&
    (filters.store === '' || product.store === filters.store) &&
    (filters.size === '' || product.sizes.includes(filters.size)) &&
    (
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.code?.toLowerCase().includes(query.toLowerCase())
    )
  );

  const classifications = [...new Set(products.map(p => p.classification))];
  const stores = [...new Set(products.map(p => p.store))];


  return (
      <div className="flex flex-col lg:flex-row gap-8 mb-8 px-4 sm:px-8 min-h-screen">
    
        {/* Filters Sidebar */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full lg:w-80 bg-base-100 p-6 rounded-xl border border-primary/20 shadow-sm  lg:top-24 lg:h-[calc(75vh-6rem)] backdrop-blur-lg"
        >
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-primary/20">
            <h2 className="text-2xl font-cinzel text-primary">Filtrar Catálogo</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setFilters({
                classification: '',
                gender: '',
                priceRange: '',
                store: '',
                sizes: []
              })}
              className="text-sm text-primary/60 hover:text-primary transition-colors"
            >
              Limpiar filtros
            </motion.button>
          </div>
    
          <div className="space-y-6">
            {/* Classification Filter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="form-control">
                <label className="label font-playfair">Colección</label>
                <select
                  className="select select-bordered bg-base-200 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg"
                  onChange={(e) => setFilters({ ...filters, classification: e.target.value })}
                  value={filters.classification}
                >
                  <option value="">Todas las colecciones</option>
                  {classifications.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </motion.div>
    
            {/* Store Filter */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="form-control">
                <label className="label font-playfair">Boutique</label>
                <select
                  className="select select-bordered bg-base-200 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg"
                  onChange={(e) => setFilters({ ...filters, store: e.target.value })}
                  value={filters.store}
                >
                  <option value="">Todas las boutiques</option>
                  {stores.map(store => (
                    <option key={store} value={store}>
                      {store.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
    
            {/* Price Filter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="form-control">
                <label className="label font-playfair">Rango de Precio</label>
                <select
                  className="select select-bordered bg-base-200 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg"
                  onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                  value={filters.priceRange}
                >
                  <option value="">Todos los precios</option>
                  <option value="10000">Hasta $10,000</option>
                  <option value="50000">Hasta $50,000</option>
                  <option value="100000">Hasta $100,000</option>
                  <option value="200000">Hasta $200,000</option>
                </select>
              </div>
            </motion.div>
    
            {/* Gender Filter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="form-control">
                <label className="label font-playfair">Género</label>
                <div className="grid grid-cols-2 gap-3">
                  {['', 'HOMBRE', 'MUJER'].map((gender) => (
                    <motion.button
                      key={gender}
                      whileHover={{ scale: 1.02 }}
                      className={`btn rounded-lg h-12 capitalize ${
                        filters.gender === gender
                          ? 'bg-primary text-primary-content border-primary'
                          : 'bg-base-200 border-base-300 hover:border-primary/40'
                      }`}
                      onClick={() => setFilters({ ...filters, gender })}
                    >
                      {gender || 'Todos'}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
    
  
        </motion.div>
    
        {/* Product List */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <ProductList products={filteredProducts} />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-96 bg-base-100 rounded-xl border border-primary/20"
            >
              <FaSearch className="text-4xl text-primary/30 mb-4" />
              <h3 className="text-xl font-cinzel text-primary mb-2">No se encontraron productos</h3>
              <p className="text-base-content/60 mb-6">Prueba ajustando tus filtros de búsqueda</p>
              <button
                onClick={() => setFilters({
                  classification: '',
                  gender: '',
                  priceRange: '',
                  store: '',
                  sizes: []
                })}
                className="btn btn-primary"
              >
                Restablecer filtros
              </button>
            </motion.div>
          )}
        </div>
      </div>
    );
}

export default SearchResults;
