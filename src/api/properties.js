// Simple API endpoint to fetch properties from the local filesystem
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const propertiesDir = path.join(process.cwd(), 'content', 'properties');
    
    // Check if directory exists
    if (!fs.existsSync(propertiesDir)) {
      return res.status(404).json({ error: 'Properties directory not found' });
    }
    
    // Read all files from the directory
    const files = fs.readdirSync(propertiesDir);
    const markdownFiles = files.filter(file => file.endsWith('.md') && file !== '.gitkeep');
    
    // Read and parse each markdown file
    const properties = markdownFiles.map(filename => {
      const filePath = path.join(propertiesDir, filename);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // Parse frontmatter
      const frontmatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (!frontmatterMatch) return null;
      
      const [, frontmatter, body] = frontmatterMatch;
      const data = parseFrontmatter(frontmatter);
      
      // Map to property format
      return {
        id: filename.replace('.md', ''),
        title: data.title || '',
        price: data.price || null,
        location: data.location || '',
        address: data.address || '',
        type: data.type || '',
        status: data.status || '',
        featured: data.featured || false,
        featuredImage: data.featuredImage || '',
        images: data.images || [],
        bedrooms: data.bedrooms || null,
        bathrooms: data.bathrooms || null,
        squareMeters: data.squareMeters || 0,
        features: data.features || [],
        coordinates: data.coordinates || { lat: 0, lng: 0 },
        description: data.description || body.trim()
      };
    }).filter(Boolean);
    
    return res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return res.status(500).json({ error: 'Failed to fetch properties' });
  }
}

// Helper function to parse frontmatter
function parseFrontmatter(frontmatter) {
  const data = {};
  const lines = frontmatter.split('\n');
  let currentKey = '';
  let isArray = false;
  let isNestedObject = false;
  
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
      data[currentKey][nestedKey.trim()] = parseValue(nestedValue.trim());
    }
  });
  
  return data;
}

// Helper function to parse values
function parseValue(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (!isNaN(Number(value))) return Number(value);
  return value;
}
