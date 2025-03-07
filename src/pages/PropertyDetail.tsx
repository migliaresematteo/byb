import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bed, Bath, Square, MapPin, Car, Trees as Tree, Heart, ArrowRight, Check, Home, Info, Phone, MessageCircle, Calendar, Building2, Thermometer, Wind, Leaf, Loader2 } from 'lucide-react';
import { Property } from '../types';
import { useParams } from 'react-router-dom';
import { Carousel } from '../components/Carousel';
import { Map } from '../components/Map';
import { PropertyCard } from '../components/PropertyCard';
import { FeaturedProperties } from '../components/FeaturedProperties';
import { TallyForm } from '../components/TallyForm';
import SEO from '../components/SEO';
import { generatePropertyMetaDescription, generatePropertyStructuredData, generatePropertyKeywords } from '../utils/seoHelpers';
import { useProperties } from '../contexts/PropertyContext';
import { useEffect, useState } from 'react';
import { fetchPropertyById } from '../services/propertyService';

interface SchedaProprietàProps {
  property: Property;
}

export default function SchedaProprietàDettaglio() {
  const { id } = useParams();
  const { properties, loading: loadingAllProperties } = useProperties();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProperty = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // First try to find the property in the already loaded properties
        const foundProperty = properties.find(p => p.id === id);
        
        if (foundProperty) {
          setProperty(foundProperty);
        } else {
          // If not found in the context, fetch it individually
          const fetchedProperty = await fetchPropertyById(id);
          if (fetchedProperty) {
            setProperty(fetchedProperty);
          } else {
            setError('Proprietà non trovata');
          }
        }
      } catch (err) {
        console.error('Error loading property:', err);
        setError('Errore nel caricamento della proprietà');
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id, properties]);

  if (loading || loadingAllProperties) {
    return (
      <div className="pt-24 pb-12 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-lime-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">Caricamento proprietà in corso...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="pt-16 text-center">
        <SEO 
          title="Proprietà Non Trovata | BrickByBrick Immobiliare"
          description="La proprietà immobiliare che stai cercando non è disponibile."
          canonicalUrl={`https://brickbybrickimmobiliare.it/property/${id}`}
          ogTitle="Proprietà Non Trovata | BrickByBrick Immobiliare"
        />
        <h1 className="text-2xl font-bold text-gray-800">Proprietà Non Trovata | BrickByBrick Immobiliare</h1>
        <p className="mt-4 text-gray-600">{error || "L'immobile che stai cercando non esiste o è stato rimosso."}</p>
        <Link to="/" className="mt-8 inline-block text-lime-500 hover:text-lime-600">
          Torna alla home
        </Link>
      </div>
    );
  }

  const similarProperties = properties
    .filter(p => 
      p.id !== property.id && 
      p.category === property.category &&
      p.price && property.price &&
      Math.abs(Number(p.price) - Number(property.price)) <= Number(property.price) * 0.2
    )
    .slice(0, 3);

  // Generate SEO metadata using our helper functions
  const metaDescription = generatePropertyMetaDescription(property);
  const propertyStructuredData = generatePropertyStructuredData(property);
  const keywords = generatePropertyKeywords(property);

  return (
    <div className="pt-16">
      <SEO 
        title={`${property.title} | ${property.city} | BrickByBrick Immobiliare`}
        description={metaDescription}
        keywords={keywords}
        canonicalUrl={`https://brickbybrickimmobiliare.it/property/${property.id}`}
        ogTitle={property.title}
        ogDescription={metaDescription}
        ogImage={property.imageUrl}
        ogUrl={`https://brickbybrickimmobiliare.it/property/${property.id}`}
        structuredData={propertyStructuredData}
      />
      
      {/* Header Section with Image Gallery */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[60vh]"
      >
        {property.images && property.images.length > 0 ? (
          <Carousel images={property.images} />
        ) : (
          <img
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        )}
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">{`${property.title} | ${property.city} | BrickByBrick Immobiliare`}</h1>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-5 w-5 mr-2" />
            <span>{property.address}, {property.city}</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key Features Card */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">Caratteristiche della Proprietà</h2>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {property.totalRooms && (
                  <div className="flex items-center">
                    <Home className="h-5 w-5 mr-3 text-lime-500" />
                    <div>
                      <p className="text-sm text-gray-500">Locali</p>
                      <p className="font-semibold">{property.totalRooms}</p>
                    </div>
                  </div>
                )}
                {property.sqft && (
                  <div className="flex items-center">
                    <Square className="h-5 w-5 mr-3 text-lime-500" />
                    <div>
                      <p className="text-sm text-gray-500">Superficie</p>
                      <p className="font-semibold">{property.sqft} m²</p>
                    </div>
                  </div>
                )}
                {property.category && (
                  <div className="flex items-center">
                    <Info className="h-5 w-5 mr-3 text-lime-500" />
                    <div>
                      <p className="text-sm text-gray-500">Tipologia</p>
                      <p className="font-semibold">{property.category}</p>
                    </div>
                  </div>
                )}
                {property.projectType && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Tipologia:</span>
                    <p className={`font-semibold flex items-center gap-1 ${
                      property.projectType === 'Residenziale Sostenibile' 
                        ? 'text-green-800' 
                        : ''
                    }`}>
                      {property.projectType === 'Residenziale Sostenibile' ? (
                        <Leaf className="w-4 h-4" />
                      ) : property.projectType === 'Residenziale' ? (
                        <Home className="w-4 h-4" />
                      ) : null}
                      {property.projectType}
                    </p>
                  </div>
                )}
                {property.contractType && (
                  <div className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-3 text-lime-500" />
                    <div>
                      <p className="text-sm text-gray-500">Contratto</p>
                      <p className="font-semibold">{property.contractType}</p>
                    </div>
                  </div>
                )}
                {property.totalUnits && (
                  <div className="flex items-center">
                    <Home className="h-5 w-5 mr-3 text-lime-500" />
                    <div>
                      <p className="text-sm text-gray-500">Unità</p>
                      <p className="font-semibold">{property.totalUnits} {property.totalUnits > 1 ? 'Abitative' : 'Abitativa' }</p>
                    </div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center">
                    <Bath className="h-5 w-5 mr-3 text-lime-500" />
                    <div>
                      <p className="text-sm text-gray-500">{ property.bathrooms > 1 ? 'Bagni' : 'Bagno' }</p>
                      <p className="font-semibold">{property.bathrooms}</p>
                    </div>
                  </div>
                )}
                {property.constructionDates && (
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3 text-lime-500" />
                    <div>
                      <p className="text-sm text-gray-500">Data inizio e fine lavori</p>
                      <p className="font-semibold">
                        {`${new Date(property.constructionDates.start).toLocaleDateString('it-IT')} - ${new Date(property.constructionDates.end).toLocaleDateString('it-IT')}`}
                      </p>
                    </div>
                  </div>
                )}
                {property.floors && (
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 mr-3 text-lime-500" />
                    <div>
                      <p className="text-sm text-gray-500">Piani edificio</p>
                      <p className="font-semibold">{property.floors}</p>
                    </div>
                  </div>
                )}
                {property.parking && (
                  <div className="flex items-center">
                    <Car className="h-5 w-5 mr-3 text-lime-500" />
                    <div>
                      <p className="text-sm text-gray-500">Box, posti auto</p>
                      <p className="font-semibold">{property.parking}</p>
                    </div>
                  </div>
                )}
                {property.heating && (
                  <div className="flex items-center">
                    <Thermometer className="h-5 w-5 mr-3 text-lime-500" />
                    <div>
                      <p className="text-sm text-gray-500">Riscaldamento</p>
                      <p className="font-semibold">{property.heating}</p>
                    </div>
                  </div>
                )}
                {property.airConditioning && (
                  <div className="flex items-center">
                    <Wind className="h-5 w-5 mr-3 text-lime-500" />
                    <div>
                      <p className="text-sm text-gray-500">Climatizzazione</p>
                      <p className="font-semibold">{property.airConditioning}</p>
                    </div>
                  </div>
                )}
              </div>
              {property.lastUpdate && (
                <div className="mt-6 text-sm text-gray-500">
                  Annuncio aggiornato il {new Date(property.lastUpdate).toLocaleDateString('it-IT')}
                </div>
              )}
            </motion.div>

            {/* Description Card */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-2xl font-bold mb-4">Descrizione</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </motion.div>

            {/* Map Section */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-2xl font-bold mb-4">Posizione</h2>
              <div className="h-[300px] relative z-[1]">
                <Map
                  properties={[property]}
                  center={[property.coordinates.lat, property.coordinates.lng]}
                  zoom={15}
                />
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Takes 1 column */}
          <div className="space-y-8">
            {/* Price Card */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-2xl font-bold mb-4">Prezzo</h2>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">
                      {property.price && Number(property.price) !== 0 
                        ? `€${property.price.toLocaleString()}`
                        : 'Prezzo su richiesta'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="mt-4 space-y-3">
                <button className="w-full flex items-center justify-center gap-2 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600">
                  <Phone size={20} /> Chiama
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-green-100 text-green-800 p-3 rounded-lg hover:bg-green-200">
                  <MessageCircle size={20} /> WhatsApp
                </button>
              </div>
            </motion.div>

            <div className="mt-8">
              <TallyForm src="https://tally.so/embed/wA4e2y?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1" height={692} />
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-bold mb-8">Proprietà Simili</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {similarProperties.map((prop) => (
                <Link
                  key={`similar-${prop.id}`}
                  to={`/property/${prop.id}`}
                  className="block group"
                >
                  <div className="relative h-64 mb-3 rounded-lg overflow-hidden">
                    <img
                      src={prop.imageUrl}
                      alt={prop.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
                      <p className="font-bold">{prop.title}</p>
                      <p>
                        {prop.price && Number(prop.price) !== 0
                          ? `€${prop.price.toLocaleString()}`
                          : 'Prezzo su richiesta'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}