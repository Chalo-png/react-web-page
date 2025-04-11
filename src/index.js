import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import './styles/swiper-overrides.css';
import './styles/size-container.css';

// Create root first
const root = ReactDOM.createRoot(document.getElementById('root'));



root.render(
    <BrowserRouter>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        toastClassName="!bg-base-200 !text-base-content" // Add DaisyUI classes
      />
    </BrowserRouter>
);

reportWebVitals();