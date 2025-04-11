import { useState } from 'react';
import { uploadImage } from '../services/uploadImage';
import useAuthSession from '../utils/useAuthSession';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import useFirestoreOptions from '../hooks/useFirestoreOptions';
import { FaUpload, FaImages, FaSave, FaCamera } from 'react-icons/fa';

const SIZE_OPTIONS = ['XS','S', 'M', 'L', 'XL', 'XXL'];

function ProductForm({ initialValues = {}, onSubmit, submitText = "Guardar" }) {
  const [product, setProduct] = useState({
    store: '',
    code: '',
    labelCode: '',
    description: '',
    classification: '',
    gender: '',
    price: '',
    discountPrice: '',
    quantity: 0,
    inventoryValue: '',
    sizes: [],
    image: '',
    extraImages: [],
    ...initialValues,
  });

  const [file, setFile] = useState(null);
  const [extraFiles, setExtraFiles] = useState([]);
  const [showCustomStore, setShowCustomStore] = useState(false);
  const [showCustomClassification, setShowCustomClassification] = useState(false);
  const user = useAuthSession();
  const sizesOptions = useFirestoreOptions('sizes');
  const storeOptions = useFirestoreOptions('stores');
  const classificationOptions = useFirestoreOptions('classifications');
  const genderOptions = useFirestoreOptions('genders');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!user) {
      toast.error("Debes iniciar sesión para agregar productos.");
      return;
    }
  
    const requiredFields = {
      "nombre del producto": product.name,
      "código": product.code,
      "descripción": product.description,
      "precio": product.price,
      "cantidad": product.quantity,
      "marca": product.store,
      "clasificación": product.classification,
    };
  
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([field]) => field);
  
    if (missingFields.length > 0) {
      const fieldList = missingFields.join(", ");
      toast.warning(`Por favor completa los siguientes campos: ${fieldList}.`);
      return;
    }
  
  

    let imageUrl = product.image;
    let extraImageUrls = [];

    try {
      if (file) imageUrl = await uploadImage(file);
      if (extraFiles.length > 0) {
        const uploadPromises = extraFiles.map((file) => uploadImage(file, "products/extra"));
        extraImageUrls = await Promise.all(uploadPromises);
      }

      const labelCode = product.labelCode || `${product.classification?.toLowerCase() || ''}${product.code}`;

      const fullProduct = {
        ...product,
        labelCode,
        image: imageUrl || '',
        extraImages: extraImageUrls,
        price: Number(product.price),
        discountPrice: Number(product.discountPrice || 0),
        quantity: Number(product.quantity),
        inventoryValue: Number(product.price) * Number(product.quantity),
      };

      onSubmit(fullProduct);
      toast.success("Producto guardado exitosamente 🛍️");

      setProduct({
        store: '',
        code: '',
        labelCode: '',
        description: '',
        classification: '',
        gender: '',
        price: '',
        discountPrice: '',
        quantity: '',
        inventoryValue: '',
        sizes: [],
        image: '',
        extraImages: [],
      });
      setFile(null);
      setExtraFiles([]);
      setShowCustomStore(false);
      setShowCustomClassification(false);
    } catch (err) {
      console.error("Error al guardar producto:", err);
      toast.error("Hubo un error al guardar el producto.");
    }
  };
  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-base-100 p-6 rounded-xl border border-primary/20 text-base-content shadow-sm space-y-6 max-w-4xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Nombre y Código */}
        <motion.div className="form-control">
          <label className="label font-cinzel text-primary/80">Nombre</label>
          <input
            name="name"
            type="text"
            className="input input-bordered bg-base-200 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={product.name}
            onChange={handleChange}
            required
          />
        </motion.div>
  
        <motion.div className="form-control">
          <label className="label font-cinzel text-primary/80">Código</label>
          <input
            name="code"
            type="text"
            className="input input-bordered bg-base-200 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={product.code}
            onChange={handleChange}
            required
          />
        </motion.div>
  
        <motion.div className="form-control">
          <label className="label font-cinzel text-primary/80">Cantidad</label>
          <input
            name="quantity"
            type="number"
            min="0"
            className="input input-bordered bg-base-200 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={product.quantity}
            onChange={handleChange}
          />
        </motion.div>
  
        {/* Precio y Descuento */}
        <motion.div className="form-control">
          <label className="label font-cinzel text-primary/80">Precio</label>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            className="input input-bordered bg-base-200 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={product.price}
            onChange={handleChange}
            required
          />
        </motion.div>
  
        <motion.div className="form-control">
          <label className="label font-cinzel text-primary/80">Precio con Descuento</label>
          <input
            name="discountPrice"
            type="number"
            min="0"
            step="0.01"
            className="input input-bordered bg-base-200 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={product.discountPrice}
            onChange={handleChange}
          />
        </motion.div>
  
        {/* Marca */}
        <motion.div className="form-control lg:col-span-3">
          <label className="label font-cinzel text-primary/80">Marca</label>
          <select
            name="store"
            className="select select-bordered w-full bg-base-200 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={product.store}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "custom") {
                setProduct(prev => ({ ...prev, store: "" }));
                setShowCustomStore(true);
              } else {
                setProduct(prev => ({ ...prev, store: value }));
                setShowCustomStore(false);
              }
            }}
            required
          >
            <option value="">Seleccione marca</option>
            {storeOptions.map(opt => (
              <option key={opt.id} value={opt.name}>{opt.name}</option>
            ))}
          </select>
        </motion.div>
  
        {/* Clasificación y Género */}
        <motion.div className="form-control">
          <label className="label font-cinzel text-primary/80">Categoría</label>
          <select
            name="classification"
            className="select select-bordered w-full bg-base-200 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={product.classification}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "custom") {
                setProduct(prev => ({ ...prev, classification: "" }));
                setShowCustomClassification(true);
              } else {
                setProduct(prev => ({ ...prev, classification: value }));
                setShowCustomClassification(false);
              }
            }}
            required
          >
            <option value="">Seleccione categoría</option>
            {classificationOptions.map(opt => (
              <option key={opt.id} value={opt.name}>{opt.name}</option>
            ))}
          </select>
        </motion.div>
  
        <motion.div className="form-control">
          <label className="label font-cinzel text-primary/80">Género</label>
          <select
            name="gender"
            className="select select-bordered w-full bg-base-200 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={product.gender}
            onChange={handleChange}
          >
            <option value="">No aplica</option>
            {genderOptions.map(opt => (
              <option key={opt.id} value={opt.name}>{opt.name}</option>
            ))}
          </select>
        </motion.div>
  
        {/* Descripción */}
        <motion.div className="form-control lg:col-span-3">
          <label className="label font-cinzel text-primary/80">Descripción</label>
          <textarea
            name="description"
            rows="3"
            className="textarea textarea-bordered bg-base-200 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={product.description}
            onChange={handleChange}
            placeholder="Describe el producto, materiales, uso, etc."
          />
        </motion.div>
  
        {/* Imagen principal */}
        <motion.div className="form-control">
          <label className="label font-cinzel text-primary/80">Imagen Principal</label>
          <label className="group relative h-[150px] flex items-center justify-center border-2 border-dashed border-primary/20 rounded-xl hover:border-primary/40 cursor-pointer overflow-hidden transition-colors">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file ? (
              <>
                <img src={URL.createObjectURL(file)} alt="Preview" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <FaCamera className="text-2xl text-white" />
                </div>
              </>
            ) : product.image ? (
              <>
                <img src={product.image} alt="Imagen actual" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <FaCamera className="text-2xl text-white" />
                </div>
              </>
            ) : (
              <div className="text-center p-4">
                <FaUpload className="text-xl text-primary/60 mb-1 group-hover:text-primary/80 transition-colors" />
                <p className="text-sm text-primary/60 group-hover:text-primary/80 transition-colors">Click para subir</p>
              </div>
            )}
          </label>
        </motion.div>
  
        {/* Imágenes adicionales */}
        <motion.div className="form-control lg:col-span-2">
          <label className="label font-cinzel text-primary/80">Imágenes Adicionales (max 3)</label>
          <label className="group relative h-[150px] flex items-center justify-center border-2 border-dashed border-primary/20 rounded-xl hover:border-primary/40 cursor-pointer overflow-hidden transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => setExtraFiles(Array.from(e.target.files || []).slice(0, 3))}
            />
            {extraFiles.length > 0 ? (
              <div className="flex gap-2 w-full h-full p-2 overflow-x-auto">
                {extraFiles.map((file, index) => (
                  <div key={index} className="relative flex-shrink-0 h-full aspect-square">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Extra ${index + 1}`}
                      className="h-full w-full object-cover rounded border border-primary/20"
                    />
                  </div>
                ))}
              </div>
            ) : product.extraImages && product.extraImages.length > 0 ? (
              <div className="flex gap-2 w-full h-full p-2 overflow-x-auto">
                {product.extraImages.map((url, index) => (
                  <div key={index} className="relative flex-shrink-0 h-full aspect-square">
                    <img
                      src={url}
                      alt={`Imagen extra ${index + 1}`}
                      className="h-full w-full object-cover rounded border border-primary/20"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4">
                <FaImages className="text-xl text-primary/60 mb-1 group-hover:text-primary/80 transition-colors" />
                <p className="text-sm text-primary/60 group-hover:text-primary/80 transition-colors">Click o arrastra para subir</p>
              </div>
            )}
          </label>
        </motion.div>
  
        {/* Tallas */}
        <motion.div className="form-control lg:col-span-3">
          <label className="label font-cinzel text-primary/80">Tallas Disponibles</label>
          <div className="flex flex-wrap gap-2">
          {sizesOptions.map((opt, index) => {
  const size = typeof opt === 'string' ? opt : opt.name ?? opt.id;
  console.log('Tallas desde Firebase:', sizesOptions);

  return (
    <button
      key={typeof opt === 'object' ? opt.id ?? index : index}
      type="button"
      onClick={() => {
        setProduct((prev) => {
          const sizes = prev.sizes.includes(size)
            ? prev.sizes.filter((s) => s !== size)
            : [...prev.sizes, size];
          return { ...prev, sizes };
        });
      }}
      className={`btn btn-sm ${
        product.sizes.includes(size)
          ? 'btn-primary text-primary-content'
          : 'btn-outline border-primary/20 text-primary'
      }`}
    >
      {size}
    </button>
  );
})}


          </div>
        </motion.div>
      </div>
  
      <motion.div className="border-t border-primary/20 pt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="btn btn-primary w-full py-3 rounded-lg font-cinzel hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <FaSave className="text-lg" />
          {submitText}
        </motion.button>
      </motion.div>
    </motion.form>
  );

}

export default ProductForm;