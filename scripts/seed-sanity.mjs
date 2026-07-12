import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadEnv() {
  try {
    const envPath = join(root, ".env");
    const content = readFileSync(envPath, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
    }
  } catch {
    // .env opzionale se variabili già in shell
  }
}

loadEnv();

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("\n❌ Mancano variabili in .env:");
  console.error("   PUBLIC_SANITY_PROJECT_ID");
  console.error("   SANITY_API_WRITE_TOKEN (token Editor da sanity.io/manage)\n");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

async function uploadImageFromUrl(url, retries = 3) {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; BCarSeed/1.0)",
          Accept: "image/*",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      const filename = url.split("/").pop()?.split("?")[0] || "image.jpg";
      const asset = await client.assets.upload("image", buffer, { filename });
      return {
        _type: "image",
        _key: crypto.randomUUID(),
        asset: { _type: "reference", _ref: asset._id },
      };
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 500));
      }
    }
  }

  throw new Error(`Download fallito: ${url} (${lastError?.message || "errore sconosciuto"})`);
}

async function uploadImagesFromUrls(urls) {
  const immagini = [];

  for (const url of urls) {
    if (!url.startsWith("http")) continue;

    try {
      immagini.push(await uploadImageFromUrl(url));
    } catch (error) {
      console.warn(`\n    ⚠ Foto saltata: ${error.message}`);
    }
  }

  return immagini;
}

async function seed() {
  const carsFile = JSON.parse(readFileSync(join(root, "src/data/cars.json"), "utf8"));
  const dealerFile = JSON.parse(readFileSync(join(root, "src/data/dealer.json"), "utf8"));

  console.log("→ Caricamento dati concessionaria...");
  await client.createOrReplace({
    _id: "dealer",
    _type: "dealer",
    ...dealerFile,
  });
  console.log("✓ Concessionaria importata");

  console.log("→ Caricamento parco auto...");
  for (const car of carsFile.cars) {
    process.stdout.write(`  ${car.marca} ${car.modello}... `);

    const immagini = await uploadImagesFromUrls(car.immagini);

    if (!immagini.length) {
      console.log("saltata (nessuna foto caricata)");
      continue;
    }

    await client.createOrReplace({
      _id: `car-${car.id}`,
      _type: "car",
      id: { _type: "slug", current: car.id },
      marca: car.marca,
      modello: car.modello,
      versione: car.versione,
      anno: car.anno,
      prezzo: car.prezzo,
      km: car.km,
      carburante: car.carburante,
      cambio: car.cambio,
      potenza: car.potenza,
      cilindrata: car.cilindrata,
      colore: car.colore,
      porte: car.porte,
      posti: car.posti,
      trazione: car.trazione,
      consumo: car.consumo,
      emissioni: car.emissioni,
      classeEmissioni: car.classeEmissioni,
      descrizione: car.descrizione,
      immagini,
      inEvidenza: car.inEvidenza,
    });

    console.log("ok");
  }

  console.log("\n✅ Import completato! Apri lo Studio: npm run studio\n");
}

seed().catch((err) => {
  console.error("\n❌ Errore:", err.message);
  process.exit(1);
});
