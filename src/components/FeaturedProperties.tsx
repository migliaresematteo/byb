import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SchedaProprietà from './PropertyCard';
import { useProperties } from '../contexts/PropertyContext';

interface FeaturedPropertiesProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  excludeId?: string;
  showViewAll?: boolean;
}

export function FeaturedProperties({ 
  title = "Proprietà in Evidenza",
  subtitle = "Scopri le nostre proprietà più esclusive",
  limit = 3,
  excludeId,
  showViewAll = true
}: FeaturedPropertiesProps) {
  const { properties, loading, error } = useProperties();

  const featuredProperties = properties.filter(p => p.featured);
  const displayProperties = excludeId
    ? featuredProperties.filter(p => p.id !== excludeId).slice(0, limit)
    : featuredProperties.slice(0, limit);

  if (loading || error || displayProperties.length === 0) {
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
