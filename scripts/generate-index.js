/**
 * Script to generate index.json from markdown files
 * This ensures that all CMS properties are included in the index.json file
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const propertiesDir = path.resolve(__dirname, '../content/properties');
const indexPath = path.join(propertiesDir, 'index.json');

// Function to read and parse a markdown file
function parseMarkdownFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    
    if (!frontMatterMatch) {
      console.warn(`No front matter found in ${filePath}`);
      return null;
    }
    
    const frontMatter = frontMatterMatch[1];
    const property = {};
    
    // Extract the basic properties
    const titleMatch = frontMatter.match(/title:\s*(.*)/);
    if (titleMatch) property.title = titleMatch[1].trim();
    
    const descriptionMatch = frontMatter.match(/description:\s*(.*)/);
    if (descriptionMatch) property.description = descriptionMatch[1].trim();
    
    const priceMatch = frontMatter.match(/price:\s*(.*)/);
    if (priceMatch) property.price = Number(priceMatch[1].trim());
    
    const locationMatch = frontMatter.match(/location:\s*(.*)/);
    if (locationMatch) property.location = locationMatch[1].trim();
    
    const addressMatch = frontMatter.match(/address:\s*(.*)/);
    if (addressMatch) property.address = addressMatch[1].trim();
    
    const typeMatch = frontMatter.match(/type:\s*(.*)/);
    if (typeMatch) property.type = typeMatch[1].trim();
    
    const statusMatch = frontMatter.match(/status:\s*(.*)/);
    if (statusMatch) property.status = statusMatch[1].trim();
    
    const featuredMatch = frontMatter.match(/featured:\s*(.*)/);
    if (featuredMatch) property.featured = featuredMatch[1].trim().toLowerCase() === 'true';
    
    const featuredImageMatch = frontMatter.match(/featuredImage:\s*(.*)/);
    if (featuredImageMatch) property.featuredImage = featuredImageMatch[1].trim();
    
    const bedroomsMatch = frontMatter.match(/bedrooms:\s*(.*)/);
    if (bedroomsMatch) property.bedrooms = Number(bedroomsMatch[1].trim());
    
    const bathroomsMatch = frontMatter.match(/bathrooms:\s*(.*)/);
    if (bathroomsMatch) property.bathrooms = Number(bathroomsMatch[1].trim());
    
    const squareMetersMatch = frontMatter.match(/squareMeters:\s*(.*)/);
    if (squareMetersMatch) property.squareMeters = Number(squareMetersMatch[1].trim());
    
    // Extract images (multi-line YAML array)
    const imagesSection = frontMatter.match(/images:\n([\s\S]*?)(?:\n\w|$)/);
    if (imagesSection) {
      const imageLines = imagesSection[1].split('\n').filter(line => line.trim().startsWith('-'));
      property.images = imageLines.map(line => {
        const imageMatch = line.match(/image:\s*(.*)/);
        return { image: imageMatch ? imageMatch[1].trim() : '' };
      });
    } else {
      property.images = [];
    }
    
    // Extract features (multi-line YAML array)
    const featuresSection = frontMatter.match(/features:\n([\s\S]*?)(?:\n\w|$)/);
    if (featuresSection) {
      property.features = featuresSection[1]
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-'))
        .map(line => line.substring(1).trim());
    } else {
      property.features = [];
    }
    
    // Extract coordinates (nested YAML object)
    const coordinatesSection = frontMatter.match(/coordinates:\n([\s\S]*?)(?:\n\w|$)/);
    if (coordinatesSection) {
      const latMatch = coordinatesSection[1].match(/lat:\s*([\d.]+)/);
      const lngMatch = coordinatesSection[1].match(/lng:\s*([\d.]+)/);
      
      property.coordinates = {
        lat: latMatch ? parseFloat(latMatch[1]) : 0,
        lng: lngMatch ? parseFloat(lngMatch[1]) : 0
      };
    } else {
      property.coordinates = { lat: 0, lng: 0 };
    }
    
    // Add the slug based on the filename
    const filename = path.basename(filePath, '.md');
    property.slug = filename;
    
    return property;
  } catch (error) {
    console.error(`Error parsing file ${filePath}:`, error);
    return null;
  }
}

// Function to generate index.json from markdown files
function generatePropertiesIndex() {
  console.log(`Generating properties index from ${propertiesDir} to ${indexPath}`);
  
  // Ensure the properties directory exists
  if (!fs.existsSync(propertiesDir)) {
    console.log(`Creating properties directory: ${propertiesDir}`);
    fs.mkdirSync(propertiesDir, { recursive: true });
  }
  
  // Get all markdown files
  const files = fs.readdirSync(propertiesDir)
    .filter(file => file.endsWith('.md'));
  
  if (files.length === 0) {
    console.warn('No markdown files found to generate index.json');
    
    // If no markdown files exist, create an empty index.json
    fs.writeFileSync(indexPath, JSON.stringify([], null, 2));
    console.log('Created empty index.json file');
    return;
  }
  
  // Parse each markdown file
  const properties = [];
  for (const file of files) {
    const filePath = path.join(propertiesDir, file);
    const property = parseMarkdownFile(filePath);
    
    if (property) {
      properties.push(property);
      console.log(`Added property from ${file} to index.json`);
    }
  }
  
  // Write the index.json file
  fs.writeFileSync(indexPath, JSON.stringify(properties, null, 2));
  console.log(`Generated index.json with ${properties.length} properties`);
}

// Run the main function
generatePropertiesIndex();
