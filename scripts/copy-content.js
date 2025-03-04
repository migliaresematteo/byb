/**
 * Script to copy content files to the build output
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
    
    console.log('Content copy process completed successfully!');
  } catch (error) {
    console.error('Error copying content files:', error);
    process.exit(1);
  }
}

// Run the main function
main();
