import { Property } from '../types';
import { properties as staticProperties } from '../data/properties';

/**
 * Fetches all properties from the CMS
 * @returns Promise<Property[]> - A promise that resolves to an array of properties
 */
export async function fetchProperties(): Promise<Property[]> {
  try {
    // Try to fetch from CMS
    const response = await fetch('/admin/config.yml');
    if (!response.ok) {
      console.warn('CMS config not found, falling back to static data');
      return staticProperties;
    }

    // If CMS is available, try to fetch properties directly from GitHub
    try {
      // Fetch the list of properties from the GitHub API
      const githubApiUrl = 'https://api.github.com/repos/migliaresematteo/byb/contents/content/properties';
      const githubResponse = await fetch(githubApiUrl);
      
      if (githubResponse.ok) {
        const files = await githubResponse.json();
        const markdownFiles = files.filter((file: any) => file.name.endsWith('.md') && file.name !== '.gitkeep');
        
        const propertyPromises = markdownFiles.map(async (file: any) => {
          try {
            // Use the raw content URL from GitHub
            const contentResponse = await fetch(file.download_url);
            if (!contentResponse.ok) return null;
            
            const content = await contentResponse.text();
            const property = parseMarkdownProperty(content, file.name);
            return property;
          } catch (error) {
            console.warn(`Failed to fetch property ${file.name}:`, error);
            return null;
          }
        });

        const properties = (await Promise.all(propertyPromises)).filter((p): p is Property => p !== null);
        if (properties.length > 0) {
          return properties;
        }
      } else {
        console.warn('GitHub API request failed, falling back to local content');
      }
    } catch (error) {
      console.warn('Could not fetch markdown files from GitHub:', error);
    }

    // Try to fetch from local content directory as fallback
    try {
      const localFiles = await fetch('/api/properties');
      if (localFiles.ok) {
        const properties = await localFiles.json();
        if (properties.length > 0) {
          return properties;
        }
      }
    } catch (error) {
      console.warn('Could not fetch from local API:', error);
    }

    // If no CMS properties found, fall back to static data
    console.warn('No properties found in CMS. Falling back to static data.');
    return staticProperties;
  } catch (error) {
    console.error('Error in fetchProperties:', error);
    return staticProperties;
  }
}

function parseMarkdownProperty(content: string, filename: string): Property | null {
  try {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!frontmatterMatch) return null;

    const [, frontmatter, body] = frontmatterMatch;
    const data = parseFrontmatter(frontmatter);
    return mapPropertyData({ ...data, description: data.description || body.trim(), id: filename.replace('.md', '') });
  } catch (error) {
    console.error('Error parsing markdown property:', error);
    return null;
  }
}

function parseFrontmatter(frontmatter: string): any {
  const data: any = {};
  const lines = frontmatter.split('\n');
  let currentKey = '';
  let isArray = false;
  let isNestedObject = false;
  let nestedObjectKey = '';

  lines.forEach(line => {
    const keyMatch = line.match(/^([^:]+):\s*(.*)$/);
    const arrayItemMatch = line.match(/^\s*-\s*(.+)$/);
    const nestedKeyMatch = line.match(/^\s\s([^:]+):\s*(.*)$/);

    if (keyMatch) {
      const [, key, value] = keyMatch;
      currentKey = key.trim();
      if (!value.trim()) {
        isArray = true;
        isNestedObject = false;
        data[currentKey] = [];
      } else if (value.trim() === '{') {
        isArray = false;
        isNestedObject = true;
        data[currentKey] = {};
      } else {
        isArray = false;
        isNestedObject = false;
        data[currentKey] = parseValue(value.trim());
      }
    } else if (arrayItemMatch && isArray) {
      data[currentKey].push(arrayItemMatch[1].trim());
    } else if (nestedKeyMatch && isNestedObject) {
      const [, nestedKey, nestedValue] = nestedKeyMatch;
      nestedObjectKey = nestedKey.trim();
      data[currentKey][nestedObjectKey] = parseValue(nestedValue.trim());
    }
  });

  return data;
}

function parseValue(value: string): any {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (!isNaN(Number(value))) return Number(value);
  return value;
}

function mapPropertyData(item: any): Property {
  return {
    id: item.id || item.slug || '',
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
    images: item.images ? (Array.isArray(item.images) ? item.images.map((img: any) => img.image || img) : [item.images]) : [],
    imageUrl: item.featuredImage || (item.images && item.images.length > 0 ? (item.images[0].image || item.images[0]) : ''),
    description: item.description || '',
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
}

/**
 * Fetches a single property by ID from the CMS
 * @param id - The ID of the property to fetch
 * @returns Promise<Property | undefined> - A promise that resolves to a property or undefined
 */
export async function fetchPropertyById(id: string): Promise<Property | undefined> {
  try {
    // Try to fetch from GitHub first
    try {
      const githubApiUrl = `https://api.github.com/repos/migliaresematteo/byb/contents/content/properties/${id}.md`;
      const githubResponse = await fetch(githubApiUrl);
      
      if (githubResponse.ok) {
        const fileInfo = await githubResponse.json();
        const contentResponse = await fetch(fileInfo.download_url);
        
        if (contentResponse.ok) {
          const content = await contentResponse.text();
          const property = parseMarkdownProperty(content, `${id}.md`);
          if (property) return property;
        }
      }
    } catch (error) {
      console.warn(`Could not fetch property ${id} from GitHub:`, error);
    }
    
    // Try to fetch from local content as fallback
    try {
      const response = await fetch(`/content/properties/${id}.md`);
      if (response.ok) {
        const content = await response.text();
        const property = parseMarkdownProperty(content, `${id}.md`);
        if (property) return property;
      }
    } catch (error) {
      console.warn(`Could not fetch property ${id} from local content:`, error);
    }
  } catch (error) {
    console.warn(`Could not fetch property ${id} from CMS:`, error);
  }

  // If property not found in CMS, try static data
  return staticProperties.find(p => p.id === id);
}
