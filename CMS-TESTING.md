# Testing Netlify CMS Locally

This document provides instructions on how to test the Netlify CMS integration locally before deploying to production.

## Prerequisites

- Node.js and npm installed
- Netlify CLI installed globally: `npm install -g netlify-cli`

## Setup Steps

1. **Install Dependencies**

   First, make sure all dependencies are installed:

   ```
   npm install --legacy-peer-deps
   npm install -D netlify-cms-proxy-server@1.3.24
   ```

2. **Run Data Migration Script**

   This script will convert the static property data to CMS-compatible JSON files:

   ```
   node scripts/migrate-properties.mjs
   ```

3. **Start the Local CMS Server**

   Run the local development server with CMS proxy:

   ```
   npm run cms:proxy  # In one terminal - this starts the CMS backend proxy
   npm run dev        # In another terminal - this starts your Vite app
   ```

4. **Access the CMS**

   Open your browser and navigate to:
   
   ```
   http://localhost:5173/admin/
   ```
   
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

   ```
   netlify login
   netlify init
   ```

2. **Enable Identity and Git Gateway**

   In your Netlify dashboard:
   - Go to Site settings > Identity > Enable Identity
   - Go to Site settings > Identity > Services > Enable Git Gateway

3. **Deploy Your Site**

   ```
   npm run build
   netlify deploy --prod
   ```

4. **Invite Admin Users**

   In your Netlify dashboard:
   - Go to Identity > Invite users
   - Send invitations to your admin users

## Troubleshooting

- If you're facing issues with local development, make sure the `.netlify/state.json` file is present.
- If images aren't showing up, check the media paths in your CMS configuration.
- For authentication issues, verify your Git Gateway configuration in Netlify.
