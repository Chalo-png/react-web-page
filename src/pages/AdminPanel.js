import { useEffect, useState } from 'react';
import { getProducts, deleteProduct } from '../services/productService';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaClone, FaPlus, FaBoxOpen, FaSearch, FaTimes } from 'react-icons/fa';
import { addProduct } from '../services/productService';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { storage } from '../firebase';
import { ref, deleteObject, getBlob, getDownloadURL, uploadBytes } from 'firebase/storage';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { FaStar } from 'react-icons/fa';



function AdminPanel() {
    const [products, setProducts] = useState([]);
    const [showWelcome, setShowWelcome] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const navigate = useNavigate();
    const [highlightedIds, setHighlightedIds] = useState([]);
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error loading products:", error);
                toast.error("Error loading products");
            }
        };

        loadProducts();
        const timeout = setTimeout(() => setShowWelcome(false), 4000);
        const fetchHighlighted = async () => {
            try {
                const docRef = doc(db, 'highlighted', 'main');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setHighlightedIds(docSnap.data().productIds || []);
                }
            } catch (error) {
                console.error('Error loading highlighted:', error);
            }
        };
        fetchHighlighted();
        return () => clearTimeout(timeout);
    }, []);


    const toggleHighlight = async (productId) => {
        let updated;
        if (highlightedIds.includes(productId)) {
            updated = highlightedIds.filter(id => id !== productId);
        } else {
            if (highlightedIds.length >= 6) {
                toast.warning('Solo puedes tener 6 productos destacados');
                return;
            }
            updated = [...highlightedIds, productId];
        }
        setHighlightedIds(updated);
        try {
            const docRef = doc(db, 'highlighted', 'main');
            await updateDoc(docRef, { productIds: updated });
            toast.success('Productos destacados actualizados');
        } catch (error) {
            toast.error('Error al actualizar destacados');
            console.error(error);
        }
    };
    const handleDeleteConfirmation = (productId) => {
        setSelectedProduct(productId);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        const product = products.find(p => p.id === selectedProduct);
        if (!product) return;

        try {

            // Eliminar el ID del array de destacados si es que está
            if (highlightedIds.includes(selectedProduct)) {
                const updated = highlightedIds.filter(id => id !== selectedProduct);
                setHighlightedIds(updated);
                try {
                    const docRef = doc(db, 'highlighted', 'main');
                    await updateDoc(docRef, { productIds: updated });
                } catch (error) {
                    console.error("Error al actualizar destacados durante la eliminación:", error);
                }
            }

            // 1. Eliminar imagen principal
            if (product.image) {
                const url = new URL(product.image);
                const path = decodeURIComponent(url.pathname.split('/o/')[1].split('?')[0]);
                const imageRef = ref(storage, path);
                await deleteObject(imageRef);
            }

            // 2. Eliminar imágenes extra si existen
            if (Array.isArray(product.extraImages)) {
                for (const imgUrl of product.extraImages) {
                    const url = new URL(imgUrl);
                    const path = decodeURIComponent(url.pathname.split('/o/')[1].split('?')[0]);
                    const imgRef = ref(storage, path);
                    await deleteObject(imgRef);
                }
            }

            // 3. Eliminar documento en Firestore
            await deleteProduct(selectedProduct);
            setProducts(products.filter(p => p.id !== selectedProduct));
            toast.success("Producto e imágenes eliminados correctamente 🎉");
        } catch (error) {
            console.error("Error al eliminar producto o imagen:", error);
            toast.error("Error al eliminar producto o imagen");
        }
        setShowDeleteModal(false);
    };


    const handleDuplicate = async (originalProduct) => {
        try {
            toast.info("Clonando producto...");

            // Clonar imagen principal
            const newImage = await copyImageInStorage(originalProduct.image);

            // Clonar imágenes extras (en paralelo)
            const newExtraImages = originalProduct.extraImages?.length > 0
                ? await Promise.all(
                    originalProduct.extraImages.map(img => copyImageInStorage(img))
                )
                : [];

            // Crear nuevo producto
            const newProduct = {
                ...originalProduct,
                id: undefined, // Firestore generará nuevo ID
                code: `${originalProduct.code}_copy_${Date.now()}`,
                labelCode: `${originalProduct.labelCode || 'item'}_copy_${Date.now()}`,
                image: newImage,
                extraImages: newExtraImages,
            };

            await addProduct(newProduct);
            toast.success("¡Producto clonado con éxito!");

            // Actualizar lista
            const updatedList = await getProducts();
            setProducts(updatedList);

        } catch (error) {
            console.error("Error al duplicar:", error);
            toast.error("Error al clonar el producto");
        }
    };

    // Función auxiliar para clonar imágenes en Storage
    const copyImageInStorage = async (imageUrl) => {
        if (!imageUrl) return '';

        try {
            // 1. Extraer path del URL original
            const url = new URL(imageUrl);
            const sourcePath = decodeURIComponent(url.pathname.split('/o/')[1].split('?')[0]);

            // 2. Crear referencia al archivo original
            const sourceRef = ref(storage, sourcePath);

            // 3. Descargar los bytes de la imagen
            const blob = await getBlob(sourceRef);

            // 4. Crear nueva referencia para la copia
            const extension = sourcePath.split('.').pop();
            const newPath = `${sourcePath.split('.')[0]}_copy_${Date.now()}.${extension}`;
            const newRef = ref(storage, newPath);

            // 5. Subir la copia
            await uploadBytes(newRef, blob);

            // 6. Obtener URL pública de la copia
            return await getDownloadURL(newRef);

        } catch (error) {
            console.error("Error al clonar imagen:", error);
            return imageUrl; // Fallback a la original si hay error
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit/${id}`);
    };
    useEffect(() => {
        if (showWelcome) {
            toast.success("Bienvenido, administrador 👑");
        }
    }, [showWelcome]);
    const [searchTerm, setSearchTerm] = useState('');
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div className="min-h-screen bg-base-100 text-base-content  w-full">

            {/* Tabs */}
            <div className="tabs border-b border-primary/20 mb-6">
                <button className="tab tab-bordered tab-active text-primary">Productos</button>
                <button
                    className="tab tab-bordered text-primary/60 hover:text-primary"
                    onClick={() => navigate("/admin/carousel")}
                >
                    Carrusel
                </button>
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <motion.h1 className="text-2xl font-cinzel text-primary">
                    Panel de administración
                </motion.h1>

                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <input
                            type="text"
                            placeholder="Buscar por descripción o código..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-full bg-base-200 border border-primary/30 placeholder:text-base-content/40 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/40" />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary/60 hover:text-primary"
                            >
                                <FaTimes />
                            </button>
                        )}
                    </div>

                    <Link
                        to="/admin/add"
                        className="btn btn-primary rounded-full px-6 font-cinzel flex items-center gap-2"
                    >
                        <FaPlus className="w-4 h-4" />
                        Nuevo Producto
                    </Link>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto w-full rounded-lg border border-primary/20 shadow-sm">
  <table className="table w-full">
    <thead className="bg-base-200 border-b border-primary/20">
      <tr>
        <th className="font-cinzel text-primary/80">Imagen</th>
        <th className="font-cinzel text-primary/80">Código</th>
        <th className="font-cinzel text-primary/80">Código Etiqueta</th>
        <th className="font-cinzel text-primary/80">Nombre</th>
        <th className="font-cinzel text-primary/80">Marca</th>
        <th className="font-cinzel text-primary/80">Categoría</th>
        <th className="font-cinzel text-primary/80">Género</th>
        <th className="font-cinzel text-primary/80">Precio</th>
        <th className="font-cinzel text-primary/80">Stock</th>
        <th className="font-cinzel text-primary/80">Tallas</th>
        <th className="font-cinzel text-primary/80">Acciones</th>
      </tr>
    </thead>

    <tbody>
      {filteredProducts.map((product) => {
        const showOriginalPrice = product.price !== product.discountPrice;
        const displayPrice =
          product.discountPrice > 0 && product.discountPrice < product.price
            ? product.discountPrice
            : product.price;

        return (
          <tr key={product.id} className="hover:bg-base-200/50 border-b border-primary/10">
            {/* Imagen */}
            <td>
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg border border-primary/20"
              />
            </td>

            {/* Códigos */}
            <td>
              <span className="badge badge-outline text-primary">
                {product.code}
              </span>
            </td>
            <td>
              <span className="badge badge-outline text-secondary">
                {product.labelCode}
              </span>
            </td>

            {/* Información básica */}
            <td className="font-medium">{product.name}</td>
            <td className="font-medium">{product.store}</td>
            <td>
              <span className="badge badge-outline text-primary">
                {product.classification}
              </span>
            </td>
            <td className="capitalize">{product.gender || 'N/A'}</td>

            {/* Precio combinado */}
            <td>
              <div className="flex flex-col items-end">
                <span className="font-cinzel text-sm text-primary">
                  ${displayPrice.toLocaleString()}
                </span>
                {showOriginalPrice && (
                  <span className="text-xs text-base-content/50 line-through">
                    ${product.price.toLocaleString()}
                  </span>
                )}
              </div>
            </td>

            {/* Stock */}
            <td>
              <span
                className={`badge ${
                  product.quantity <= 5 ? 'badge-error' : 'badge-outline'
                }`}
              >
                {product.quantity}
              </span>
            </td>


            {/* Tallas */}
            <td>
              <div className="flex flex-wrap gap-1">
                {product.sizes?.map((size) => (
                  <span
                    key={size}
                    className="badge badge-outline border-primary/20"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </td>

            {/* Acciones */}
            <td>
              <div className="flex gap-2">
                <button onClick={() => toggleHighlight(product.id)}>
                  <FaStar
                    className={`text-xl ${
                      highlightedIds.includes(product.id)
                        ? 'text-yellow-400'
                        : 'text-primary/30'
                    }`}
                  />
                </button>
                <button onClick={() => handleEdit(product.id)}>
                  <FaEdit className="text-primary hover:text-primary/80" />
                </button>
                <button onClick={() => handleDeleteConfirmation(product.id)}>
                  <FaTrash className="text-error hover:text-error/80" />
                </button>
              </div>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>


            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-base-100 rounded-xl p-6 max-w-md w-full border border-primary/20 shadow-lg"
                        >
                            <h3 className="text-2xl font-cinzel mb-4 text-primary">
                                Confirmar Eliminación
                            </h3>
                            <p className="text-base-content/80 mb-6">
                                ¿Estás seguro de que deseas eliminar permanentemente este producto?
                            </p>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="btn btn-ghost text-primary hover:bg-primary/10"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="btn btn-error text-white"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default AdminPanel;