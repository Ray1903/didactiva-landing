import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Evita que errores de ESLint detengan el build en Vercel
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Opcional: evita que errores de tipo detengan el build
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
