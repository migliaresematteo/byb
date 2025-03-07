// This script helps the CMS display properties that have been added
// It runs on the client side to enhance the CMS experience

(function() {
  // Function to load properties from the filesystem and display them in the CMS
  async function loadPropertiesInCMS() {
    try {
      // Fetch properties using our improved propertyService
      const response = await fetch('/api/properties');
      if (!response.ok) {
        console.warn('Failed to load properties for CMS preview');
        return;
      }

      const properties = await response.json();
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
  window.addEventListener('load', function() {
    // Check if we're in the CMS admin interface
    if (window.location.pathname.includes('/admin')) {
      console.log('CMS Admin interface detected, loading properties...');
      
      // Load properties after a short delay to ensure CMS is ready
      setTimeout(loadPropertiesInCMS, 1000);
      
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
      document.head.appendChild(style);
    }
  });
})();
