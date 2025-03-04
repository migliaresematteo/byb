import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create directories if they don't exist
const contentDir = path.join(__dirname, '..', 'src', 'content');
const propertiesDir = path.join(contentDir, 'properties');

if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

if (!fs.existsSync(propertiesDir)) {
  fs.mkdirSync(propertiesDir, { recursive: true });
}

// Read the properties file content
// Note: We can't directly import the TS file, so we'll extract the properties array using regex
const propertiesFilePath = path.join(__dirname, '..', 'src', 'data', 'properties.ts');
const fileContent = fs.readFileSync(propertiesFilePath, 'utf8');

// Find the properties array declaration
const propertiesMatch = fileContent.match(/export const properties: Property\[\] = \[([\s\S]*)\];/);

if (!propertiesMatch) {
  console.error('Could not find properties array in the file');
  process.exit(1);
}

// Parse the properties
const propertiesArrayContent = propertiesMatch[1];
// Split by property object start
const propertyChunks = propertiesArrayContent.split(/\n\s*{\s*\n/);

// Process each property - note this is not perfect parsing but should work for our format
for (let i = 1; i < propertyChunks.length; i++) {
  try {
    const chunk = '{' + propertyChunks[i];
    
    // Extract ID
    const idMatch = chunk.match(/id:\s*'([^']+)'/);
    if (!idMatch) {
      console.warn(`Could not find ID in property chunk ${i}, skipping`);
      continue;
    }
    
    const id = idMatch[1];
    
    // Create a simplified JSON version of each property
    // Extract other fields
    const titleMatch = chunk.match(/title:\s*'([^']+)'/);
    const priceMatch = chunk.match(/price:\s*([0-9]+)/);
    const cityMatch = chunk.match(/city:\s*'([^']+)'/);
    const addressMatch = chunk.match(/address:\s*'([^']+)'/);
    const categoryMatch = chunk.match(/category:\s*'([^']+)'/);
    const totalRoomsMatch = chunk.match(/totalRooms:\s*([0-9]+)/);
    const bedroomsMatch = chunk.match(/bedrooms:\s*([0-9]+)/);
    const bathroomsMatch = chunk.match(/bathrooms:\s*([0-9]+)/);
    const sqftMatch = chunk.match(/sqft:\s*([0-9]+)/);
    const garageMatch = chunk.match(/garage:\s*([0-9]+)/);
    const outdoorParkingMatch = chunk.match(/outdoorParking:\s*([0-9]+)/);
    const imageUrlMatch = chunk.match(/imageUrl:\s*'([^']+)'/);
    const conditionMatch = chunk.match(/condition:\s*'([^']+)'/);
    const floorLevelMatch = chunk.match(/floorLevel:\s*'([^']+)'/);
    const projectTypeMatch = chunk.match(/projectType:\s*'([^']+)'/);
    const contractTypeMatch = chunk.match(/contractType:\s*'([^']+)'/);
    const totalUnitsMatch = chunk.match(/totalUnits:\s*([0-9]+)/);
    const floorsMatch = chunk.match(/floors:\s*([0-9]+)/);
    const floorMatch = chunk.match(/floor:\s*'([^']+)'/);
    const parkingMatch = chunk.match(/parking:\s*'([^']+)'/);
    const heatingMatch = chunk.match(/heating:\s*'([^']+)'/);
    const airConditioningMatch = chunk.match(/airConditioning:\s*'([^']+)'/);
    
    // Extract coordinates
    const coordinatesMatch = chunk.match(/coordinates:\s*{\s*lat:\s*([\d.-]+),\s*lng:\s*([\d.-]+)\s*}/);
    
    // Extract features array
    const featuresMatch = chunk.match(/features:\s*\[(.*?)\]/s);
    let features = [];
    if (featuresMatch) {
      // Extract strings from the features array
      const featureMatches = featuresMatch[1].match(/'([^']+)'/g);
      if (featureMatches) {
        features = featureMatches.map(f => f.replace(/'/g, ''));
      }
    }
    
    // Extract description - this is a bit more complex due to multiline strings
    const descriptionMatch = chunk.match(/description:\s*`([\s\S]*?)`/);
    
    // Extract context
    const contextMatch = chunk.match(/context:\s*`([\s\S]*?)`/);
    
    // Extract images - we'll just use placeholder URLs for now as the real images are imports
    const imagesMatch = chunk.match(/images:\s*\[([\s\S]*?)\]/);
    let images = [];
    if (imagesMatch) {
      // Just count the number of images
      const imageCount = (imagesMatch[1].match(/,/g) || []).length + 1;
      // Create placeholder URLs
      for (let j = 0; j < imageCount; j++) {
        images.push(`/uploads/property-${id}-${j+1}.jpg`);
      }
    }
    
    // Create property object
    const property = {
      id,
      title: titleMatch ? titleMatch[1] : `Property ${id}`,
      price: priceMatch ? parseInt(priceMatch[1]) : null,
      city: cityMatch ? cityMatch[1] : '',
      address: addressMatch ? addressMatch[1] : '',
      category: categoryMatch ? categoryMatch[1] : '',
      totalRooms: totalRoomsMatch ? parseInt(totalRoomsMatch[1]) : null,
      bedrooms: bedroomsMatch ? parseInt(bedroomsMatch[1]) : null,
      bathrooms: bathroomsMatch ? parseInt(bathroomsMatch[1]) : null,
      sqft: sqftMatch ? parseInt(sqftMatch[1]) : 0,
      garage: garageMatch ? parseInt(garageMatch[1]) : 0,
      outdoorParking: outdoorParkingMatch ? parseInt(outdoorParkingMatch[1]) : 0,
      imageUrl: imageUrlMatch ? imageUrlMatch[1] : (images.length > 0 ? images[0] : ''),
      images,
      description: descriptionMatch ? descriptionMatch[1] : '',
      context: contextMatch ? contextMatch[1] : '',
      features,
      condition: conditionMatch ? conditionMatch[1] : '',
      floorLevel: floorLevelMatch ? floorLevelMatch[1] : '',
      lat: coordinatesMatch ? parseFloat(coordinatesMatch[1]) : 0,
      lng: coordinatesMatch ? parseFloat(coordinatesMatch[2]) : 0,
      lastUpdate: new Date().toISOString().split('T')[0],
      projectType: projectTypeMatch ? projectTypeMatch[1] : '',
      contractType: contractTypeMatch ? contractTypeMatch[1] : '',
      totalUnits: totalUnitsMatch ? parseInt(totalUnitsMatch[1]) : null,
      floors: floorsMatch ? parseInt(floorsMatch[1]) : 1,
      floor: floorMatch ? floorMatch[1] : '',
      parking: parkingMatch ? parkingMatch[1] : '',
      heating: heatingMatch ? heatingMatch[1] : '',
      airConditioning: airConditioningMatch ? airConditioningMatch[1] : '',
    };
    
    // Write property to file
    const propertyFilePath = path.join(propertiesDir, `${id}.json`);
    fs.writeFileSync(propertyFilePath, JSON.stringify(property, null, 2));
    console.log(`Created property file: ${propertyFilePath}`);
  } catch (error) {
    console.error(`Error processing property chunk ${i}:`, error);
  }
}

console.log('Property migration complete!');
