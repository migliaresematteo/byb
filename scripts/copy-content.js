/**
 * Script to copy content files to the build output and generate an index.json file
 * This ensures that CMS content is available in the production build
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const contentDir = path.resolve(__dirname, '../content');
const distContentDir = path.resolve(__dirname, '../dist/content');

// Function to create directory if it doesn't exist
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

// Function to copy a file
function copyFile(source, destination) {
  fs.copyFileSync(source, destination);
  console.log(`Copied: ${source} -> ${destination}`);
}

// Function to copy a directory recursively
function copyDirectory(source, destination) {
  // Create the destination directory if it doesn't exist
  ensureDirectoryExists(destination);
  
  // Get all items in the source directory
  const items = fs.readdirSync(source);
  
  // Process each item
  for (const item of items) {
    const sourcePath = path.join(source, item);
    const destPath = path.join(destination, item);
    
    // Check if it's a directory or file
    const stat = fs.statSync(sourcePath);
    
    if (stat.isDirectory()) {
      // Recursively copy subdirectory
      copyDirectory(sourcePath, destPath);
    } else {
      // Copy file
      copyFile(sourcePath, destPath);
    }
  }
}

// Function to read and parse a markdown file
function parseMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  
  if (!frontMatterMatch) {
    console.warn(`No front matter found in ${filePath}`);
    return null;
  }
  
  const frontMatter = frontMatterMatch[1];
  const properties = {};
  
  // Parse front matter
  frontMatter.split('\n').forEach(line => {
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (match) {
      const [_, key, value] = match;
      
      // Handle nested objects like coordinates
      if (key === 'coordinates') {
        try {
          properties[key] = JSON.parse(value);
        } catch (e) {
          properties[key] = { lat: 0, lng: 0 };
        }
      } 
      // Handle arrays like features and images
      else if (key === 'features' || key === 'images') {
        try {
          properties[key] = JSON.parse(value);
        } catch (e) {
          properties[key] = value.split(',').map(item => item.trim());
          
          // For images, convert to object format if it's just strings
          if (key === 'images') {
            properties[key] = properties[key].map(img => {
              if (typeof img === 'string') {
                return { image: img };
              }
              return img;
            });
          }
        }
      } 
      // Handle numeric values
      else if (['price', 'bedrooms', 'bathrooms', 'squareMeters'].includes(key)) {
        properties[key] = Number(value);
      }
      // Handle boolean values
      else if (key === 'featured') {
        properties[key] = value.toLowerCase() === 'true';
      }
      // Handle all other string values
      else {
        properties[key] = value;
      }
    }
  });
  
  // Add the slug based on the filename
  const filename = path.basename(filePath, '.md');
  properties.slug = filename;
  
  return properties;
}

// Function to generate index.json from markdown files
function generatePropertiesIndex(sourceDir, outputPath) {
  console.log(`Generating properties index from ${sourceDir} to ${outputPath}`);
  
  // Get all markdown files
  const files = fs.readdirSync(sourceDir)
    .filter(file => file.endsWith('.md'));
  
  if (files.length === 0) {
    console.warn('No markdown files found to generate index.json');
    return;
  }
  
  // Parse each markdown file
  const properties = [];
  for (const file of files) {
    const filePath = path.join(sourceDir, file);
    const property = parseMarkdownFile(filePath);
    
    if (property) {
      properties.push(property);
      console.log(`Added property from ${file} to index.json`);
    }
  }
  
  // Write the index.json file
  fs.writeFileSync(outputPath, JSON.stringify(properties, null, 2));
  console.log(`Generated index.json with ${properties.length} properties`);
}

// Main function
function main() {
  console.log('Starting content copy process...');
  
  try {
    // Check if content directory exists
    if (!fs.existsSync(contentDir)) {
      console.error(`Content directory not found: ${contentDir}`);
      process.exit(1);
    }
    
    // Copy the content directory to dist
    copyDirectory(contentDir, distContentDir);
    
    // Generate index.json from markdown files
    const propertiesDir = path.join(contentDir, 'properties');
    const indexPath = path.join(distContentDir, 'properties', 'index.json');
    
    if (fs.existsSync(propertiesDir)) {
      generatePropertiesIndex(propertiesDir, indexPath);
    }
    
    console.log('Content copy process completed successfully!');
  } catch (error) {
    console.error('Error copying content files:', error);
    process.exit(1);
  }
}

// Run the main function
main();
