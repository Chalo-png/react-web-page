import { Link } from 'react-router-dom';

function NotFound() {
  return (
      <div className="flex flex-col items-center justify-center text-center">
        <img
          src='images/404-luxury.jpg'
          alt="Página no encontrada"
          className="w-72 h-auto mb-8 opacity-80"
        />
        <h1 className="text-5xl font-cinzel mb-4">404</h1>
        <h2 className="text-2xl font-cinzel mb-2">Página no encontrada</h2>
        <p className="text-gold/70 max-w-md mb-6">
          Lo sentimos, no pudimos encontrar la página que estás buscando.
        </p>
        <Link
          to="/"
          className="btn bg-gold text-primary hover:bg-gold-light font-cinzel rounded-full px-6"
        >
          Volver al catálogo
        </Link>
      </div>
  );
}

export default NotFound;
