import React, { useState, useEffect } from 'react';
import { useProperties } from '../contexts/PropertyContext';

/**
 * A debug component that displays information about property data sources
 * Only visible in development mode
 */
export function PropertyDebugInfo() {
  const { properties, loading, error } = useProperties();
  const [isVisible, setIsVisible] = useState(false);
  const [dataSources, setDataSources] = useState<{
    cmsProperties: number;
    localProperties: number;
    staticProperties: boolean;
  }>({
    cmsProperties: 0,
    localProperties: 0,
    staticProperties: false
  });

  useEffect(() => {
    // Only run in development mode
    if (process.env.NODE_ENV !== 'development') return;

    const checkDataSources = async () => {
      try {
        // Check CMS properties
        const cmsResponse = await fetch('/content/properties/index.json');
        let cmsCount = 0;
        if (cmsResponse.ok) {
          const cmsData = await cmsResponse.json();
          cmsCount = cmsData.length;
        }

        // Check local properties
        const localResponse = await fetch('/content/properties/index.json');
        let localCount = 0;
        if (localResponse.ok) {
          const localData = await localResponse.json();
          localCount = localData.length;
        }

        // Update state
        setDataSources({
          cmsProperties: cmsCount,
          localProperties: localCount,
          staticProperties: properties.length > 0 && cmsCount === 0 && localCount === 0
        });
      } catch (error) {
        console.error('Error checking data sources:', error);
      }
    };

    checkDataSources();
  }, [properties]);

  // Only render in development mode
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm"
      >
        {isVisible ? 'Hide Debug' : 'Show Debug'}
      </button>

      {isVisible && (
        <div className="bg-gray-800 text-white p-4 rounded-md mt-2 text-sm w-64">
          <h3 className="font-bold mb-2">Property Data Sources</h3>
          <ul>
            <li>Total Properties: {properties.length}</li>
            <li>CMS Properties: {dataSources.cmsProperties}</li>
            <li>Local Properties: {dataSources.localProperties}</li>
            <li>Using Static Fallback: {dataSources.staticProperties ? 'Yes' : 'No'}</li>
          </ul>
          <div className="mt-2">
            <p>Loading: {loading ? 'Yes' : 'No'}</p>
            {error && <p className="text-red-400">Error: {error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
