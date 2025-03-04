import React, { useEffect, useState } from 'react';
import { fetchProperties } from '../services/propertyService';
import { Property } from '../types';

/**
 * Component to display debug information about CMS properties
 * This is useful for debugging the CMS integration
 */
const CMSPropertyDebugInfo: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>('Unknown');

  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        const data = await fetchProperties();
        setProperties(data);
        
        // Determine the data source
        if (data.length > 0) {
          if (data[0].id.includes('prop-')) {
            setDataSource('Static Data (Fallback)');
          } else if (data[0].id.includes('luxury-villa') || data[0].id.includes('modern-apartment')) {
            setDataSource('CMS Data (Content Directory)');
          } else {
            setDataSource('Local Test Data');
          }
        } else {
          setDataSource('No Data Available');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading properties:', err);
        setError('Failed to load properties');
        setDataSource('Error');
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  if (loading) {
    return <div className="p-4 bg-gray-100 rounded-lg">Loading property data...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded-lg">
        <h3 className="font-bold">Error Loading Properties</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold text-lg mb-2">CMS Property Debug Info</h3>
      <div className="mb-4">
        <span className="font-semibold">Data Source:</span> 
        <span className={`ml-2 px-2 py-1 rounded ${
          dataSource.includes('CMS') 
            ? 'bg-green-200 text-green-800' 
            : dataSource.includes('Static') 
              ? 'bg-yellow-200 text-yellow-800'
              : 'bg-blue-200 text-blue-800'
        }`}>
          {dataSource}
        </span>
      </div>
      
      <div className="mb-4">
        <span className="font-semibold">Properties Loaded:</span> 
        <span className="ml-2">{properties.length}</span>
      </div>
      
      <div className="mb-4">
        <span className="font-semibold">Featured Properties:</span> 
        <span className="ml-2">{properties.filter(p => p.featured).length}</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Type</th>
              <th className="px-4 py-2 border">Featured</th>
              <th className="px-4 py-2 border">Images</th>
            </tr>
          </thead>
          <tbody>
            {properties.slice(0, 5).map((property) => (
              <tr key={property.id}>
                <td className="px-4 py-2 border">{property.id}</td>
                <td className="px-4 py-2 border">{property.title}</td>
                <td className="px-4 py-2 border">{property.price ? `€${property.price.toLocaleString()}` : 'N/A'}</td>
                <td className="px-4 py-2 border">{property.category}</td>
                <td className="px-4 py-2 border">{property.featured ? '✓' : '✗'}</td>
                <td className="px-4 py-2 border">{property.images.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {properties.length > 5 && (
          <p className="mt-2 text-sm text-gray-600">Showing 5 of {properties.length} properties</p>
        )}
      </div>
    </div>
  );
};

export default CMSPropertyDebugInfo;
