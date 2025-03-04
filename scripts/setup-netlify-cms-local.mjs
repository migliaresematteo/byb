import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the .netlify/state.json file for local development
const netlifyStateDir = path.join(__dirname, '..', '.netlify');
if (!fs.existsSync(netlifyStateDir)) {
  fs.mkdirSync(netlifyStateDir, { recursive: true });
}

// Create a dummy state.json file for local testing
const stateContent = {
  siteId: "local-development-site",
  dev: {
    jwtRolePath: path.join(__dirname, '..', '.netlify', 'netlify-cms-oauth-provider-role.json'),
    jwtSecret: "local-development-secret-" + Date.now().toString()
  }
};

fs.writeFileSync(
  path.join(netlifyStateDir, 'state.json'),
  JSON.stringify(stateContent, null, 2)
);

console.log('Created Netlify state file for local development');

// Create a package.json script for running the CMS locally
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add scripts for netlify-cms local development
packageJson.scripts = packageJson.scripts || {};
if (!packageJson.scripts['cms:proxy']) {
  packageJson.scripts['cms:proxy'] = 'netlify-cms-proxy-server';
}
if (!packageJson.scripts['cms:dev']) {
  packageJson.scripts['cms:dev'] = 'vite && netlify-cms-proxy-server';
}

// Add the netlify-cms-proxy-server dependency if not present
packageJson.devDependencies = packageJson.devDependencies || {};
if (!packageJson.devDependencies['netlify-cms-proxy-server']) {
  packageJson.devDependencies['netlify-cms-proxy-server'] = '^1.3.24';
}

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('Updated package.json with CMS proxy scripts');

// Create a README for CMS testing
const readmePath = path.join(__dirname, '..', 'CMS-TESTING.md');
const readmeContent = `# Testing Netlify CMS Locally

This document provides instructions on how to test the Netlify CMS integration locally before deploying to production.

## Prerequisites

- Node.js and npm installed
- Netlify CLI installed globally: \`npm install -g netlify-cli\`

## Setup Steps

1. **Install Dependencies**

   First, make sure all dependencies are installed:

   \`\`\`
   npm install --legacy-peer-deps
   npm install -D netlify-cms-proxy-server@1.3.24
   \`\`\`

2. **Run Data Migration Script**

   This script will convert the static property data to CMS-compatible JSON files:

   \`\`\`
   node scripts/migrate-properties.mjs
   \`\`\`

3. **Start the Local CMS Server**

   Run the local development server with CMS proxy:

   \`\`\`
   npm run cms:proxy  # In one terminal - this starts the CMS backend proxy
   npm run dev        # In another terminal - this starts your Vite app
   \`\`\`

4. **Access the CMS**

   Open your browser and navigate to:
   
   \`\`\`
   http://localhost:5173/admin/
   \`\`\`
   
   You should now be able to edit properties in your local CMS.

## Testing the Integration

1. **Create a New Property**

   In the Netlify CMS interface, create a new property and publish it.

2. **Edit an Existing Property**

   Find an existing property in the CMS and make changes to it.

3. **Check Your Website**

   Navigate to your properties page to ensure the changes are reflected correctly.

## Preparing for Production

When you're ready to deploy to production:

1. **Connect to Netlify**

   \`\`\`
   netlify login
   netlify init
   \`\`\`

2. **Enable Identity and Git Gateway**

   In your Netlify dashboard:
   - Go to Site settings > Identity > Enable Identity
   - Go to Site settings > Identity > Services > Enable Git Gateway

3. **Deploy Your Site**

   \`\`\`
   npm run build
   netlify deploy --prod
   \`\`\`

4. **Invite Admin Users**

   In your Netlify dashboard:
   - Go to Identity > Invite users
   - Send invitations to your admin users

## Troubleshooting

- If you're facing issues with local development, make sure the \`.netlify/state.json\` file is present.
- If images aren't showing up, check the media paths in your CMS configuration.
- For authentication issues, verify your Git Gateway configuration in Netlify.
`;

fs.writeFileSync(readmePath, readmeContent);
console.log('Created CMS testing guide: CMS-TESTING.md');

console.log('\nSetup complete! Next steps:');
console.log('1. Run: npm install --legacy-peer-deps');
console.log('2. Run: npm install -D netlify-cms-proxy-server@1.3.24');
console.log('3. Run: node scripts/migrate-properties.mjs');
console.log('4. Start the CMS proxy: npm run cms:proxy');
console.log('5. In another terminal, start your app: npm run dev');
console.log('6. Access the CMS at: http://localhost:5173/admin/');
