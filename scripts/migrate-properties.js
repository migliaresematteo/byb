/**
 * Script to migrate static property data to CMS markdown files
 * This script extracts properties from the static data and creates markdown files for each property
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const propertiesDir = path.resolve(__dirname, '../content/properties');
const publicImagesDir = path.resolve(__dirname, '../public/images/properties');

// Ensure directories exist
if (!fs.existsSync(propertiesDir)) {
  fs.mkdirSync(propertiesDir, { recursive: true });
  console.log(`Created properties directory: ${propertiesDir}`);
}

if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
  console.log(`Created public images directory: ${publicImagesDir}`);
}

// Import static properties data
// Note: We can't directly import the TypeScript file, so we'll use a JSON file
const staticPropertiesPath = path.resolve(__dirname, '../src/data/properties.json');

if (!fs.existsSync(staticPropertiesPath)) {
  console.error(`Static properties JSON file not found at ${staticPropertiesPath}`);
  console.log('Please export your properties data to JSON first using export-properties.js');
  process.exit(1);
}

const staticProperties = JSON.parse(fs.readFileSync(staticPropertiesPath, 'utf8'));

console.log(`Found ${staticProperties.length} properties to migrate`);

// Function to convert a string to a slug
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}

// Function to create a markdown file for a property
function createPropertyMarkdown(property) {
  // Generate a slug from the title
  const slug = slugify(property.title);
  
  // Create the markdown content
  let markdown = '---\n';
  markdown += `title: ${property.title}\n`;
  markdown += `description: ${property.description.split('\n')[0]}\n`; // Use first line as description
  markdown += `price: ${typeof property.price === 'number' ? property.price : 0}\n`;
  markdown += `location: ${property.city || 'Torino, Piemonte'}\n`;
  markdown += `address: ${property.address || ''}\n`;
  markdown += `type: ${property.category || 'Apartment'}\n`;
  markdown += `status: ${property.projectType === 'Vendita' ? 'For Sale' : 'For Rent'}\n`;
  markdown += `featured: ${property.featured ? 'true' : 'false'}\n`;
  
  // Handle images
  // For now, we'll just reference the first image as featuredImage
  // In a real migration, you'd need to copy the images to the public directory
  const featuredImage = property.imageUrl || (property.images && property.images.length > 0 ? property.images[0] : '');
  markdown += `featuredImage: ${featuredImage.startsWith('/') ? featuredImage : `/images/properties/${slug}-main.jpg`}\n`;
  
  // Images array
  markdown += 'images:\n';
  if (property.images && property.images.length > 0) {
    property.images.forEach((image, index) => {
      const imagePath = image.startsWith('/') ? image : `/images/properties/${slug}-${index + 1}.jpg`;
      markdown += `  - image: ${imagePath}\n`;
    });
  } else {
    markdown += `  - image: ${featuredImage.startsWith('/') ? featuredImage : `/images/properties/${slug}-main.jpg`}\n`;
  }
  
  // Add other property details
  markdown += `bedrooms: ${property.bedrooms || property.totalRooms || 0}\n`;
  markdown += `bathrooms: ${property.bathrooms || 1}\n`;
  markdown += `squareMeters: ${property.sqft || 0}\n`;
  
  // Features
  markdown += 'features:\n';
  if (property.features && property.features.length > 0) {
    property.features.forEach(feature => {
      markdown += `  - ${feature}\n`;
    });
  } else {
    // Add some default features based on property type
    if (property.category.toLowerCase().includes('villa') || property.category.toLowerCase().includes('casa')) {
      markdown += '  - Giardino privato\n';
      markdown += '  - Parcheggio\n';
      markdown += '  - Riscaldamento autonomo\n';
    } else {
      markdown += '  - Balcone\n';
      markdown += '  - Ascensore\n';
      markdown += '  - Riscaldamento centralizzato\n';
    }
  }
  
  // Coordinates
  markdown += 'coordinates:\n';
  if (property.coordinates && property.coordinates.lat && property.coordinates.lng) {
    markdown += `  lat: ${property.coordinates.lat}\n`;
    markdown += `  lng: ${property.coordinates.lng}\n`;
  } else {
    // Default to Turin coordinates
    markdown += '  lat: 45.0703\n';
    markdown += '  lng: 7.6869\n';
  }
  
  markdown += '---\n\n';
  
  // Add the full description as markdown content
  markdown += `# ${property.title}\n\n`;
  
  // Format the description with markdown
  const descriptionParagraphs = property.description.split('\n\n');
  descriptionParagraphs.forEach(paragraph => {
    if (paragraph.trim()) {
      markdown += `${paragraph.trim()}\n\n`;
    }
  });
  
  // Write the markdown file
  const filePath = path.join(propertiesDir, `${slug}.md`);
  fs.writeFileSync(filePath, markdown);
  console.log(`Created markdown file for property "${property.title}" at ${filePath}`);
  
  return slug;
}

// Migrate each property
const migratedProperties = staticProperties.map(property => {
  try {
    return createPropertyMarkdown(property);
  } catch (error) {
    console.error(`Error migrating property ${property.id} (${property.title}):`, error);
    return null;
  }
});

// Filter out any failed migrations
const successfulMigrations = migratedProperties.filter(Boolean);

console.log(`\nMigration complete!`);
console.log(`Successfully migrated ${successfulMigrations.length} out of ${staticProperties.length} properties`);

// Generate the index.json file
console.log('\nGenerating index.json file...');
const generateIndexScript = path.join(__dirname, 'generate-index.js');
if (fs.existsSync(generateIndexScript)) {
  const { execSync } = await import('child_process');
  try {
    execSync(`node ${generateIndexScript}`, { stdio: 'inherit' });
    console.log('Successfully generated index.json file');
  } catch (error) {
    console.error('Error generating index.json file:', error);
  }
} else {
  console.error(`Generate index script not found at ${generateIndexScript}`);
}
