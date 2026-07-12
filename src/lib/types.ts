export interface Car {
  id: string;
  marca: string;
  modello: string;
  versione: string;
  anno: number;
  prezzo: number;
  km: number;
  carburante: string;
  cambio: string;
  potenza: string;
  cilindrata: string;
  colore: string;
  porte: number;
  posti: number;
  trazione: string;
  consumo?: string;
  emissioni?: string;
  classeEmissioni?: string;
  descrizione: string;
  immagini: string[];
  inEvidenza: boolean;
}

export interface Dealer {
  nome: string;
  tagline: string;
  telefono: string;
  telefonoDisplay: string;
  telefonoSecondario: string;
  telefonoSecondarioDisplay: string;
  email: string;
  whatsapp: string;
  indirizzo: string;
  orari: string[];
  mappaEmbed: string;
}
