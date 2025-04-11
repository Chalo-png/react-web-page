import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProducts, updateProduct as saveProduct } from './services/productService';
import { isAuthenticated } from './utils/auth';
import './index.css';
import ProductEdit from './component/ProductEdit';
import ProductDetail from './component/ProductDetail';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import AddProduct from './pages/addProduct';
import Home from './pages/Home';
import NotFound from './pages/Notfound';
import SimpleLayout from './component/SimpleLayout';
import PrivateRoute from './utils/PrivateRoute';
import SearchResults from './pages/SearchResults';
import HomePage from './pages/HomePage';
import AdminCarousel from './component/AdminCarousel';


function App() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    classification: '',
    gender: '',
    priceRange: '',
    store: '',
    sizes: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    getProducts().then((data) => {
      console.log("Productos desde Firestore:", data);
      setProducts(data);
    });
  }, []);

  const updateProduct = async (updatedProduct) => {
    await saveProduct(updatedProduct.id, updatedProduct);
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const filteredProducts = products.filter(product =>
    (filters.classification === '' || product.classification === filters.classification) &&
    (filters.gender === '' || product.gender === filters.gender) &&
    (filters.priceRange === '' || product.discountPrice <= parseInt(filters.priceRange))
  );

  const classifications = [...new Set(products.map(p => p.classification))];

  return (
    <Routes >
      {/* Página de login SIN SimpleLayout */}
      <Route path="/admin" element={<AdminLogin />} />

      {/* Rutas que usan SimpleLayout */}
      <Route
        path="*"
        element={
          <SimpleLayout searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
            <Routes>
              <Route
                path="/catalog"
                element={
                  <Home
                    products={filteredProducts}
                    filters={filters}
                    setFilters={setFilters}
                    searchTerm={searchTerm}
                    classifications={classifications}
                  />
                }
              />
              <Route
                path="/"
                element={
                  <HomePage />
                }
              />
              <Route path="/admin/panel" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
              <Route path="/admin/add" element={<PrivateRoute><AddProduct /></PrivateRoute>} />
              <Route path="/product/:id" element={<ProductDetail products={products} />} />
              <Route path="/edit/:id" element={<PrivateRoute><ProductEdit products={products} updateProduct={updateProduct} /></PrivateRoute>} />
              <Route path="/admin/carousel" element={<PrivateRoute><AdminCarousel /></PrivateRoute>} />
              <Route path="/buscar" element={<SearchResults products={filteredProducts} />} />
              <Route path="*" element={isAuthenticated() ? <NotFound /> : <Navigate to="/" />} />
            </Routes>
          </SimpleLayout>
        }
      />
    </Routes>
  );
}

export default App;
