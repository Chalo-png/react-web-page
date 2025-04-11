import ProductForm from '../component/ProductForm';
import { addProduct } from '../services/productService';


function AddProduct() {

  const handleSubmit = async (data) => {
    try {
      await addProduct(data);
      
    } catch (error) {
      console.error("Error al agregar producto:", error);
      alert("Hubo un error al guardar el producto.");
    }
  };

  return (
    <div className="min-h-screen bg-rich-black text-gold p-8">
      <h1 className="text-2xl font-cinzel mb-6 border-b border-gold pb-4">Agregar Nuevo Producto</h1>
      <ProductForm onSubmit={handleSubmit} submitText="Agregar" />
    </div>
  );
}

export default AddProduct;
