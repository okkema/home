import { defineConfig, passthroughImageService } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";

export default defineConfig({
  output: "server",
  adapter: cloudflare({
    mode: "directory",
    routes: {
      strategy: "exclude",
    },
  }),
  image: {
    service: passthroughImageService()
  },
  integrations: [react()]
});