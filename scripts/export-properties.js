/**
 * Script to export static properties to a JSON file
 * This is needed because we can't directly import TypeScript files in our migration script
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const propertiesSourcePath = path.resolve(__dirname, '../src/data/properties.ts');
const propertiesOutputPath = path.resolve(__dirname, '../src/data/properties.json');

// Read the properties.ts file
const propertiesTs = fs.readFileSync(propertiesSourcePath, 'utf8');

// Extract the properties array
const propertiesMatch = propertiesTs.match(/export const properties: Property\[\] = \[([\s\S]*)\];/);

if (!propertiesMatch) {
  console.error('Could not find properties array in properties.ts');
  process.exit(1);
}

// Extract property objects
const propertiesContent = propertiesMatch[1];
const propertyObjects = [];

// Split by property object start
const propertyRegex = /\{[\s\S]*?id: ['"]([^'"]+)['"][\s\S]*?\}/g;
let match;

while ((match = propertyRegex.exec(propertiesContent)) !== null) {
  const propertyContent = match[0];
  
  // Extract property fields
  const property = {
    id: '',
    title: '',
    price: 0,
    city: '',
    address: '',
    category: '',
    totalRooms: 0,
    bedrooms: null,
    bathrooms: null,
    sqft: 0,
    garage: 0,
    outdoorParking: 0,
    images: [],
    imageUrl: '',
    description: '',
    context: '',
    features: [],
    condition: '',
    coordinates: { lat: 0, lng: 0 },
    lastUpdate: '',
    projectType: '',
    contractType: '',
    totalUnits: null,
    floors: 1,
    parking: '',
    heating: '',
    airConditioning: '',
    featured: false
  };
  
  // Extract ID
  const idMatch = propertyContent.match(/id: ['"]([^'"]+)['"]/);
  if (idMatch) property.id = idMatch[1];
  
  // Extract title
  const titleMatch = propertyContent.match(/title: ['"]([^'"]+)['"]/);
  if (titleMatch) property.title = titleMatch[1];
  
  // Extract price
  const priceMatch = propertyContent.match(/price: ([^,\n]+)/);
  if (priceMatch) {
    const priceValue = priceMatch[1].trim();
    property.price = !isNaN(parseFloat(priceValue)) ? parseFloat(priceValue) : 0;
  }
  
  // Extract category
  const categoryMatch = propertyContent.match(/category: ['"]([^'"]+)['"]/);
  if (categoryMatch) property.category = categoryMatch[1];
  
  // Extract totalRooms
  const totalRoomsMatch = propertyContent.match(/totalRooms: ([^,\n]+)/);
  if (totalRoomsMatch) {
    const roomsValue = totalRoomsMatch[1].trim();
    property.totalRooms = !isNaN(parseInt(roomsValue)) ? parseInt(roomsValue) : 0;
    property.bedrooms = property.totalRooms;
  }
  
  // Extract sqft
  const sqftMatch = propertyContent.match(/sqft: ([^,\n]+)/);
  if (sqftMatch) {
    const sqftValue = sqftMatch[1].trim();
    property.sqft = !isNaN(parseInt(sqftValue)) ? parseInt(sqftValue) : 0;
  }
  
  // Extract description
  const descriptionMatch = propertyContent.match(/description: `([\s\S]*?)`/);
  if (descriptionMatch) {
    property.description = descriptionMatch[1]
      .replace(/\\n/g, '\n')
      .replace(/\\`/g, '`')
      .trim();
  }
  
  // Extract projectType
  const projectTypeMatch = propertyContent.match(/projectType: ['"]([^'"]+)['"]/);
  if (projectTypeMatch) property.projectType = projectTypeMatch[1];
  
  // Extract lastUpdate
  const lastUpdateMatch = propertyContent.match(/lastUpdate: ['"]([^'"]+)['"]/);
  if (lastUpdateMatch) property.lastUpdate = lastUpdateMatch[1];
  
  // Extract images
  const imagesMatch = propertyContent.match(/images: \[([\s\S]*?)\]/);
  if (imagesMatch) {
    // For simplicity, we'll just use placeholder images
    // In a real migration, you'd need to handle the image paths properly
    const imageCount = (imagesMatch[1].match(/,/g) || []).length + 1;
    property.images = Array(imageCount).fill('').map((_, i) => `/images/properties/placeholder-${i + 1}.jpg`);
    property.imageUrl = property.images[0];
  }
  
  // Set featured status (random for now)
  property.featured = Math.random() > 0.7; // 30% chance of being featured
  
  // Add to properties array
  propertyObjects.push(property);
}

// Write the properties to a JSON file
fs.writeFileSync(propertiesOutputPath, JSON.stringify(propertyObjects, null, 2));

console.log(`Exported ${propertyObjects.length} properties to ${propertiesOutputPath}`);
