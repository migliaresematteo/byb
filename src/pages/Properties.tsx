import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map } from '../components/Map';
import { FeaturedProperties } from '../components/FeaturedProperties';
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { Property } from '../types';
import SEO from '../components/SEO';
import { useProperties } from '../contexts/PropertyContext';

export default function Proprietà() {
  const navigate = useNavigate();
  const { properties, loading, error } = useProperties();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filtri, setFiltri] = useState({
    ricerca: '',
    prezzoMin: '',
    prezzoMax: '',
    stanzeTotali: '',
    metratura: '',
    categoria: '',
    città: '',
    ordinaPer: 'prezzo-asc'
  });

  const [mostraFiltri, setMostraFiltri] = useState(false);

  const proprietàFiltrate = useMemo(() => {
    return properties.filter(proprietà => {
      if (!proprietà || !proprietà.title) return false;
      
      const corrispondeRicerca = proprietà.title.toLowerCase().includes(filtri.ricerca.toLowerCase()) ||
                                (proprietà.city && proprietà.city.toLowerCase().includes(filtri.ricerca.toLowerCase())) ||
                                proprietà.description.toLowerCase().includes(filtri.ricerca.toLowerCase());
      
      const corrispondePrezzoMin = !filtri.prezzoMin || (proprietà.price && Number(proprietà.price) !== 0 && Number(proprietà.price) >= Number(filtri.prezzoMin));
      const corrispondePrezzoMax = !filtri.prezzoMax || (proprietà.price && Number(proprietà.price) !== 0 && Number(proprietà.price) <= Number(filtri.prezzoMax));
      const corrispondeStanze = !filtri.stanzeTotali || (proprietà.totalRooms && Number(proprietà.totalRooms) === Number(filtri.stanzeTotali));
      const corrispondeMetratura = !filtri.metratura || (proprietà.sqft && proprietà.sqft >= Number(filtri.metratura));
      const corrispondeCategoria = !filtri.categoria || (proprietà.category && proprietà.category.toLowerCase().includes(filtri.categoria.toLowerCase()));
      const corrispondeCittà = !filtri.città || (proprietà.city && proprietà.city.toLowerCase() === filtri.città.toLowerCase());

      return corrispondeRicerca && 
             corrispondePrezzoMin && 
             corrispondePrezzoMax && 
             corrispondeStanze && 
             corrispondeMetratura && 
             corrispondeCategoria &&
             corrispondeCittà;
    }).sort((a, b) => {
      switch (filtri.ordinaPer) {
        case 'prezzo-asc':
          return (a.price && Number(a.price) !== 0 ? Number(a.price) : Infinity) - (b.price && Number(b.price) !== 0 ? Number(b.price) : Infinity);
        case 'prezzo-desc':
          return (b.price && Number(b.price) !== 0 ? Number(b.price) : -Infinity) - (a.price && Number(a.price) !== 0 ? Number(a.price) : -Infinity);
        case 'stanze-asc':
          return (a.totalRooms ? Number(a.totalRooms) : 0) - (b.totalRooms ? Number(b.totalRooms) : 0);
        case 'stanze-desc':
          return (b.totalRooms ? Number(b.totalRooms) : 0) - (a.totalRooms ? Number(a.totalRooms) : 0);
        case 'metratura-asc':
          return (a.sqft || 0) - (b.sqft || 0);
        case 'metratura-desc':
          return (b.sqft || 0) - (a.sqft || 0);
        default:
          return 0;
      }
    });
  }, [filtri, properties]);

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleConfirmPropertyView = () => {
    if (selectedProperty) {
      navigate(`/property/${selectedProperty.id}`);
    }
  };

  // SEO structured data for property listings
  const propertiesStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": proprietàFiltrate.slice(0, 10).map((property, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "RealEstateListing",
        "name": property.title,
        "description": property.description,
        "url": `https://brickbybrickimmobiliare.it/property/${property.id}`,
        "image": property.imageUrl,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": property.city || '',
          "streetAddress": property.address || ''
        },
        "offers": {
          "@type": "Offer",
          "price": property.price,
          "priceCurrency": "EUR"
        },
        "numberOfRooms": property.totalRooms
      }
    }))
  };

  if (loading) {
    return (
      <div className="pt-24 pb-12 bg-gray-50 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-lime-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">Caricamento proprietà in corso...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 pb-12 bg-gray-50 flex justify-center items-center min-h-[60vh]">
        <div className="text-center max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Errore</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-lime-500 text-white rounded hover:bg-lime-600"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 bg-gray-50">
      <SEO 
        title="Proprietà Immobiliari in Vendita e Affitto | BrickByBrick Immobiliare"
        description="Esplora il nostro catalogo di proprietà immobiliari in vendita e affitto. Appartamenti, ville e case in tutta Italia con le migliori offerte del mercato."
        keywords="proprietà in vendita, case in affitto, appartamenti, ville, immobili italia, Torino, Canavese"
        canonicalUrl="https://brickbybrickimmobiliare.it/properties"
        ogTitle="Proprietà Immobiliari | BrickByBrick"
        ogDescription="Esplora il nostro catalogo di proprietà immobiliari in vendita e affitto in tutta Italia."
        structuredData={propertiesStructuredData}
      />
      
      <div className="max-w-7xl mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8"
        >
          Proprietà Immobiliari in Vendita e Affitto | BrickByBrick
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-semibold mb-6 text-gray-700"
        >
          Trova la Tua Casa Ideale con BrickByBrick
        </motion.h2>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 h-[400px] relative z-0"
        >
          <Map 
            properties={proprietàFiltrate}
            onMarkerClick={handlePropertySelect}
          />
        </motion.div>

        {/* Property Selection Dialog */}
        <AnimatePresence>
          {selectedProperty && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-lg p-6 max-w-lg w-full"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Apri Proprietà</h2>
                  <button
                    onClick={() => setSelectedProperty(null)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <p className="mb-6">
                  Vuoi visualizzare i dettagli di questa proprietà?
                  <br />
                  <span className="font-semibold">{selectedProperty.title}</span>
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setSelectedProperty(null)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Annulla
                  </button>
                  <button
                    onClick={handleConfirmPropertyView}
                    className="px-4 py-2 bg-lime-500 text-white rounded hover:bg-lime-600"
                  >
                    Visualizza Dettagli
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex gap-4 items-center mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Cerca proprietà..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-lime-400 focus:border-lime-400"
                value={filtri.ricerca}
                onChange={(e) => setFiltri(prev => ({ ...prev, ricerca: e.target.value }))}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button
              onClick={() => setMostraFiltri(!mostraFiltri)}
              className="flex items-center gap-2 px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600"
            >
              <SlidersHorizontal className="h-5 w-5" />
              Filtri
            </button>
          </div>

          {mostraFiltri && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white p-6 rounded-lg shadow-lg mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Range di prezzo (€)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-3 py-2 rounded-lg border"
                      value={filtri.prezzoMin}
                      onChange={(e) => setFiltri(prev => ({ ...prev, prezzoMin: e.target.value }))}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-3 py-2 rounded-lg border"
                      value={filtri.prezzoMax}
                      onChange={(e) => setFiltri(prev => ({ ...prev, prezzoMax: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stanze Totali</label>
                  <select
                    className="w-full px-3 py-2 rounded-lg border"
                    value={filtri.stanzeTotali}
                    onChange={(e) => setFiltri(prev => ({ ...prev, stanzeTotali: e.target.value }))}
                  >
                    <option value="">Qualsiasi</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Metratura Minima (m²)</label>
                  <input
                    type="number"
                    placeholder="Min m²"
                    className="w-full px-3 py-2 rounded-lg border"
                    value={filtri.metratura}
                    onChange={(e) => setFiltri(prev => ({ ...prev, metratura: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select
                    className="w-full px-3 py-2 rounded-lg border"
                    value={filtri.categoria}
                    onChange={(e) => setFiltri(prev => ({ ...prev, categoria: e.target.value }))}
                  >
                    <option value="">Qualsiasi</option>
                    <option value="Trilocale">Trilocale</option>
                    <option value="Bilocale">Bilocale</option>
                    <option value="Villa">Villa</option>
                    <option value="Attico">Attico</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Città</label>
                  <select
                    className="w-full px-3 py-2 rounded-lg border"
                    value={filtri.città}
                    onChange={(e) => setFiltri(prev => ({ ...prev, città: e.target.value }))}
                  >
                    <option value="">Qualsiasi</option>
                    <option value="Cafasse">Cafasse</option>
                    <option value="Ciriè">Ciriè</option>
                    <option value="Fiano">Fiano</option>
                    <option value="Nole">Nole</option>
                    <option value="Torino">Torino</option>
                    <option value="Villanova Canavese">Villanova Canavese</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ordina per</label>
                  <select
                    className="w-full px-3 py-2 rounded-lg border"
                    value={filtri.ordinaPer}
                    onChange={(e) => setFiltri(prev => ({ ...prev, ordinaPer: e.target.value }))}
                  >
                    <option value="prezzo-asc">Prezzo: dal più basso</option>
                    <option value="prezzo-desc">Prezzo: dal più alto</option>
                    <option value="stanze-asc">Stanze: dal più basso</option>
                    <option value="stanze-desc">Stanze: dal più alto</option>
                    <option value="metratura-asc">Metratura: dal più basso</option>
                    <option value="metratura-desc">Metratura: dal più alto</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Results Section */}
        <div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-semibold mb-6"
          >
            Immobili Disponibili ({proprietàFiltrate.length})
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FeaturedProperties 
              title=""
              subtitle=""
              properties={proprietàFiltrate}
              limit={proprietàFiltrate.length}
              showViewAll={false}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
