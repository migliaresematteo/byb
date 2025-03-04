import { Property } from '../types';

// This is a temporary fallback to the static data until CMS data is available
import { properties as staticProperties } from '../data/properties';

/**
 * Fetches all properties from the CMS
 * @returns Promise<Property[]> - A promise that resolves to an array of properties
 */
export async function fetchProperties(): Promise<Property[]> {
  try {
    // Fetch properties from the CMS
    const response = await fetch('/content/properties/index.json');
    
    // If the response is not ok, throw an error
    if (!response.ok) {
      throw new Error(`Failed to fetch properties: ${response.statusText}`);
    }
    
    // Parse the response as JSON
    const data = await response.json();
    
    // Map the CMS data to our Property type
    const properties: Property[] = data.map((item: any) => {
      // Extract the property ID from the file path
      const id = item.slug || item.path.split('/').pop().replace('.md', '');
      
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
    
    return properties;
  } catch (error) {
    console.error('Error fetching properties from CMS:', error);
    
    // Fallback to static data if CMS fetch fails
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
