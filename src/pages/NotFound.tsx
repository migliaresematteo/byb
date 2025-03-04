import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <SEO 
        title="Pagina Non Trovata | BrickByBrick Immobiliare"
        description="La pagina che stai cercando non esiste o è stata spostata."
        canonicalUrl="https://brickbybrickimmobiliare.it/404"
        ogTitle="Pagina Non Trovata | BrickByBrick Immobiliare"
        ogDescription="La pagina che stai cercando non esiste o è stata spostata."
      />
      <div className="text-center">
        <h1 className="text-6xl font-bold text-lime-500 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Pagina Non Trovata | BrickByBrick Immobiliare</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          La pagina che stai cercando non esiste o è stata spostata. Torna alla homepage per continuare la navigazione.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center px-6 py-3 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors"
        >
          <Home className="mr-2 h-5 w-5" />
          Torna alla Home
        </Link>
      </div>
    </div>
  );
}
