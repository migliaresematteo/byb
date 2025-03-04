import { Property } from '../types';

// This is a temporary fallback to the static data until CMS data is available
import { properties as staticProperties } from '../data/properties';

/**
 * Fetches all properties from the CMS
 * @returns Promise<Property[]> - A promise that resolves to an array of properties
 */
export async function fetchProperties(): Promise<Property[]> {
  let cmsProperties: Property[] = [];
  let localTestProperties: Property[] = [];
  
  try {
    // Try multiple paths for CMS properties to handle different environments
    const possiblePaths = [
      '/content/properties/index.json',
      './content/properties/index.json',
      '../content/properties/index.json',
      '/properties/index.json'
    ];
    
    // Try to fetch properties from the CMS (deployed environment)
    console.log('Attempting to fetch CMS properties...');
    let cmsSuccess = false;
    
    for (const path of possiblePaths) {
      if (cmsSuccess) break;
      
      try {
        console.log(`Trying path: ${path}`);
        const cmsResponse = await fetch(path);
        console.log(`Response for ${path}:`, cmsResponse.status);
        
        if (cmsResponse.ok) {
          const cmsData = await cmsResponse.json();
          console.log(`Data fetched successfully from ${path}:`, cmsData.length, 'properties');
          
          // Map the CMS data to our Property type
          cmsProperties = cmsData.map((item: any) => {
            // Extract the property ID from the file path
            const id = item.slug || (item.path ? item.path.split('/').pop().replace('.md', '') : '') || item.id || `prop-${Math.random().toString(36).substr(2, 9)}`;
            
            // Log the item for debugging
            console.log('Processing CMS property:', id);
            
            // Map CMS fields to our Property type
            return {
              id,
              title: item.title || '',
              price: item.price || null,
              city: item.location ? item.location.split(',').pop()?.trim() : '',
              address: item.address || '',
              category: item.type || '',
              totalRooms: item.bedrooms || null,
              bedrooms: item.bedrooms || null,
              bathrooms: item.bathrooms || null,
              sqft: item.squareMeters || 0,
              garage: 0, // Default value, update if CMS provides this
              outdoorParking: 0, // Default value, update if CMS provides this
              images: item.images ? item.images.map((img: any) => img.image || img) : [],
              imageUrl: item.featuredImage || (item.images && item.images.length > 0 ? (item.images[0].image || item.images[0]) : ''),
              description: item.description || '',
              context: '', // Default value, update if CMS provides this
              features: item.features || [],
              condition: '', // Default value, update if CMS provides this
              floorLevel: null, // Default value, update if CMS provides this
              coordinates: {
                lat: item.coordinates?.lat || 0,
                lng: item.coordinates?.lng || 0
              },
              lastUpdate: new Date().toISOString().split('T')[0], // Use current date as fallback
              projectType: item.status === 'For Sale' ? 'Vendita' : 'Affitto',
              contractType: item.status || '',
              totalUnits: null, // Default value, update if CMS provides this
              floors: 1, // Default value, update if CMS provides this
              floor: null, // Default value, update if CMS provides this
              parking: '', // Default value, update if CMS provides this
              heating: '', // Default value, update if CMS provides this
              airConditioning: '', // Default value, update if CMS provides this
              featured: item.featured || false // Add featured field mapping
            };
          });
          
          console.log('Successfully processed CMS properties:', cmsProperties.length);
          cmsSuccess = true;
          break;
        }
      } catch (pathError) {
        console.warn(`Error fetching from ${path}:`, pathError);
      }
    }
    
    if (!cmsSuccess) {
      console.warn('Failed to fetch CMS properties from any path');
    }
    
    // Try to fetch local test properties (local development) if CMS fetch failed
    if (cmsProperties.length === 0) {
      console.log('Attempting to fetch local test properties...');
      
      // Try the same paths for local properties
      for (const path of possiblePaths) {
        try {
          console.log(`Trying local path: ${path}`);
          const localResponse = await fetch(path);
          console.log(`Local response for ${path}:`, localResponse.status);
          
          if (localResponse.ok) {
            const localData = await localResponse.json();
            console.log(`Local data fetched successfully from ${path}:`, localData.length, 'properties');
            
            // Map the local test data to our Property type (same mapping as CMS)
            localTestProperties = localData.map((item: any) => {
              const id = item.slug || (item.path ? item.path.split('/').pop().replace('.md', '') : '') || item.id || `prop-${Math.random().toString(36).substr(2, 9)}`;
              
              console.log('Processing local property:', id);
              
              return {
                id,
                title: item.title || '',
                price: item.price || null,
                city: item.location ? item.location.split(',').pop()?.trim() : '',
                address: item.address || '',
                category: item.type || '',
                totalRooms: item.bedrooms || null,
                bedrooms: item.bedrooms || null,
                bathrooms: item.bathrooms || null,
                sqft: item.squareMeters || 0,
                garage: 0,
                outdoorParking: 0,
                images: item.images ? item.images.map((img: any) => img.image || img) : [],
                imageUrl: item.featuredImage || (item.images && item.images.length > 0 ? (item.images[0].image || item.images[0]) : ''),
                description: item.description || '',
                context: '',
                features: item.features || [],
                condition: '',
                floorLevel: null,
                coordinates: {
                  lat: item.coordinates?.lat || 0,
                  lng: item.coordinates?.lng || 0
                },
                lastUpdate: new Date().toISOString().split('T')[0],
                projectType: item.status === 'For Sale' ? 'Vendita' : 'Affitto',
                contractType: item.status || '',
                totalUnits: null,
                floors: 1,
                floor: null,
                parking: '',
                heating: '',
                airConditioning: '',
                featured: item.featured || false
              };
            });
            
            console.log('Successfully processed local test properties:', localTestProperties.length);
            break;
          }
        } catch (localPathError) {
          console.warn(`Error fetching local properties from ${path}:`, localPathError);
        }
      }
    }
    
    // Combine properties from both sources, avoiding duplicates by ID
    const allProperties = [...cmsProperties];
    
    // Add local test properties that don't exist in CMS properties
    localTestProperties.forEach(localProp => {
      if (!allProperties.some(prop => prop.id === localProp.id)) {
        allProperties.push(localProp);
      }
    });
    
    console.log('Combined properties count:', allProperties.length);
    
    // If we have properties from either source, return them
    if (allProperties.length > 0) {
      console.log('Returning combined properties');
      return allProperties;
    }
    
    // If we couldn't get properties from either source, fall back to static data
    console.warn('No properties found from CMS or local test files. Falling back to static data.');
    console.log('Static properties count:', staticProperties.length);
    return staticProperties;
    
  } catch (error) {
    console.error('Error in fetchProperties:', error);
    
    // Fallback to static data if all fetches fail
    console.warn('Falling back to static property data due to error');
    console.log('Static properties count:', staticProperties.length);
    return staticProperties;
  }
}

/**
 * Fetches a single property by ID from the CMS
 * @param id - The ID of the property to fetch
 * @returns Promise<Property | undefined> - A promise that resolves to a property or undefined
 */
export async function fetchPropertyById(id: string): Promise<Property | undefined> {
  console.log('Fetching property by ID:', id);
  const properties = await fetchProperties();
  const property = properties.find(property => property.id === id);
  console.log('Found property:', property ? 'Yes' : 'No');
  return property;
}
