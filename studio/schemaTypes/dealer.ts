import { defineField, defineType } from "sanity";

export const dealer = defineType({
  name: "dealer",
  title: "Concessionaria",
  type: "document",
  fields: [
    defineField({ name: "nome", title: "Nome", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "tagline", title: "Sottotitolo", type: "string" }),
    defineField({
      name: "telefono",
      title: "Cellulare (formato tel:)",
      type: "string",
      description: "Es. +393485853369",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "telefonoDisplay",
      title: "Cellulare (come appare sul sito)",
      type: "string",
      description: "Es. 348 5853369",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "telefonoSecondario", title: "Telefono fisso (formato tel:)", type: "string" }),
    defineField({ name: "telefonoSecondarioDisplay", title: "Telefono fisso (visualizzato)", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp (solo numeri)",
      type: "string",
      description: "Es. 393485853369",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "indirizzo", title: "Indirizzo", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "orari",
      title: "Orari",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "mappaEmbed",
      title: "URL mappa Google (embed)",
      type: "url",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "nome", subtitle: "tagline" },
  },
});
