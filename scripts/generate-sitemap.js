// @ts-check
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load properties data
const propertiesPath = path.join(__dirname, '../src/data/properties.js');
let properties = [];

try {
  // Read the file content
  const fileContent = fs.readFileSync(propertiesPath, 'utf8');
  
  // Extract the properties array using regex
  const match = fileContent.match(/export\s+const\s+properties\s*=\s*(\[[\s\S]*?\]);/);
  if (match && match[1]) {
    // Convert the string to a JavaScript object
    // Note: This is a simplified approach and may not work for all JS syntax
    // For a production environment, consider using a proper JS parser
    const sanitizedContent = match[1]
      .replace(/\/\/.*/g, '') // Remove comments
      .replace(/(\w+):/g, '"$1":') // Convert property names to strings
      .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
    
    properties = JSON.parse(sanitizedContent);
  }
} catch (error) {
  console.error('Error loading properties:', error);
  // Fallback to empty array
  properties = [];
}

const BASE_URL = 'https://brickbybrickimmobiliare.it';
const SITEMAP_PATH = path.join(__dirname, '../public/sitemap.xml');

/**
 * Generates a dynamic sitemap.xml file including all property pages
 */
function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/properties</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${BASE_URL}/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;

  // Add property detail pages
  if (properties && properties.length > 0) {
    properties.forEach(property => {
      const lastUpdate = property.lastUpdate 
        ? new Date(property.lastUpdate).toISOString().split('T')[0] 
        : today;
      
      sitemap += `
  <url>
    <loc>${BASE_URL}/property/${property.id}</loc>
    <lastmod>${lastUpdate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });
  }

  sitemap += `
</urlset>`;

  // Ensure directory exists
  const dir = path.dirname(SITEMAP_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write sitemap file
  fs.writeFileSync(SITEMAP_PATH, sitemap);
  console.log('Sitemap generated successfully at', SITEMAP_PATH);
}

// Run the generator
generateSitemap();
