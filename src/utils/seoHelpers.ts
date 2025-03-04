import { Property } from '../types';

/**
 * Generates SEO-friendly meta description for a property
 */
export function generatePropertyMetaDescription(property: Property): string {
  const contractType = property.contractType === 'Vendita' ? 'in vendita' : 'in affitto';
  const price = property.price ? `a ${new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(Number(property.price))}` : '';
  const rooms = property.totalRooms ? `${property.totalRooms} locali` : '';
  const size = property.sqft ? `${property.sqft} m²` : '';
  const features = [rooms, size].filter(Boolean).join(', ');
  
  let description = `${property.category} ${contractType} a ${property.city}`;
  if (features) description += ` con ${features}`;
  if (price) description += ` ${price}`;
  
  // Add a snippet of the description, but keep it under 160 characters total
  const maxLength = 160 - description.length - 5; // 5 for ellipsis and space
  if (maxLength > 20 && property.description) {
    description += `. ${property.description.substring(0, maxLength)}...`;
  }
  
  return description;
}

/**
 * Generates structured data for a property listing
 */
export function generatePropertyStructuredData(property: Property) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description,
    "url": `https://brickbybrickimmobiliare.it/property/${property.id}`,
    "image": property.images && property.images.length > 0 ? property.images : property.imageUrl,
    "datePosted": property.lastUpdate,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.city,
      "addressRegion": "Italia",
      "streetAddress": property.address
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": property.coordinates.lat,
      "longitude": property.coordinates.lng
    },
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": "EUR",
      "businessFunction": property.contractType === 'Vendita' ? "http://purl.org/goodrelations/v1#Sell" : "http://purl.org/goodrelations/v1#LeaseOut"
    },
    "numberOfRooms": property.totalRooms,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.sqft,
      "unitCode": "MTK"
    }
  };
}

/**
 * Generates keywords for a property
 */
export function generatePropertyKeywords(property: Property): string {
  const contractType = property.contractType === 'Vendita' ? 'vendita' : 'affitto';
  const baseKeywords = [
    property.category.toLowerCase(),
    `${property.category.toLowerCase()} ${contractType}`,
    `${property.category.toLowerCase()} ${property.city.toLowerCase()}`,
    `${property.category.toLowerCase()} ${contractType} ${property.city.toLowerCase()}`,
    `immobili ${property.city.toLowerCase()}`,
    `case ${property.city.toLowerCase()}`,
    `${contractType} case ${property.city.toLowerCase()}`
  ];
  
  // Add features as keywords
  const featureKeywords = [];
  if (property.totalRooms) featureKeywords.push(`${property.totalRooms} locali`);
  if (property.bedrooms) featureKeywords.push(`${property.bedrooms} camere da letto`);
  if (property.bathrooms) featureKeywords.push(`${property.bathrooms} bagni`);
  if (property.sqft) featureKeywords.push(`${property.sqft} m²`);
  if (property.garage) featureKeywords.push('con garage');
  if (property.outdoorParking) featureKeywords.push('con parcheggio');
  
  return [...baseKeywords, ...featureKeywords].join(', ');
}

/**
 * Generates title for a property
 */
export function generatePropertyTitle(property: Property): string {
  return `${property.category} ${property.contractType === 'Vendita' ? 'in vendita' : 'in affitto'} - ${property.city} | BrickByBrick Immobiliare`;
}
