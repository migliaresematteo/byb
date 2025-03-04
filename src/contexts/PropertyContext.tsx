import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Property } from '../types';
import { fetchProperties } from '../services/propertyService';

// Define the context type
interface PropertyContextType {
  properties: Property[];
  loading: boolean;
  error: string | null;
  refetchProperties: () => Promise<void>;
}

// Create the context with default values
const PropertyContext = createContext<PropertyContextType>({
  properties: [],
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch properties
  const fetchPropertyData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProperties();
      setProperties(data);
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
