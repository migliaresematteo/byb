export interface Property {
  id: string;
  title: string;
  price: number | string | null;  // Updated to support both number and string
  city: string;
  address: string;
  category: string;
  totalRooms: number | string | null;  // Updated to support both number and string
  bedrooms: number | null;
  bathrooms: number | null;
  sqft: number;
  garage: number;
  outdoorParking: number;
  images: string[];
  imageUrl: string;
  description: string;
  context: string;
  features?: string[];
  condition: string;
  floorLevel?: string | null;
  coordinates: {
    lat: number;
    lng: number;
  };
  constructionDates?: {
    start: string;
    end: string;
  };
  lastUpdate: string;
  referenceCode?: string;
  projectType: string;
  contractType: string;
  totalUnits: number | null;
  floors: number;
  floor?: string | null;
  parking: string;
  heating: string;
  airConditioning: string;
}