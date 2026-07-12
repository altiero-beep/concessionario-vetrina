import type { Car } from "./types";

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatKm(value: number): string {
  return new Intl.NumberFormat("it-IT").format(value) + " km";
}

export function getCarTitle(car: Car): string {
  return `${car.marca} ${car.modello} ${car.versione}`;
}

export function getCarUrl(car: Car): string {
  return `/auto/${car.id}/`;
}
