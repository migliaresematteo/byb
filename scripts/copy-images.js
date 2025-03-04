/**
 * Script to copy property images from assets to public directory
 * This is needed because CMS will reference images from the public directory
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const assetsDir = path.resolve(__dirname, '../src/assets/case');
const publicImagesDir = path.resolve(__dirname, '../public/images/properties');

// Ensure public images directory exists
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
  console.log(`Created public images directory: ${publicImagesDir}`);
}

// Function to copy a file
function copyFile(source, destination) {
  try {
    fs.copyFileSync(source, destination);
    return true;
  } catch (error) {
    console.error(`Error copying file from ${source} to ${destination}:`, error);
    return false;
  }
}

// Function to recursively get all files in a directory
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Get all image files from the assets directory
console.log(`Scanning for images in ${assetsDir}...`);
const imageFiles = getAllFiles(assetsDir).filter(file => {
  const ext = path.extname(file).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
});

console.log(`Found ${imageFiles.length} image files to copy`);

// Copy each image to the public directory with a simplified name
let copiedCount = 0;
const propertyDirs = new Set();

imageFiles.forEach((imagePath, index) => {
  // Extract the property directory name
  const relativePath = path.relative(assetsDir, imagePath);
  const propertyDir = relativePath.split(path.sep)[0];
  propertyDirs.add(propertyDir);
  
  // Create a slug from the property directory
  const propertySlug = propertyDir.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
  
  // Create a destination filename
  const ext = path.extname(imagePath);
  const destFileName = `${propertySlug}-${index + 1}${ext}`;
  const destPath = path.join(publicImagesDir, destFileName);
  
  // Copy the file
  if (copyFile(imagePath, destPath)) {
    copiedCount++;
    console.log(`Copied ${relativePath} to ${destFileName}`);
  }
});

console.log(`\nCopied ${copiedCount} out of ${imageFiles.length} images`);
console.log(`Found ${propertyDirs.size} property directories: ${Array.from(propertyDirs).join(', ')}`);

// Update the index.json file to use the new image paths
const indexJsonPath = path.join(__dirname, '../content/properties/index.json');
if (fs.existsSync(indexJsonPath)) {
  console.log('\nUpdating index.json with new image paths...');
  
  try {
    const indexJson = JSON.parse(fs.readFileSync(indexJsonPath, 'utf8'));
    
    // Update each property
    indexJson.forEach(property => {
      // Extract the property slug
      const slug = property.slug;
      
      // Find matching images
      const propertyImages = Array.from(propertyDirs)
        .filter(dir => {
          const dirSlug = dir.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
          
          return slug.includes(dirSlug) || dirSlug.includes(slug);
        });
      
      if (propertyImages.length > 0) {
        const propertyDir = propertyImages[0];
        const propertySlug = propertyDir.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
          .replace(/\-\-+/g, '-')
          .replace(/^-+/, '')
          .replace(/-+$/, '');
        
        // Update featuredImage
        property.featuredImage = `/images/properties/${propertySlug}-1.jpg`;
        
        // Update images array
        const imageCount = imageFiles.filter(imagePath => {
          const relativePath = path.relative(assetsDir, imagePath);
          return relativePath.startsWith(propertyDir);
        }).length;
        
        property.images = Array(imageCount).fill(0).map((_, i) => ({
          image: `/images/properties/${propertySlug}-${i + 1}.jpg`
        }));
        
        console.log(`Updated images for property "${property.title}" (${propertyDir}): ${imageCount} images`);
      }
    });
    
    // Write the updated index.json
    fs.writeFileSync(indexJsonPath, JSON.stringify(indexJson, null, 2));
    console.log('Successfully updated index.json with new image paths');
    
    // Now update each markdown file
    console.log('\nUpdating markdown files with new image paths...');
    const markdownFiles = fs.readdirSync(path.dirname(indexJsonPath))
      .filter(file => file.endsWith('.md'));
    
    markdownFiles.forEach(mdFile => {
      const mdPath = path.join(path.dirname(indexJsonPath), mdFile);
      const mdContent = fs.readFileSync(mdPath, 'utf8');
      
      // Find the matching property in the index.json
      const slug = path.basename(mdFile, '.md');
      const property = indexJson.find(p => p.slug === slug);
      
      if (property) {
        // Update the markdown content
        let updatedContent = mdContent;
        
        // Update featuredImage
        updatedContent = updatedContent.replace(
          /featuredImage: .*$/m,
          `featuredImage: ${property.featuredImage}`
        );
        
        // Update images section
        const imagesSection = property.images.map(img => `  - image: ${img.image}`).join('\n');
        updatedContent = updatedContent.replace(
          /images:[\s\S]*?(?=\w+:)/m,
          `images:\n${imagesSection}\n`
        );
        
        // Write the updated markdown file
        fs.writeFileSync(mdPath, updatedContent);
        console.log(`Updated markdown file for property "${property.title}"`);
      }
    });
    
    console.log('Successfully updated markdown files with new image paths');
    
  } catch (error) {
    console.error('Error updating index.json:', error);
  }
} else {
  console.warn(`Index.json file not found at ${indexJsonPath}`);
}
