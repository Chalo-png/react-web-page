import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import { Dialog } from '@headlessui/react';
import { useState } from 'react';

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

function ProductDetail({ products }) {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage] = useState('');
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gold px-4 py-12 text-center">
        <motion.img
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          src="/images/notfound-product.png"
          alt="Producto no encontrado"
          className="w-60 h-auto mb-6 opacity-80"
        />
        <h2 className="text-3xl font-cinzel mb-2">Oops... producto no encontrado</h2>
        <p className="text-gold/70 max-w-md mb-6">
          Es posible que este artículo haya sido retirado del catálogo o que el enlace sea incorrecto.
        </p>
        <a
          href="/"
          className="btn bg-gold text-black hover:bg-gold-light font-cinzel rounded-full px-6 py-3 transition-all duration-300"
        >
          Volver al catálogo
        </a>
      </div>
    );
  }



  return (
    <div className="text-gold px-4 sm:px-8 py-12 max-w-7xl mx-auto">
      {/* Image Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="relative">
          <Swiper
            navigation
            thumbs={{ swiper: thumbsSwiper }}
            modules={[Navigation, Thumbs, FreeMode]}
            className="luxury-swiper-main"
          >
            {[product.image, ...(product.extraImages || [])].map((img, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative aspect-square"
                >
                  <Zoom>
                    <img
                      src={img}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg shadow-xl cursor-zoom-in"
                      loading="lazy"
                    />
                  </Zoom>
                  {index === 0 && (
                    <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full text-sm">
                      {product.classification}
                    </div>
                  )}
                </motion.div>
              </SwiperSlide>

            ))}
          </Swiper>

          {/* Thumbnail Carousel */}
          {product.extraImages?.length > 0 && (
            <div className="mt-6 max-w-[90%] mx-auto">
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="luxury-swiper-thumbs"
              >
                {[product.image, ...product.extraImages].map((img, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={img}
                      alt={`Thumb ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-md border-2 border-transparent hover:border-gold transition-all cursor-pointer"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="lg:sticky lg:top-24 lg:h-fit space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="border-b border-gold/20 pb-6"
          >
            <h1 className="text-4xl font-cinzel font-light mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-gold/70 text-sm uppercase tracking-wider">
                {product.classification}
              </span>
              {product.gender !== '' && (
                <>
                  <span className="text-gold/50">•</span>
                  <span className="text-gold/70 text-sm">
                    {product.gender === 'men' ? 'HOMBRE' : 'MUJER'}
                  </span>
                </>
              )}

            </div>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-3xl font-cinzel text-gold">
                ${product.discountPrice?.toLocaleString()}
              </span>
              {product.price && (
                <span className="text-lg line-through text-gold/50">
                  ${product.price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Descripción del producto */}
            {product.description && (
              <p className="text-gold/70 leading-relaxed mb-6">{product.description}</p>
            )}

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


          </motion.div>

          {/* Product Details */}
          <div className="space-y-4 text-gold/80">
            <div className="flex justify-between">
              <span>Disponibilidad:</span>
              <span className="text-gold">{product.quantity} en stock</span>
            </div>
            <div className="flex justify-between">
              <span>Tienda:</span>
              <span className="uppercase">{product.store}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4">
          <Dialog.Panel className="max-w-4xl w-full">
            <img
              src={selectedImage}
              alt="Fullscreen view"
              className="max-h-[90vh] w-auto mx-auto object-contain"
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

export default ProductDetail;