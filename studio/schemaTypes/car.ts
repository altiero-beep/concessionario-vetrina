import { defineField, defineType } from "sanity";

export const car = defineType({
  name: "car",
  title: "Auto",
  type: "document",
  fields: [
    defineField({
      name: "id",
      title: "ID pagina",
      type: "slug",
      description: "Identificativo univoco per l'URL (es. fiat-500-lounge-2020)",
      options: {
        source: (doc) => `${doc.marca || ""}-${doc.modello || ""}-${doc.anno || ""}`,
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "marca", title: "Marca", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "modello", title: "Modello", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "versione", title: "Versione", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "anno", title: "Anno", type: "number", validation: (rule) => rule.required().min(1990) }),
    defineField({ name: "prezzo", title: "Prezzo (€)", type: "number", validation: (rule) => rule.required().min(0) }),
    defineField({ name: "km", title: "Chilometraggio", type: "number", validation: (rule) => rule.required().min(0) }),
    defineField({
      name: "carburante",
      title: "Carburante",
      type: "string",
      options: {
        list: ["Benzina", "Diesel", "GPL", "Metano", "Elettrica", "Ibrida"],
        layout: "dropdown",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cambio",
      title: "Cambio",
      type: "string",
      options: { list: ["Manuale", "Automatico"], layout: "dropdown" },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "potenza", title: "Potenza", type: "string", description: "Es. 69 CV" }),
    defineField({ name: "cilindrata", title: "Cilindrata", type: "string", description: "Es. 1242 cc" }),
    defineField({ name: "colore", title: "Colore", type: "string" }),
    defineField({ name: "porte", title: "Porte", type: "number" }),
    defineField({ name: "posti", title: "Posti", type: "number" }),
    defineField({ name: "trazione", title: "Trazione", type: "string" }),
    defineField({ name: "consumo", title: "Consumo", type: "string" }),
    defineField({ name: "emissioni", title: "Emissioni CO₂", type: "string" }),
    defineField({ name: "classeEmissioni", title: "Classe emissioni", type: "string" }),
    defineField({ name: "descrizione", title: "Descrizione", type: "text", rows: 5 }),
    defineField({
      name: "immagini",
      title: "Foto",
      type: "array",
      of: [{ type: "image", options: { hotspot: false } }],
      options: { layout: "grid" },
      description:
        "Puoi caricare più foto: trascina 3–5 immagini insieme dal computer, oppure clicca «Add item» / «Aggiungi» per aggiungerne una alla volta. La prima foto è la copertina nel parco auto.",
      validation: (rule) => rule.min(1).error("Carica almeno una foto"),
    }),
    defineField({
      name: "inEvidenza",
      title: "Mostra in evidenza in home",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      marca: "marca",
      modello: "modello",
      versione: "versione",
      anno: "anno",
      media: "immagini.0",
    },
    prepare({ marca, modello, versione, anno, media }) {
      return {
        title: `${marca} ${modello}`,
        subtitle: `${versione} · ${anno}`,
        media,
      };
    },
  },
});
