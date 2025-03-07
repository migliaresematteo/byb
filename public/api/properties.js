// Simple API endpoint to fetch properties from the local filesystem
// This file serves as a client-side API endpoint for the CMS

(function() {
  // Function to load properties from the JSON file
  async function loadProperties() {
    try {
      const response = await fetch('/api/properties.json');
      if (!response.ok) {
        throw new Error('Failed to load properties');
      }
      
      const data = await response.json();
      return data.properties || [];
    } catch (error) {
      console.error('Error loading properties:', error);
      return [];
    }
  }

  // Expose properties globally for CMS access
  window.BrickByBrick = window.BrickByBrick || {};
  
  // Initialize properties
  loadProperties().then(properties => {
    window.BrickByBrick.properties = properties;
    console.log('Properties loaded for API access:', properties);
    
    // Dispatch event to notify that properties are loaded
    const event = new CustomEvent('brickbybrick:properties:loaded', { detail: properties });
    window.dispatchEvent(event);
  });
})();
