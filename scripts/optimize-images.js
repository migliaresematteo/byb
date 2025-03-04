// optimize-images.js
// This script optimizes images for web performance
// To use: node scripts/optimize-images.js

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

console.log('Image optimization script starting...');
console.log('This script requires sharp to be installed.');
console.log('If not already installed, run: npm install sharp');

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to check if a file is an image
function isImage(file) {
  const ext = path.extname(file).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
}

// Function to optimize images in a directory
async function optimizeImagesInDirectory(directory) {
  try {
    // Create a public/images directory if it doesn't exist
    const publicImagesDir = path.join(directory, 'public', 'images');
    if (!fs.existsSync(publicImagesDir)) {
      fs.mkdirSync(publicImagesDir, { recursive: true });
    }

    // Create an optimized og-image.jpg
    console.log('Creating optimized og-image.jpg...');
    const ogImageCode = `
    import sharp from 'sharp';
    
    // Create a simple gradient image for og-image.jpg
    sharp({
      create: {
        width: 1200,
        height: 630,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
    .composite([
      {
        input: Buffer.from(
          '<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">' +
          '<rect width="1200" height="630" fill="#4ade80" />' +
          '<text x="50%" y="40%" font-family="Arial" font-size="60" font-weight="bold" fill="white" text-anchor="middle">BrickByBrick Immobiliare</text>' +
          '<text x="50%" y="55%" font-family="Arial" font-size="40" fill="white" text-anchor="middle">Trova la Tua Casa Ideale</text>' +
          '</svg>'
        ),
        top: 0,
        left: 0
      }
    ])
    .jpeg({ quality: 90 })
    .toFile('public/og-image.jpg')
    .then(() => console.log('og-image.jpg created successfully'))
    .catch(err => console.error('Error creating og-image.jpg:', err));
    `;

    // Write the code to a temporary file
    fs.writeFileSync('temp-og-image.mjs', ogImageCode);
    
    // Execute the code
    try {
      execSync('node temp-og-image.mjs', { stdio: 'inherit' });
    } catch (error) {
      console.error('Error executing og-image generation:', error);
    }
    
    // Clean up the temporary file
    fs.unlinkSync('temp-og-image.mjs');

    console.log('Image optimization complete!');
    console.log('Remember to install the required dependencies:');
    console.log('npm install sharp');
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

// Get the project root directory (parent of scripts directory)
const projectRoot = path.resolve(path.join(__dirname, '..'));

// Run the optimization
optimizeImagesInDirectory(projectRoot);
