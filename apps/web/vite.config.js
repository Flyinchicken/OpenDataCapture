// @ts-check

import path from 'path';
import url from 'url';

import react from '@vitejs/plugin-react-swc';
import autoprefixer from 'autoprefixer';
import copy from 'rollup-plugin-copy';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';

const projectDir = path.dirname(url.fileURLToPath(import.meta.url));

// Until import meta env (external package) is setup
process.env.VITE_DOCS_URL = process.env.DOCS_URL;
process.env.VITE_LICENSE_URL = process.env.LICENSE_URL;
process.env.VITE_GITHUB_REPO_URL = process.env.GITHUB_REPO_URL;

/**
 * Recurse through the combined translations and include only the provided locale
 * @param {Record<string, any>} translations
 * @param {string} locale
 * @returns {string}
 */
export const transformTranslations = (translations, locale) => {
  const result = {};
  for (const key in translations) {
    if (Object.hasOwn(translations[key], locale)) {
      result[key] = translations[key][locale];
    } else {
      result[key] = transformTranslations(translations[key], locale);
    }
  }
  return JSON.stringify(translations, null, 2);
};

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer]
    }
  },
  plugins: [
    react(),
    viteCompression(),
    {
      ...copy({
        targets: [
          {
            src: 'src/translations/*',
            dest: 'dist/locales',
            transform: (contents) => {
              const translations = JSON.parse(contents.toString());
              return transformTranslations(translations, 'en');
            }
          }
        ],
        hook: 'writeBundle'
      })
    }
  ],
  server: {
    port: parseInt(process.env.WEB_DEV_SERVER_PORT ?? '3000'),
    proxy: {
      '/api/': {
        target: {
          host: 'localhost',
          port: parseInt(process.env.API_DEV_SERVER_PORT ?? '5500')
        },
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(projectDir, 'src')
    }
  }
});
