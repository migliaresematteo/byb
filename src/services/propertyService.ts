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
    // Try to fetch properties from the CMS (deployed environment)
    const cmsResponse = await fetch('/content/properties/index.json');
    
    if (cmsResponse.ok) {
      const cmsData = await cmsResponse.json();
      
      // Map the CMS data to our Property type
      cmsProperties = cmsData.map((item: any) => {
        // Extract the property ID from the file path
        const id = item.slug || item.path?.split('/').pop().replace('.md', '') || item.id;
        
        // Map CMS fields to our Property type
        return {
          id,
          title: item.title || '',
          price: item.price || null,
          city: item.location?.split(',').pop()?.trim() || '',
          address: item.address || '',
          category: item.type || '',
          totalRooms: item.bedrooms || null,
          bedrooms: item.bedrooms || null,
          bathrooms: item.bathrooms || null,
          sqft: item.squareMeters || 0,
          garage: 0, // Default value, update if CMS provides this
          outdoorParking: 0, // Default value, update if CMS provides this
          images: item.images?.map((img: any) => img.image) || [],
          imageUrl: item.featuredImage || '',
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
      
      console.log('Successfully fetched properties from CMS:', cmsProperties.length);
    }
    
    // Try to fetch local test properties (local development)
    try {
      const localResponse = await fetch('/content/properties/index.json');
      
      if (localResponse.ok) {
        const localData = await localResponse.json();
        
        // Map the local test data to our Property type (same mapping as CMS)
        localTestProperties = localData.map((item: any) => {
          const id = item.slug || item.path?.split('/').pop().replace('.md', '') || item.id;
          
          return {
            id,
            title: item.title || '',
            price: item.price || null,
            city: item.location?.split(',').pop()?.trim() || '',
            address: item.address || '',
            category: item.type || '',
            totalRooms: item.bedrooms || null,
            bedrooms: item.bedrooms || null,
            bathrooms: item.bathrooms || null,
            sqft: item.squareMeters || 0,
            garage: 0,
            outdoorParking: 0,
            images: item.images?.map((img: any) => img.image) || [],
            imageUrl: item.featuredImage || '',
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
        
        console.log('Successfully fetched local test properties:', localTestProperties.length);
      }
    } catch (localError) {
      console.warn('Error fetching local test properties:', localError);
    }
    
    // Combine properties from both sources, avoiding duplicates by ID
    const allProperties = [...cmsProperties];
    
    // Add local test properties that don't exist in CMS properties
    localTestProperties.forEach(localProp => {
      if (!allProperties.some(prop => prop.id === localProp.id)) {
        allProperties.push(localProp);
      }
    });
    
    // If we have properties from either source, return them
    if (allProperties.length > 0) {
      return allProperties;
    }
    
    // If we couldn't get properties from either source, fall back to static data
    console.warn('No properties found from CMS or local test files. Falling back to static data.');
    return staticProperties;
    
  } catch (error) {
    console.error('Error fetching properties:', error);
    
    // Fallback to static data if all fetches fail
    console.warn('Falling back to static property data');
    return staticProperties;
  }
}

/**
 * Fetches a single property by ID from the CMS
 * @param id - The ID of the property to fetch
 * @returns Promise<Property | undefined> - A promise that resolves to a property or undefined
 */
export async function fetchPropertyById(id: string): Promise<Property | undefined> {
  const properties = await fetchProperties();
  return properties.find(property => property.id === id);
}
