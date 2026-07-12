import type { Car } from "./types";
import { imageUrlFromSanity, isSanityConfigured, sanityClient } from "./sanity";
import carsData from "../data/cars.json";

interface SanityCar {
  id?: { current?: string };
  marca: string;
  modello: string;
  versione: string;
  anno: number;
  prezzo: number;
  km: number;
  carburante: string;
  cambio: string;
  potenza?: string;
  cilindrata?: string;
  colore?: string;
  porte?: number;
  posti?: number;
  trazione?: string;
  consumo?: string;
  emissioni?: string;
  classeEmissioni?: string;
  descrizione?: string;
  immagini?: unknown[];
  inEvidenza?: boolean;
}

const CARS_QUERY = `*[_type == "car"] | order(anno desc) {
  id,
  marca,
  modello,
  versione,
  anno,
  prezzo,
  km,
  carburante,
  cambio,
  potenza,
  cilindrata,
  colore,
  porte,
  posti,
  trazione,
  consumo,
  emissioni,
  classeEmissioni,
  descrizione,
  immagini,
  inEvidenza
}`;

function mapSanityCar(doc: SanityCar): Car | null {
  const id = doc.id?.current;
  if (!id) return null;

  const immagini = (doc.immagini || []).map(imageUrlFromSanity).filter(Boolean);
  if (!immagini.length) return null;

  return {
    id,
    marca: doc.marca,
    modello: doc.modello,
    versione: doc.versione,
    anno: doc.anno,
    prezzo: doc.prezzo,
    km: doc.km,
    carburante: doc.carburante,
    cambio: doc.cambio,
    potenza: doc.potenza || "",
    cilindrata: doc.cilindrata || "",
    colore: doc.colore || "",
    porte: doc.porte || 0,
    posti: doc.posti || 0,
    trazione: doc.trazione || "",
    consumo: doc.consumo,
    emissioni: doc.emissioni,
    classeEmissioni: doc.classeEmissioni,
    descrizione: doc.descrizione || "",
    immagini,
    inEvidenza: Boolean(doc.inEvidenza),
  };
}

async function fetchCarsFromSanity(): Promise<Car[]> {
  const docs = await sanityClient.fetch<SanityCar[]>(CARS_QUERY);
  return docs.map(mapSanityCar).filter((car): car is Car => car !== null);
}

export async function getCars(): Promise<Car[]> {
  if (isSanityConfigured()) {
    return fetchCarsFromSanity();
  }
  return carsData.cars;
}

export async function getCarById(id: string): Promise<Car | undefined> {
  const cars = await getCars();
  return cars.find((car) => car.id === id);
}

export async function getFeaturedCars(limit = 3): Promise<Car[]> {
  const cars = await getCars();
  return cars.filter((car) => car.inEvidenza).slice(0, limit);
}

export function uniqueValues(cars: Car[], key: keyof Car): string[] {
  return [...new Set(cars.map((car) => String(car[key])))].sort();
}
