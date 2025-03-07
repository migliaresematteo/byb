import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the JSON file
const propertiesJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../content/properties/index.json'), 'utf8'));

// Create the properties directory if it doesn't exist
const propertiesDir = path.join(__dirname, '../content/properties');
if (!fs.existsSync(propertiesDir)) {
  fs.mkdirSync(propertiesDir, { recursive: true });
}

// Convert each property to a markdown file
propertiesJson.forEach(property => {
  // Create frontmatter
  const { description, ...frontmatterData } = property;
  const frontmatter = Object.entries(frontmatterData)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}:\n${value.map(item => `  - ${item}`).join('\n')}`;
      }
      return `${key}: ${value}`;
    })
    .join('\n');

  const content = `---\n${frontmatter}\n---\n\n${description || ''}\n`;
  const filename = `${property.slug || property.id}.md`;
  fs.writeFileSync(path.join(propertiesDir, filename), content);
  console.log(`Created ${filename}`);
});

// Keep the original index.json as backup
console.log('Properties converted successfully!');
