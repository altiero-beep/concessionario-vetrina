import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://bcarvenafro.com",
  output: "static",
  build: {
    format: "directory",
  },
  integrations: [sitemap()],
});
