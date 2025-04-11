import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { uploadCarouselImage } from '../services/uploadCarouselImage';
import { motion } from 'framer-motion';
import { FaImage, FaSave, FaSpinner } from 'react-icons/fa';

import { getStorage, ref, deleteObject } from "firebase/storage";

function AdminCarousel() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingIndex, setUploadingIndex] = useState(-1);

  // Cargar slides desde Firebase
  useEffect(() => {
    const fetchSlides = async () => {
      const querySnapshot = await getDocs(collection(db, 'carousel'));
      const fetchedSlides = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSlides(fetchedSlides);
      setLoading(false);
    };
    fetchSlides();
  }, []);

  // Manejar cambios en inputs
  const handleInputChange = (index, field, value) => {
    const updated = [...slides];
    updated[index][field] = value;
    setSlides(updated);
  };

  // Guardar cambios en Firebase
  const handleSave = async (index) => {
    const { id, title, subtitle, image, ctaText, ctaLink } = slides[index];
    const docRef = doc(db, 'carousel', id);

    const updatedSlide = {
      title: title || '',
      subtitle: subtitle || '',
      image: image || '',
      ctaText: ctaText || '',
      ctaLink: ctaLink || '',
    };

    try {
      await updateDoc(docRef, updatedSlide);
      toast.success(`Slide ${index + 1} actualizado ✨`);
    } catch (error) {
      toast.error("Error al guardar cambios");
      console.error(error);
    }
  };

  // Subida de imagen
// Subida de imagen (código modificado)
const handleFileChange = async (e, index) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    setUploadingIndex(index);
    const currentImageUrl = slides[index].image;
    
    // Subir nueva imagen
    const newImageUrl = await uploadCarouselImage(file);
    
    // Actualizar estado local
    const updatedSlides = [...slides];
    updatedSlides[index].image = newImageUrl;
    setSlides(updatedSlides);

    // Guardar en Firestore
    const slide = updatedSlides[index];
    const docRef = doc(db, 'carousel', slide.id);
    await updateDoc(docRef, { image: newImageUrl });

    // Eliminar la imagen anterior si existe
    if (currentImageUrl) {
      try {
        const storage = getStorage();
        const imageRef = ref(storage, currentImageUrl);
        await deleteObject(imageRef);
      } catch (error) {
        console.warn("No se pudo eliminar la imagen anterior:", error);
      }
    }

    toast.success(`Imagen actualizada ✨`, {
      icon: <FaImage className="text-gold" />,
    });
  } catch (err) {
    toast.error("Error al actualizar la imagen");
    console.error(err);
  } finally {
    setUploadingIndex(-1);
  }
};

  // Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-gold" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-cinzel bg-gradient-to-r from-gold to-gold-light bg-clip-text text-primary border-b border-gold/20 pb-4"
      >
        Carrusel Editorial
      </motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {slides.map((slide, i) => (
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-velvet-black rounded-xl p-6 border border-gold/20 shadow-gold-glow backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gold/20">
              <h3 className="font-cinzel text-xl text-gold">
                Slide {i + 1} <span className="text-gold/40">#</span>
              </h3>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${slide.image ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="text-sm text-gold/60">
                  {slide.image ? 'Publicada' : 'Sin imagen'}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {/* Image Upload */}
              <div className="form-control">
                <label className="label font-cinzel text-gold/80">Imagen (Recomendada una de 1600x900 píxeles)</label>
                <label className="group relative aspect-video flex items-center justify-center border-2 border-dashed border-gold/20 rounded-xl hover:border-gold/40 cursor-pointer transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, i)}
                  />
                  {uploadingIndex === i ? (
                    <FaSpinner className="animate-spin text-2xl text-gold/60" />
                  ) : slide.image ? (
                    <>
                      <img
                        src={slide.image}
                        alt={`Slide ${i + 1}`}
                        className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-rich-black/80 via-transparent to-rich-black/80" />
                      <span className="relative z-10 text-gold/80 group-hover:text-gold transition-colors">
                        Replace Image
                      </span>
                    </>
                  ) : (
                    <div className="text-center space-y-2">
                      <FaImage className="w-8 h-8 text-gold/60 mx-auto" />
                      <span className="text-gold/60 group-hover:text-gold">
                        Click to upload
                      </span>
                    </div>
                  )}
                </label>
              </div>

              {/* Text Fields */}
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label font-cinzel text-gold/80">Título</label>
                  <input
                    type="text"
                    className="input bg-base-200 border-gold/20 text-gold focus:border-gold focus:ring-2 focus:ring-gold/30"
                    value={slide.title || ''}
                    onChange={(e) => handleInputChange(i, 'title', e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label font-cinzel text-gold/80">Subtítulo</label>
                  <textarea
                    className="textarea bg-base-200 border-gold/20 text-gold focus:border-gold focus:ring-2 focus:ring-gold/30 h-32"
                    value={slide.subtitle || ''}
                    onChange={(e) => handleInputChange(i, 'subtitle', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label font-cinzel text-gold/80">Texto del botón</label>
                    <input
                      type="text"
                      className="input bg-base-200 border-gold/20 text-gold focus:border-gold focus:ring-2 focus:ring-gold/30"
                      value={slide.ctaText || ''}
                      onChange={(e) => handleInputChange(i, 'ctaText', e.target.value)}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label font-cinzel text-gold/80">Link del botón</label>
                    <input
                      type="text"
                      className="input bg-base-200 border-gold/20 text-gold focus:border-gold focus:ring-2 focus:ring-gold/30"
                      value={slide.ctaLink || ''}
                      onChange={(e) => handleInputChange(i, 'ctaLink', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSave(i)}
                className="w-full py-3 bg-gradient-to-r from-gold/90 to-gold-light/80 text-primary rounded-lg font-cinzel hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <FaSave className="flex-shrink-0" />
                Guardar Cambios
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default AdminCarousel;
