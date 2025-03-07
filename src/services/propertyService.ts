import { Property } from '../types';

// This is a temporary fallback to the static data until CMS data is available
import { properties as staticProperties } from '../data/properties';

/**
 * Fetches all properties from the CMS
 * @returns Promise<Property[]> - A promise that resolves to an array of properties
 */
export async function fetchProperties(): Promise<Property[]> {
  let cmsProperties: Property[] = [];
  
  try {
    // Fetch the list of markdown files from the CMS
    const response = await fetch('/.netlify/git/github/contents/content/properties');
    
    if (!response.ok) {
      throw new Error('Failed to fetch properties list');
    }

    const files = await response.json();
    const markdownFiles = files.filter((file: any) => file.name.endsWith('.md'));

    // Fetch each property file
    const propertyPromises = markdownFiles.map(async (file: any) => {
      const contentResponse = await fetch(file.download_url);
      if (!contentResponse.ok) {
        console.warn(`Failed to fetch property: ${file.name}`);
        return null;
      }

      const content = await contentResponse.text();
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      
      if (!frontmatterMatch) {
        console.warn(`Invalid frontmatter in property: ${file.name}`);
        return null;
      }

      const [, frontmatter, description] = frontmatterMatch;
      const item = parseFrontmatter(frontmatter);
      
      // Extract the property ID from the file name
      const id = file.name.replace('.md', '');
      
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
        garage: item.garage || 0,
        outdoorParking: item.outdoorParking || 0,
        images: item.images ? item.images.map((img: any) => img.image || img) : [],
        imageUrl: item.featuredImage || (item.images && item.images.length > 0 ? (item.images[0].image || item.images[0]) : ''),
        description: description.trim() || item.description || '',
        context: item.context || '',
        features: item.features || [],
        condition: item.condition || '',
        floorLevel: item.floorLevel || null,
        coordinates: {
          lat: item.coordinates?.lat || 0,
          lng: item.coordinates?.lng || 0
        },
        lastUpdate: item.lastUpdate || new Date().toISOString().split('T')[0],
        projectType: item.status === 'For Sale' ? 'Vendita' : 'Affitto',
        contractType: item.status || '',
        totalUnits: item.totalUnits || null,
        floors: item.floors || 1,
        floor: item.floor || null,
        parking: item.parking || '',
        heating: item.heating || '',
        airConditioning: item.airConditioning || '',
        featured: item.featured || false
      };
    });

    // Wait for all properties to be fetched and filter out any failed ones
    const properties = (await Promise.all(propertyPromises)).filter((p): p is Property => p !== null);
    
    if (properties.length > 0) {
      return properties;
    }

    // Fallback to static data if no properties were found
    console.warn('No properties found. Falling back to static data.');
    return staticProperties;
    
  } catch (error) {
    console.error('Error in fetchProperties:', error);
    return staticProperties;
  }
}

function parseFrontmatter(frontmatter: string): any {
  try {
    // Simple YAML-like parser for frontmatter
    const lines = frontmatter.split('\n');
    const data: any = {};
    
    lines.forEach(line => {
      const match = line.match(/^([^:]+):\s*(.+)$/);
      if (match) {
        const [, key, value] = match;
        // Handle arrays
        if (value.startsWith('[') && value.endsWith(']')) {
          data[key] = value.slice(1, -1).split(',').map(v => v.trim());
        }
        // Handle numbers
        else if (!isNaN(Number(value))) {
          data[key] = Number(value);
        }
        // Handle booleans
        else if (value === 'true' || value === 'false') {
          data[key] = value === 'true';
        }
        // Handle everything else as strings
        else {
          data[key] = value;
        }
      }
    });
    
    return data;
  } catch (error) {
    console.error('Error parsing frontmatter:', error);
    return {};
  }
}

/**
 * Fetches a single property by ID from the CMS
 * @param id - The ID of the property to fetch
 * @returns Promise<Property | undefined> - A promise that resolves to a property or undefined
 */
export async function fetchPropertyById(id: string): Promise<Property | undefined> {
  try {
    const response = await fetch(`/.netlify/git/github/contents/content/properties/${id}.md`);
    
    if (!response.ok) {
      throw new Error('Property not found');
    }

    const content = await response.text();
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    
    if (!frontmatterMatch) {
      throw new Error('Invalid frontmatter');
    }

    const [, frontmatter, description] = frontmatterMatch;
    const item = parseFrontmatter(frontmatter);
    
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
      garage: item.garage || 0,
      outdoorParking: item.outdoorParking || 0,
      images: item.images ? item.images.map((img: any) => img.image || img) : [],
      imageUrl: item.featuredImage || (item.images && item.images.length > 0 ? (item.images[0].image || item.images[0]) : ''),
      description: description.trim() || item.description || '',
      context: item.context || '',
      features: item.features || [],
      condition: item.condition || '',
      floorLevel: item.floorLevel || null,
      coordinates: {
        lat: item.coordinates?.lat || 0,
        lng: item.coordinates?.lng || 0
      },
      lastUpdate: item.lastUpdate || new Date().toISOString().split('T')[0],
      projectType: item.status === 'For Sale' ? 'Vendita' : 'Affitto',
      contractType: item.status || '',
      totalUnits: item.totalUnits || null,
      floors: item.floors || 1,
      floor: item.floor || null,
      parking: item.parking || '',
      heating: item.heating || '',
      airConditioning: item.airConditioning || '',
      featured: item.featured || false
    };
  } catch (error) {
    console.error('Error fetching property by ID:', error);
    // Try to find the property in static data
    return staticProperties.find(p => p.id === id);
  }
}
