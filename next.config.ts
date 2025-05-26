import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: [
    "pdf-parse",
    "pdf2json",
    "pdfjs-dist/legacy/build/pdf.mjs",
  ],
};

export default nextConfig;
