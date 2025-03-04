import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Property } from '../types';
import SchedaProprietà from './PropertyCard';
import { useProperties } from '../contexts/PropertyContext';

interface CMSFeaturedPropertiesProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  excludeId?: string;
  showViewAll?: boolean;
}

export function CMSFeaturedProperties({ 
  title = "Proprietà in Evidenza",
  subtitle = "Scopri le nostre proprietà più esclusive",
  limit = 3,
  excludeId,
  showViewAll = true
}: CMSFeaturedPropertiesProps) {
  const { properties, loading, error } = useProperties();
  
  // Filter for featured properties or fallback to the first few properties
  const featuredProperties = properties.filter(p => p.featured);
  const displayProperties = excludeId
    ? (featuredProperties.length > 0 
        ? featuredProperties.filter(p => p.id !== excludeId).slice(0, limit)
        : properties.filter(p => p.id !== excludeId).slice(0, limit))
    : (featuredProperties.length > 0 
        ? featuredProperties.slice(0, limit)
        : properties.slice(0, limit));

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            <p className="text-gray-600">{subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(limit)].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            <p className="text-red-500">Si è verificato un errore nel caricamento delle proprietà.</p>
          </div>
        </div>
      </section>
    );
  }

  if (displayProperties.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProperties.map((property) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <SchedaProprietà property={property} />
            </motion.div>
          ))}
        </div>
        {showViewAll && (
          <div className="text-center mt-12">
            <Link to="/properties">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="bg-lime-500 text-white px-8 py-3 rounded-full text-lg font-semibold inline-flex items-center"
              >
                Vedi Tutte le Proprietà
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
