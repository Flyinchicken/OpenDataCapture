/* eslint-disable perfectionist/sort-objects */

import { createInstrumentStub } from './utils.js';

/**
 * @typedef {import('@opendatacapture/schemas/core').Language} Language
 * @typedef {{ favoriteNumber: number, reasonFavoriteNumberIsNegative?: string; }} FormInstrumentStubData
 */

/** @type {import('./utils.js').InstrumentStub<import('./utils.js').FormInstrument<FormInstrumentStubData, Language>>} */
export const unilingualFormInstrument = await createInstrumentStub(async () => {
  const { z } = await import('zod');
  return {
    content: {
      favoriteNumber: {
        kind: 'number',
        label: 'Favorite Number',
        variant: 'input'
      },
      reasonFavoriteNumberIsNegative: {
        deps: ['favoriteNumber'],
        kind: 'dynamic',
        render(data) {
          if (!data?.favoriteNumber || data.favoriteNumber >= 0) {
            return null;
          }
          return {
            kind: 'string',
            label: 'Why is Your Favorite Number Negative?',
            variant: 'textarea'
          };
        }
      }
    },
    details: {
      description: 'This is a unilingual form instrument',
      estimatedDuration: 1,
      instructions: ['Please complete all questions'],
      license: 'AGPL-3.0',
      title: 'Unilingual Form'
    },
    kind: 'FORM',
    language: 'en',
    name: 'unilingual-form',
    tags: ['Example'],
    validationSchema: z.object({
      favoriteNumber: z.number(),
      reasonFavoriteNumberIsNegative: z.string().optional()
    }),
    version: 1.0
  };
});

/** @type {import('./utils.js').InstrumentStub<import('./utils.js').FormInstrument<FormInstrumentStubData, Language[]>>} */
export const bilingualFormInstrument = await createInstrumentStub(async () => {
  const { z } = await import('zod');
  return {
    content: {
      favoriteNumber: {
        kind: 'number',
        label: {
          en: 'Favorite Number',
          fr: 'Numéro préféré'
        },
        variant: 'input'
      },
      reasonFavoriteNumberIsNegative: {
        deps: ['favoriteNumber'],
        kind: 'dynamic',
        render(data) {
          if (!data?.favoriteNumber || data.favoriteNumber >= 0) {
            return null;
          }
          return {
            kind: 'string',
            label: {
              en: 'Why is Your Favorite Number Negative?',
              fr: 'Pourquoi votre nombre préféré est-il négatif ?'
            },
            variant: 'textarea'
          };
        }
      }
    },
    details: {
      description: {
        en: 'This is a bilingual form instrument',
        fr: "Il s'agit d'un instrument bilingue"
      },
      estimatedDuration: 1,
      instructions: {
        en: ['Please complete all questions'],
        fr: ['Veuillez répondre à toutes les questions']
      },
      license: 'AGPL-3.0',
      title: {
        en: 'Bilingual Form',
        fr: 'Formulaire bilingue'
      }
    },
    kind: 'FORM',
    language: ['en', 'fr'],
    name: 'bilingual-form',
    tags: {
      en: ['Example'],
      fr: ['Exemple']
    },
    validationSchema: z.object({
      favoriteNumber: z.number(),
      reasonFavoriteNumberIsNegative: z.string().optional()
    }),
    version: 1.0
  };
});
