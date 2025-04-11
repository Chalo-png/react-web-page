import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from './ProductForm';

function ProductEdit({ products, updateProduct }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const productToEdit = products.find(p => p.id === id);

  const handleSubmit = async (updatedProduct) => {
    await updateProduct(updatedProduct); // esto llama a Firestore + actualiza local
    
    navigate('/admin/panel');
  };

  if (!productToEdit) {
    return <p className="text-gold p-8">Producto no encontrado...</p>;
  }

  return (
    <div className="min-h-screen bg-rich-black text-gold p-8">
      <h1 className="text-2xl font-cinzel mb-6">Editar Producto</h1>
      <ProductForm
        initialValues={productToEdit}
        onSubmit={handleSubmit}
        submitText="Actualizar"
      />
    </div>
  );
}

export default ProductEdit;
