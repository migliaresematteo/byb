import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Property } from '../types';
import { StrapiRawProperty } from '../types/strapi';
import { strapiService } from '../services/strapiService';

// Define the context type
interface PropertyContextType {
  properties: Property[];
  rawProperties: StrapiRawProperty[];
  loading: boolean;
  error: string | null;
  refetchProperties: () => Promise<void>;
}

// Create the context with default values
const PropertyContext = createContext<PropertyContextType>({
  properties: [],
  rawProperties: [],
  loading: true,
  error: null,
  refetchProperties: async () => {}
});

// Custom hook to use the property context
export const useProperties = () => useContext(PropertyContext);

// Provider component
interface PropertyProviderProps {
  children: ReactNode;
}

export const PropertyProvider = ({ children }: PropertyProviderProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [rawProperties, setRawProperties] = useState<StrapiRawProperty[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch properties
  const fetchPropertyData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await strapiService.getProperties();
      if (response?.data) {
        setRawProperties(response.data);
        // Transform the data for the properties state
        const transformedProperties = response.data.map(item => {
          // Check if item and item.attributes exist
          if (!item || !item.attributes) {
            console.error('Invalid property item structure:', item);
            return null;
          }
          
          const attr = item.attributes;
          return {
            id: item.id,
            title: attr.Nome_Immobile || '',
            price: attr.Prezzo,
            city: attr.Città || '',
            address: attr.Indirizzo || '',
            category: attr.Tipologia || '',
            totalRooms: attr.Numero_Locali,
            bathrooms: attr.Bagni,
            sqft: attr.Superficie || 0,
            parking: attr.Box_PostiAuto_Garage || '',
            images: attr.Immagini_Carosello?.data?.map(img => img.attributes.url) || [],
            imageUrl: attr.Immagine_Copertina?.data?.attributes?.url || '',
            description: attr.Descrizione || '',
            lastUpdate: attr.Data_Aggiornamento || '',
            airConditioning: attr.Climatizzazione || '',
            heating: attr.Riscaldamento || '',
            coordinates: {
              lat: attr.Coordinate_LATITUDINE || 0,
              lng: attr.Coordinate_LONGITUDINE || 0
            },
            floors: attr.Piani || 0,
            featured: attr.In_Evidenza ?? false,
            projectType: 'Residenziale',
            contractType: 'Vendita',
            context: '',
            condition: 'Buono'
          };
        }).filter(item => item !== null);
        setProperties(transformedProperties);
      }
    } catch (err) {
      console.error('Failed to fetch properties:', err);
      setError('Failed to load properties. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch properties on component mount
  useEffect(() => {
    fetchPropertyData();
  }, []);

  // Context value
  const value = {
    properties,
    rawProperties,
    loading,
    error,
    refetchProperties: fetchPropertyData
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
};
