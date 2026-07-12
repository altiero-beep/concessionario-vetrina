import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
  name: "bcar",
  title: "B.Car — Gestione sito",
  projectId: "moq0k8qh",
  dataset: "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Contenuti")
          .items([
            S.listItem()
              .title("Dati concessionaria")
              .id("dealer")
              .child(S.document().schemaType("dealer").documentId("dealer")),
            S.divider(),
            S.documentTypeListItem("car").title("Parco auto"),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
