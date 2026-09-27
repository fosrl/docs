import { fileURLToPath } from 'node:url';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // this app lives inside the docs repo but is its own project (own lockfile)
  turbopack: { root: fileURLToPath(new URL('.', import.meta.url)) },
};

export default config;
