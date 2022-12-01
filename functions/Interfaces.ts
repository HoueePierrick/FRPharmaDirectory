export interface pageList {
  sid?: string | null | undefined;
  category: string | null | undefined;
  name: string | null | undefined;
  pagenum: number;
  postalCode: string;
}

type GPSCoords = [number, number];

export interface postData {
  datasetid: string;
  recordid: string;
  fields: {
    nom_de_la_commune: string;
    libelle_d_acheminement: string;
    code_postal: string;
    coordonnees_gps: GPSCoords;
    code_commune_insee: string;
  };
  geometry: { type: string; coordinates: GPSCoords };
  record_timestamp: string;
}

export interface pharmacists {
  fullName: string;
  role: string;
  inscriptionDate: string;
  section: string;
}

export interface result {
  sid: string | null | undefined;
  name: string | null | undefined;
  legalName: string;
  tradeName: string;
  codeCity: string;
  city: string;
  category: string | null | undefined;
  address: string;
  phone: string;
  fax: string;
  pharmacists: pharmacists[];
}
