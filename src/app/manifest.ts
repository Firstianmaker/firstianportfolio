import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Faiz Firstian Nugroho — Software Engineer",
    short_name: "Faiz Portfolio",
    description: "Software engineering portfolio of Faiz Firstian Nugroho.",
    start_url: "/",
    display: "standalone",
    background_color: "#02050E",
    theme_color: "#02050E",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
