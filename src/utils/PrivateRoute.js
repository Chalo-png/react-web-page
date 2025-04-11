// src/utils/PrivateRoute.js
import { Navigate } from 'react-router-dom';
import useAuthSession from './useAuthSession';

function PrivateRoute({ children }) {
  const user = useAuthSession();

  if (user === null) {
    // Loader elegante
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-rich-black text-gold">
        
        <div className="text-xl font-cinzel animate-fade-in">Verificando sesión...</div>
      </div>
    );
  }

  return user ? children : <Navigate to="/" />;
}

export default PrivateRoute;
