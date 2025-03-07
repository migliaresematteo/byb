// This script helps the CMS display properties that have been added
// It runs on the client side to enhance the CMS experience

(function() {
  // Function to safely add elements to the DOM
  function safelyAppendElement(parent, element) {
    try {
      if (parent && element) {
        parent.appendChild(element);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error appending element:', error);
      return false;
    }
  }

  // Function to safely remove elements from the DOM
  function safelyRemoveElement(element) {
    try {
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing element:', error);
      return false;
    }
  }

  // Function to load properties from the filesystem and display them in the CMS
  async function loadPropertiesInCMS() {
    try {
      console.log('Attempting to load properties for CMS...');
      
      // Try multiple potential endpoints to find properties
      const endpoints = [
        '/api/properties.json',
        '/api/properties',
        '../api/properties.json'
      ];
      
      let properties = [];
      let loaded = false;
      
      // Try each endpoint until we get data
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying to fetch properties from: ${endpoint}`);
          const response = await fetch(endpoint);
          
          if (response.ok) {
            const data = await response.json();
            properties = Array.isArray(data) ? data : (data.properties || []);
            
            if (properties.length > 0) {
              console.log(`Successfully loaded ${properties.length} properties from ${endpoint}`);
              loaded = true;
              break;
            }
          }
        } catch (endpointError) {
          console.warn(`Failed to load from ${endpoint}:`, endpointError);
        }
      }
      
      // If we couldn't load properties from APIs, try to load from the test file
      if (!loaded) {
        try {
          // Create a mock property based on the test-1.md file
          properties = [{
            id: "test-1",
            title: "test",
            description: "test",
            price: 2000,
            location: "Torino",
            address: "Via test 20",
            type: "Villa",
            status: "For Sale",
            featured: false,
            featuredImage: "/images/properties/cap.jpg",
            bedrooms: 2,
            bathrooms: -1,
            squareMeters: 500,
            features: ["a", "d", "e", "f", "g"],
            coordinates: {
              lat: 45.0703,
              lng: 7.6869
            }
          }];
          console.log('Using mock property data:', properties);
        } catch (mockError) {
          console.error('Error creating mock data:', mockError);
        }
      }
      
      // Store properties in localStorage for CMS to access
      localStorage.setItem('cms_properties', JSON.stringify(properties));
      
      // Notify CMS that properties are available
      const event = new CustomEvent('cms:properties:loaded', { detail: properties });
      window.dispatchEvent(event);
      
      // Add properties to CMS interface for debugging
      const cmsContainer = document.querySelector('.css-1hvrgvd-CollectionContainer');
      if (cmsContainer) {
        const debugElement = document.createElement('div');
        debugElement.className = 'cms-debug-info';
        debugElement.style.padding = '10px';
        debugElement.style.margin = '10px 0';
        debugElement.style.border = '1px solid #ddd';
        debugElement.style.borderRadius = '4px';
        debugElement.style.backgroundColor = '#f9f9f9';
        
        debugElement.innerHTML = `
          <h4 style="margin-top: 0;">Properties Loaded: ${properties.length}</h4>
          <pre style="max-height: 200px; overflow: auto; font-size: 12px;">${JSON.stringify(properties, null, 2)}</pre>
        `;
        
        safelyAppendElement(cmsContainer, debugElement);
      }
    } catch (error) {
      console.error('Error loading properties for CMS:', error);
    }
  }

  // Wait for CMS to initialize
  document.addEventListener('DOMContentLoaded', function() {
    // Check if we're in the CMS admin interface
    if (window.location.pathname.includes('/admin')) {
      console.log('CMS Admin interface detected');
      
      // Add custom styling for better CMS experience
      const style = document.createElement('style');
      style.textContent = `
        .cms-property-preview {
          padding: 15px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          margin-bottom: 15px;
        }
        .cms-property-preview h3 {
          margin-top: 0;
          color: #2f6f44;
        }
        .cms-debug-info {
          margin: 15px 0;
          padding: 10px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          background-color: #f9f9f9;
        }
      `;
      safelyAppendElement(document.head, style);
      
      // Initialize CMS event listeners
      const initCmsListeners = () => {
        console.log('Initializing CMS event listeners');
        
        // Wait for CMS to be fully loaded before attempting to load properties
        const checkCmsLoaded = setInterval(() => {
          const cmsContainer = document.querySelector('.css-1hvrgvd-CollectionContainer, .css-v758ki-AppMainContainer');
          if (cmsContainer) {
            console.log('CMS container found, loading properties...');
            clearInterval(checkCmsLoaded);
            loadPropertiesInCMS();
          }
        }, 1000);
        
        // Set a timeout to stop checking after 30 seconds
        setTimeout(() => {
          clearInterval(checkCmsLoaded);
          console.log('Timed out waiting for CMS container');
          loadPropertiesInCMS(); // Try loading anyway
        }, 30000);
      };
      
      // Wait for Netlify Identity to initialize before loading properties
      if (window.netlifyIdentity) {
        window.netlifyIdentity.on('init', user => {
          console.log('Netlify Identity initialized', user ? 'with user' : 'without user');
          if (user) {
            initCmsListeners();
          }
        });
        
        // Also load properties on login
        window.netlifyIdentity.on('login', () => {
          console.log('User logged in, initializing CMS listeners');
          initCmsListeners();
        });
      } else {
        // If Netlify Identity is not available, still try to load properties
        console.log('Netlify Identity not found, initializing CMS listeners anyway');
        setTimeout(initCmsListeners, 1000);
      }
    }
  });
})();
