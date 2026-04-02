import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
    output: "server",
    adapter: cloudflare({
        output: "server",
        imageService: "passthrough",
    }),
    vite: {
        plugins: [tailwindcss()],
    },
    integrations: [icon()],
});