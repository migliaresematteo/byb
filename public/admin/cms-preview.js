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
      // Fetch properties using our improved propertyService
      const response = await fetch('/api/properties.json');
      if (!response.ok) {
        console.warn('Failed to load properties for CMS preview');
        return;
      }

      const data = await response.json();
      const properties = data.properties || [];
      console.log('Loaded properties for CMS:', properties);
      
      // Store properties in localStorage for CMS to access
      localStorage.setItem('cms_properties', JSON.stringify(properties));
      
      // Notify CMS that properties are available
      const event = new CustomEvent('cms:properties:loaded', { detail: properties });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error loading properties for CMS:', error);
    }
  }

  // Wait for CMS to initialize
  document.addEventListener('DOMContentLoaded', function() {
    // Check if we're in the CMS admin interface
    if (window.location.pathname.includes('/admin')) {
      console.log('CMS Admin interface detected, loading properties...');
      
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
      `;
      safelyAppendElement(document.head, style);
      
      // Wait for Netlify Identity to initialize before loading properties
      if (window.netlifyIdentity) {
        window.netlifyIdentity.on('init', user => {
          if (user) {
            // Load properties after a short delay to ensure CMS is ready
            setTimeout(loadPropertiesInCMS, 1000);
          }
        });
        
        // Also load properties on login
        window.netlifyIdentity.on('login', () => {
          setTimeout(loadPropertiesInCMS, 1000);
        });
      } else {
        // If Netlify Identity is not available, still try to load properties
        setTimeout(loadPropertiesInCMS, 1000);
      }
    }
  });
})();
