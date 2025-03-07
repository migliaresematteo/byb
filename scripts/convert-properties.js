import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
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
  const frontmatter = yaml.dump(property);
  const content = `---\n${frontmatter}---\n\n${property.description}\n`;
  const filename = `${property.slug}.md`;
  fs.writeFileSync(path.join(propertiesDir, filename), content);
});

// Delete the original index.json file
fs.unlinkSync(path.join(__dirname, '../content/properties/index.json'));
