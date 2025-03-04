import fs from 'fs';
import { properties } from '../data/properties';

const BASE_URL = 'https://brickbybrickimmobiliare.it';
const SITEMAP_PATH = './dist/sitemap.xml';

/**
 * Generates a dynamic sitemap.xml file including all property pages
 */
export function generateSitemap() {
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
  properties.forEach(property => {
    const lastUpdate = property.lastUpdate ? new Date(property.lastUpdate).toISOString().split('T')[0] : today;
    
    sitemap += `
  <url>
    <loc>${BASE_URL}/property/${property.id}</loc>
    <lastmod>${lastUpdate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  // Ensure directory exists
  const dir = SITEMAP_PATH.substring(0, SITEMAP_PATH.lastIndexOf('/'));
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write sitemap file
  fs.writeFileSync(SITEMAP_PATH, sitemap);
  console.log('Sitemap generated successfully at', SITEMAP_PATH);
}
