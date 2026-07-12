# B.Car — Sito vetrina (Venafro)

Sito web per **B.Car** con **Astro** + **Sanity CMS** (pannello per il concessionario).

**Stack:** Astro · Sanity Studio · Cloudflare Pages

---

## Per il concessionario (cliente)

**Il cliente gestisce tutto da solo** — auto, prezzi, foto, telefono, orari. Tu non tocchi più i contenuti.

Il cliente usa **Sanity Studio** (`https://NOME.sanity.studio`):

📄 Guida da consegnare al cliente: **[GUIDA-CLIENTE.md](./GUIDA-CLIENTE.md)**

### Consegna al cliente (checklist)

- [ ] Link pannello: `https://bcar.sanity.studio`
- [ ] Email + password account Sanity (ruolo Editor)
- [ ] File `GUIDA-CLIENTE.md` (via WhatsApp PDF o stampa)
- [ ] Spiegazione: *"Modifichi qui → Publish → sito aggiornato in 1-2 minuti"*

Dopo la consegna, **non devi più aggiornare auto o dati** — ci pensa lui.

---

## Setup iniziale (una volta sola — per te)

### 1. Installa Node.js

Scarica da [nodejs.org](https://nodejs.org) (versione LTS).

### 2. Installa dipendenze

```bash
cd concessionario-vetrina
npm install
cd studio && npm install && cd ..
```

### 3. Crea progetto Sanity

1. Vai su [sanity.io/manage](https://www.sanity.io/manage)
2. **Create project** → nome es. "B.Car"
3. Copia il **Project ID**

### 4. Configura variabili

```bash
cp .env.example .env
```

Modifica `.env`:

```
PUBLIC_SANITY_PROJECT_ID=il_tuo_project_id
PUBLIC_SANITY_DATASET=production
```

### 5. Importa i dati esistenti

1. Su sanity.io/manage → **API** → **Tokens** → **Add API token**
2. Nome: `Seed`, permessi: **Editor**
3. Copia il token in `.env` come `SANITY_API_WRITE_TOKEN=...`
4. Esegui:

```bash
npm run seed
```

### 6. Pubblica il pannello admin online

```bash
npm run studio:deploy
```

Scegli un hostname (es. `bcar`) → il cliente userà `https://bcar.sanity.studio`

### 7. Invita il cliente

Su sanity.io/manage → **Members** → **Invite** → email del concessionario, ruolo **Editor**

---

## Sviluppo locale

```bash
# Sito
npm run dev
# → http://localhost:4321

# Pannello CMS (in un altro terminale)
npm run studio
# → http://localhost:3333
```

Senza `.env` configurato, il sito usa i file JSON in `src/data/` come fallback.

---

## Deploy sito su Cloudflare Pages

1. Carica su **GitHub**
2. Cloudflare Pages → collega il repo
3. Impostazioni build:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
4. Variabili d'ambiente (Settings → Environment variables):
   - `PUBLIC_SANITY_PROJECT_ID`
   - `PUBLIC_SANITY_DATASET` = `production`

### Aggiornamento automatico quando il cliente modifica

1. Cloudflare Pages → **Settings** → **Builds** → copia **Deploy hook URL**
2. Sanity → **API** → **Webhooks** → **Create**
   - URL: incolla il deploy hook
   - Trigger: **Create**, **Update**, **Delete**
   - Filter: `_type == "car" || _type == "dealer"`

Ogni volta che il cliente clicca **Publish**, il sito si ricostruisce da solo.

---

## Struttura progetto

```
src/
  data/           → backup JSON (fallback locale)
  lib/            → connessione Sanity
  pages/          → pagine sito
studio/           → pannello CMS (Sanity Studio)
scripts/          → import dati iniziali
GUIDA-CLIENTE.md  → istruzioni per il concessionario
```

---

## Modificare contenuti

**In produzione:** solo il cliente, via Sanity Studio. I file `src/data/*.json` sono backup iniziale per il setup — non vanno più modificati a mano.

---

## Costi

| Voce | Costo |
|------|-------|
| Sanity (piano Free) | €0 |
| Cloudflare Pages | €0 |
| Dominio .it | ~€10–15/anno |
| **Totale** | ~€1/mese |

Il piano Free Sanity include 20 utenti e 10.000 documenti — più che sufficiente per B.Car.
# concessionario-vetrina
