import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bed, Bath, Square, MapPin, Car, Trees as Tree, Heart, ArrowRight, Phone, MessageCircle, Leaf, Home } from 'lucide-react';
import { Property } from '../types';
import { useMemo } from 'react';

interface PropertyCardProps {
  property: Property;
  showContactButtons?: boolean;
}

export default function SchedaProprietà({ property, showContactButtons = false }: PropertyCardProps) {
  const handlePhoneClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = `tel:+390000000000`;
  };

  const whatsappLink = useMemo(
    () =>
      `https://wa.me/390000000000?text=Salve, sono interessato/a all'immobile "${property.title}" in ${property.address}, ${property.city}${
        property.price && Number(property.price) !== 0 
          ? ` al prezzo di €${Number(property.price).toLocaleString()}`
          : ''
      }. Potrei avere maggiori informazioni?`,
    [property]
  );

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(whatsappLink, '_blank');
  };

  const formatPrice = (price: number | string | null): string => {
    if (!price || Number(price) === 0) return 'Prezzo su richiesta';
    return `€${Number(price).toLocaleString('it-IT')}`;
  };

  const formatRooms = (rooms: number | string | null): string => {
    if (!rooms) return '';
    return `${rooms} local${Number(rooms) === 1 ? 'e' : 'i'}`;
  };

  const formatBathrooms = (bathrooms: number | null): string => {
    if (!bathrooms) return '';
    return `${bathrooms} bagn${bathrooms === 1 ? 'o' : 'i'}`;
  };

  return (
    <Link to={`/property/${property.id}`}>
      <motion.article
        whileHover={{ scale: 1.02 }}
        itemScope
        itemType="https://schema.org/Residence"
        className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group relative flex flex-col h-full"
      >
        <meta itemProp="name" content={property.title} />
        <meta itemProp="description" content={`${property.type} in ${property.address}, ${property.city}`} />
        <meta itemProp="numberOfRooms" content={String(property.totalRooms)} />
        <meta itemProp="numberOfBathrooms" content={String(property.bathrooms)} />
        {property.price && Number(property.price) !== 0 && (
          <meta itemProp="price" content={String(property.price)} />
        )}
        <meta itemProp="address" content={`${property.address}, ${property.city}`} />
        <div className="relative">
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <span className="px-3 py-1 bg-blue-900 text-white rounded-full text-sm font-semibold">
              {property.contractType}
            </span>
            {property.featured && (
              <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-semibold">
                In evidenza
              </span>
            )}
          </div>
          <img 
            src={property.imageUrl} 
            alt={property.title}
            className="w-full h-64 object-cover"
          />
        </div>
        
        <div className="p-4">
          <header>
            <h2 itemProp="name" className="text-xl font-semibold mb-2">{property.title}</h2>
            <p itemProp="address" className="text-gray-600 flex items-center gap-1 mb-2">
              <MapPin className="w-4 h-4" />
              {property.address}, {property.city}
            </p>
          </header>

          <div className="mb-3">
            <span className={`text-sm flex items-center gap-1 ${
              property.projectType === 'Residenziale Sostenibile' 
                ? 'text-green-800'
                : 'text-gray-500'
            }`}>
              {property.projectType === 'Residenziale Sostenibile' ? (
                <Leaf className="w-4 w-4" />
              ) : property.projectType === 'Residenziale' ? (
                <Home className="w-4 h-4" />
              ) : null}
              {property.projectType}
            </span>
          </div>
          
          <div className="text-lg font-bold mb-4">
            {formatPrice(property.price)}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6 text-gray-600 text-sm">
            {property.totalRooms && (
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-2" />
                <span>{formatRooms(property.totalRooms)}</span>
              </div>
            )}
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-2" />
              <span>{property.sqft} m²</span>
            </div>
            {property.bathrooms && (
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-2" />
                <span>{formatBathrooms(property.bathrooms)}</span>
              </div>
            )}
          </div>

          <div className="mt-auto flex justify-between items-center">
            {showContactButtons ? (
              <div className="flex gap-2" onClick={e => e.preventDefault()}>
                <button
                  onClick={handlePhoneClick}
                  className="flex items-center px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Chiama
                </button>
                <button
                  onClick={handleWhatsAppClick}
                  className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </button>
              </div>
            ) : (
              <button
                className="flex items-center px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `/property/${property.id}`;
                }}
              >
                Dettagli
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
