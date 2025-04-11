import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import ProductCard from '../component/ProductCard';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

// Import your custom carousel styles
import '../styles/swiper-carousel.css';
function HomePage() {

  const [slides, setSlides] = useState([]);
  const [highlightedProducts, setHighlightedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Efecto para el carrusel
  useEffect(() => {
    const fetchSlides = async () => {
      const snapshot = await getDocs(collection(db, 'carousel'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSlides(data);
    };
    fetchSlides();
  }, []);

  // Efecto para productos destacados
  useEffect(() => {
    const fetchHighlighted = async () => {
      const docRef = doc(db, 'highlighted', 'main');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const { productIds } = docSnap.data();
        if (productIds?.length) {
          const productSnapshots = await Promise.all(
            productIds.map(id => getDoc(doc(db, 'products', id))
          ));
          const products = productSnapshots
            .filter(doc => doc.exists())
            .map(doc => ({ id: doc.id, ...doc.data() }));
          setHighlightedProducts(products);
        }
      }
      setIsLoading(false);
    };

    fetchHighlighted();
  }, []);

  // Componente de carga
  const LoadingOverlay = () => (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-base-100 z-50 flex items-center justify-center"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Spinner animado */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
        
        {/* Texto de carga */}
        <span className="font-cinzel text-primary/80">
          Cargando elegancia...
        </span>
      </div>
    </motion.div>
  );

  const featuredProducts = highlightedProducts;


  return (
    <div className="bg-base-100 text-base-content relative">
      <AnimatePresence>
        {isLoading && <LoadingOverlay />}
      </AnimatePresence>
      {/* Carrusel Principal */}
      <div className="relative h-[600px] overflow-hidden">
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 5000 }}
          navigation
          className="luxury-swiper"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide.id}>
              <div className="relative min-h-[600px] w-full">
                <img
                  src={slide.image}
                  alt={`Slide ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover z-0"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />

                <div className="absolute z-20 bottom-0 left-0 right-0 px-4 pb-16 pt-32 text-center">
                <div className="max-w-4xl mx-auto">
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-4xl md:text-5xl font-cinzel text-white mb-4"
                    >
                      {slide.title || 'Colección de Lujo'}
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8"
                    >
                      {slide.subtitle || 'Descubre elegancia atemporal y estilo moderno'}
                    </motion.p>

                    {slide.ctaText && slide.ctaLink && (
                      <motion.a
                        href={slide.ctaLink}
                        whileHover={{ scale: 1.05 }}
                        transition={{ delay: 0.8 }}
                        className="inline-block bg-primary text-white px-8 py-3 rounded-full font-cinzel hover:bg-primary-focus transition-all border-2 border-primary/50"
                      >
                        {slide.ctaText}
                      </motion.a>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Selección Curada */}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="font-cinzel text-4xl mb-4 text-primary"
          >
            Destacados Monaco
          </motion.h2>
          <p className="text-base-content/60 max-w-2xl mx-auto">
            Piezas seleccionadas que encarnan el estándar de lujo, artesanía y diseño atemporal de Monaco
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <motion.a
            href="/catalog"
            whileHover={{ scale: 1.05 }}
            className="border border-primary/30 text-primary px-8 py-3 rounded-full font-cinzel hover:bg-primary/10 transition-all"
          >
            Ver Colección Completa
          </motion.a>
        </div>
      </div>
    </div>
  );
}

export default HomePage;