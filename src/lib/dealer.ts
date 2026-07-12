import type { Dealer } from "./types";
import { isSanityConfigured, sanityClient } from "./sanity";
import dealerData from "../data/dealer.json";

const DEALER_QUERY = `*[_type == "dealer"][0] {
  nome,
  tagline,
  telefono,
  telefonoDisplay,
  telefonoSecondario,
  telefonoSecondarioDisplay,
  email,
  whatsapp,
  indirizzo,
  orari,
  mappaEmbed
}`;

async function fetchDealerFromSanity(): Promise<Dealer> {
  const doc = await sanityClient.fetch<Dealer | null>(DEALER_QUERY);
  if (!doc) {
    throw new Error("Documento concessionaria non trovato in Sanity. Crea 'Dati concessionaria' nello Studio.");
  }
  return {
    ...doc,
    email: doc.email || "",
    telefonoSecondario: doc.telefonoSecondario || "",
    telefonoSecondarioDisplay: doc.telefonoSecondarioDisplay || "",
    orari: doc.orari || [],
  };
}

export async function getDealer(): Promise<Dealer> {
  if (isSanityConfigured()) {
    return fetchDealerFromSanity();
  }
  return dealerData;
}
