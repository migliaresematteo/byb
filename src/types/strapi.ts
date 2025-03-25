export interface StrapiRawProperty {
  id: number;
  Bagni: number | null;
  Box_PostiAuto_Garage: string;
  Climatizzazione: string;
  Coordinate_LATITUDINE: number;
  Coordinate_LONGITUDINE: number;
  Data_Aggiornamento: string;
  Descrizione: string;
  Immagine_Copertina: {
    data: {
      attributes: {
        url: string;
      };
    } | null;
  } | null;
  Immagini_Carosello: {
    data: Array<{
      attributes: {
        url: string;
      };
    }> | null;
  };
  In_Evidenza: boolean;
  Indirizzo: string;
  Nome_Immobile: string;
  Numero_Locali: number | null;
  Piani: number;
  Prezzo: number | null;
  Riscaldamento: string;
  Superficie: number;
  Tipologia: string;
  createdAt: string;
  documentId?: string;
  publishedAt: string;
  updatedAt: string;
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

export interface StrapiPropertyResponse {
  data: {
    id: number;
    attributes: StrapiRawProperty;
  };
}