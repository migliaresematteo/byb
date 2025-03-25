import axios from 'axios';
import { Property } from '../types';
import { StrapiRawProperty, StrapiResponse, StrapiPropertyResponse } from '../types/strapi';

const api = axios.create({
  baseURL: import.meta.env.VITE_STRAPI_API_URL,
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to ensure headers are set
api.interceptors.request.use(
  config => {
    if (!config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  response => {
    // Check if response is HTML instead of JSON
    const contentType = response.headers['content-type'];
    if (contentType && contentType.includes('text/html')) {
      console.error('Received HTML instead of JSON:', {
        status: response.status,
        headers: response.headers,
        data: response.data.substring(0, 200) // Log first 200 chars of HTML
      });
      throw new Error('Received HTML instead of JSON - likely an authentication or CORS issue');
    }
    return response;
  },
  error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const contentType = error.response.headers['content-type'];
      if (contentType && contentType.includes('text/html')) {
        console.error('Received HTML error response:', {
          status: error.response.status,
          headers: error.response.headers,
          data: error.response.data.substring(0, 200) // Log first 200 chars of HTML
        });
        throw new Error('Received HTML error response - likely an authentication or CORS issue');
      }
      console.error('API Error Response:', {
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data
      });
      throw new Error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response:', error.request);
      throw new Error('No response received from API');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Request Error:', error.message);
      throw new Error(`API Request Error: ${error.message}`);
    }
  }
);

export interface StrapiProperty {
  id: number;
  attributes: {
    Nome_Immobile: string;
    Prezzo: number | null;
    Città: string;
    Indirizzo: string;
    Tipologia: string;
    Numero_Locali: number | null;
    Bagni: number | null;
    Superficie: number;
    Box_PostiAuto_Garage: string;
    Immagini_Carosello: {
      data: Array<{
        attributes: {
          url: string;
        };
      }> | null;
    };
    Immagine_Copertina: {
      data: {
        attributes: {
          url: string;
        };
      } | null;
    } | null;
    Descrizione: string;
    In_Evidenza: boolean;
    Data_Aggiornamento: string;
    Climatizzazione: string;
    Riscaldamento: string;
    Coordinate_LATITUDINE: number;
    Coordinate_LONGITUDINE: number;
    Piani: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    documentId?: string;
  };
}

export interface StrapiResponse<T> {
  data: {
    id: number;
    attributes: T;
  }[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export const strapiService = {
  async getProperties(): Promise<{ data: Property[] }> {
    const response = await api.get<StrapiResponse<StrapiRawProperty>>('/api/immobilis?populate=*');
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response format from Strapi API');
    }
    const mappedProperties = response.data.data.map((item: { id: number; attributes: any }) => {
      if (!item || typeof item !== 'object' || !('id' in item) || !('attributes' in item)) {
        console.error('Invalid property item structure:', item);
        return null;
      }
      const attr = item.attributes;
      if (!attr || typeof attr !== 'object') {
        console.error('Invalid property attributes:', attr);
        return null;
      }

      try {
        // Early validation of the attributes object
        if (!attr || typeof attr !== 'object') {
          console.error('Invalid property attributes structure:', attr);
          return null;
        }

        // Validate and transform required attributes with more detailed error logging
        const title = attr.Nome_Immobile ? String(attr.Nome_Immobile).trim() : '';
        const address = attr.Indirizzo ? String(attr.Indirizzo).trim() : '';
        if (!title || !address) {
          console.error('Missing or invalid required property attributes:', { 
            title: attr.Nome_Immobile,
            address: attr.Indirizzo,
            itemId: item.id
          });
          return null;
        }

        // Handle and validate numeric values with detailed type checking
        const price = attr.Prezzo !== undefined && attr.Prezzo !== null && !isNaN(Number(attr.Prezzo)) 
          ? Number(attr.Prezzo) 
          : null;
        const totalRooms = attr.Numero_Locali !== undefined && attr.Numero_Locali !== null && !isNaN(Number(attr.Numero_Locali)) 
          ? Number(attr.Numero_Locali) 
          : null;
        const bathrooms = attr.Bagni !== undefined && attr.Bagni !== null && !isNaN(Number(attr.Bagni)) 
          ? Number(attr.Bagni) 
          : null;
        const sqft = attr.Superficie !== undefined && attr.Superficie !== null && !isNaN(Number(attr.Superficie)) 
          ? Number(attr.Superficie) 
          : 0;

        // Handle and validate images with detailed error checking
        const images: string[] = [];
        if (attr.Immagini_Carosello?.data) {
          if (!Array.isArray(attr.Immagini_Carosello.data)) {
            console.error('Invalid carousel images data structure:', {
              imagesData: attr.Immagini_Carosello.data,
              itemId: item.id
            });
          } else {
            attr.Immagini_Carosello.data.forEach((img: any, index: number) => {
              if (!img?.attributes?.url) {
                console.error(`Missing URL for carousel image at index ${index}:`, {
                  image: img,
                  itemId: item.id
                });
              } else {
                const imageUrl = `${import.meta.env.VITE_STRAPI_API_URL}${img.attributes.url}`;
                images.push(imageUrl);
              }
            });
          }
        }

        let coverImage = '';
        if (!attr.Immagine_Copertina?.data) {
          console.warn('No cover image data found:', { itemId: item.id });
        } else if (!attr.Immagine_Copertina.data?.attributes?.url) {
          console.error('Invalid cover image structure:', {
            coverImageData: attr.Immagine_Copertina.data,
            itemId: item.id
          });
        } else {
          coverImage = `${import.meta.env.VITE_STRAPI_API_URL}${attr.Immagine_Copertina.data.attributes.url}`;
        }

        // Validate and transform optional attributes with type checking
        const city = attr.Città ? String(attr.Città).trim() : '';
        const propertyType = attr.Tipologia ? String(attr.Tipologia).trim() : '';
        const parking = attr.Box_PostiAuto_Garage ? String(attr.Box_PostiAuto_Garage).trim() : '';
        const description = attr.Descrizione ? String(attr.Descrizione).trim() : '';
        const featured = typeof attr.In_Evidenza === 'boolean' ? attr.In_Evidenza : false;
        const lastUpdate = attr.Data_Aggiornamento ? String(attr.Data_Aggiornamento) : '';
        const airConditioning = attr.Climatizzazione ? String(attr.Climatizzazione).trim() : '';
        const heating = attr.Riscaldamento ? String(attr.Riscaldamento).trim() : '';
        
        // Validate geographical coordinates
        const latitude = attr.Coordinate_LATITUDINE !== undefined && 
          attr.Coordinate_LATITUDINE !== null && 
          !isNaN(Number(attr.Coordinate_LATITUDINE)) ? 
          Number(attr.Coordinate_LATITUDINE) : 0;
        
        const longitude = attr.Coordinate_LONGITUDINE !== undefined && 
          attr.Coordinate_LONGITUDINE !== null && 
          !isNaN(Number(attr.Coordinate_LONGITUDINE)) ? 
          Number(attr.Coordinate_LONGITUDINE) : 0;
        
        const floors = attr.Piani !== undefined && 
          attr.Piani !== null && 
          !isNaN(Number(attr.Piani)) ? 
          Number(attr.Piani) : 0;

        // Create property object with validated and transformed data
        const property: Property = {
          id: item.id.toString(),
          title,
          price,
          city,
          address,
          category: propertyType,
          totalRooms,
          bathrooms,
          sqft,
          garage: 0,
          outdoorParking: 0,
          images,
          imageUrl: coverImage,
          description,
          featured,
          lastUpdate,
          airConditioning,
          heating,
          coordinates: {
            lat: latitude,
            lng: longitude
          },
          floors,
          context: '',
          condition: '',
          projectType: '',
          contractType: '',
          totalUnits: null,
          parking,
          bedrooms: null
        };

        return property;
      } catch (error) {
        console.error('Error mapping property:', error, item);
        return null;
      }
    });
    const filteredProperties = mappedProperties.filter((item): item is Property => item !== null);
    return { data: filteredProperties };
  },

  getPropertyById: async (id: string): Promise<{ data: Property }> => {
    const response = await api.get<StrapiPropertyResponse>(`/api/immobilis/${id}?populate=*`);
    if (!response.data || !response.data.data) {
      throw new Error(`Property with id ${id} not found`);
    }
    const item = response.data.data;
    if (!item || !item.attributes) {
      throw new Error(`Invalid property data structure for id ${id}`);
    }
    
    const attr = item.attributes;
    const property = {
      id: item.id.toString(),
      title: attr.Nome_Immobile || '',
      price: attr.Prezzo != null ? Number(attr.Prezzo) : null,
      city: attr.Città || '',
      address: attr.Indirizzo || '',
      category: attr.Tipologia || '',
      totalRooms: attr.Numero_Locali != null ? Number(attr.Numero_Locali) : null,
      bathrooms: attr.Bagni != null ? Number(attr.Bagni) : null,
      sqft: Number(attr.Superficie || 0),
      garage: 0,
      outdoorParking: 0,
      images: attr.Immagini_Carosello?.data?.map((img: { attributes: { url: string; }; }) => 
        `${import.meta.env.VITE_STRAPI_API_URL}${img.attributes.url}`) || [],
      imageUrl: attr.Immagine_Copertina?.data?.attributes?.url ? 
        `${import.meta.env.VITE_STRAPI_API_URL}${attr.Immagine_Copertina.data.attributes.url}` : '',
      description: String(attr.Descrizione || ''),
      featured: Boolean(attr.In_Evidenza || false),
      lastUpdate: String(attr.Data_Aggiornamento || new Date().toISOString()),
      airConditioning: String(attr.Climatizzazione || ''),
      heating: String(attr.Riscaldamento || ''),
      coordinates: {
        lat: Number(attr.Coordinate_LATITUDINE || 0),
        lng: Number(attr.Coordinate_LONGITUDINE || 0)
      },
      floors: Number(attr.Piani || 0),
      context: '',
      condition: '',
      projectType: '',
      contractType: '',
      totalUnits: null,
      parking: String(attr.Box_PostiAuto_Garage || ''),
      bedrooms: null
    };
    
    return { data: property };
  }
};