/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/core.js');
const { z } = await import('/runtime/v1/zod.js');

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  name: 'FORM_WITH_ALL_SCALAR_FIELD_VARIANTS',
  tags: ['Comprehensive'],
  version: 1.0,
  content: [
    {
      title: 'Boolean',
      fields: {
        booleanCheckbox: {
          kind: 'boolean',
          label: 'Boolean (Checkbox)',
          variant: 'checkbox'
        },
        booleanRadio: {
          kind: 'boolean',
          label: 'Boolean (Radio)',
          variant: 'radio'
        }
      }
    },
    {
      title: 'Date',
      fields: {
        date: {
          kind: 'date',
          label: 'Date'
        }
      }
    },
    {
      title: 'Number',
      fields: {
        numberInput: {
          kind: 'number',
          label: 'Number (Input)',
          variant: 'input'
        },
        numberRadio: {
          kind: 'number',
          label: 'Number (Radio)',
          options: {
            1: 'Low',
            2: 'Medium',
            3: 'High'
          },
          variant: 'radio'
        },
        numberSlider: {
          kind: 'number',
          label: 'Number (Slider)',
          variant: 'slider',
          min: 0,
          max: 10
        }
      }
    },
    {
      title: 'String',
      fields: {
        stringInput: {
          kind: 'string',
          label: 'String (Input)',
          variant: 'input'
        },
        stringPassword: {
          kind: 'string',
          label: 'String (Password)',
          variant: 'password'
        },
        stringRadio: {
          kind: 'string',
          label: 'String (Radio)',
          variant: 'radio',
          options: {
            a: 'A',
            b: 'B',
            c: 'C'
          }
        },
        stringSelect: {
          kind: 'string',
          label: 'String (Select)',
          variant: 'select',
          options: {
            a: 'A',
            b: 'B',
            c: 'C'
          }
        },
        stringTextArea: {
          kind: 'string',
          label: 'String (Text Area)',
          variant: 'textarea'
        }
      }
    },
    {
      title: 'Set',
      fields: {
        setListbox: {
          kind: 'set',
          label: 'Set (Listbox)',
          variant: 'listbox',
          options: {
            a: 'A',
            b: 'B',
            c: 'C'
          }
        },
        setSelect: {
          kind: 'set',
          label: 'Set (Select)',
          variant: 'select',
          options: {
            a: 'A',
            b: 'B',
            c: 'C'
          }
        }
      }
    }
  ],
  details: {
    description: 'This example includes all possible scalar field variants',
    title: 'Reference Instrument',
    estimatedDuration: 5,
    instructions: ['Please complete all questions'],
    license: 'AGPL-3.0'
  },
  validationSchema: z.object({
    booleanCheckbox: z.boolean(),
    booleanRadio: z.boolean(),
    date: z.date(),
    numberInput: z.number(),
    numberRadio: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    numberSlider: z.number(),
    stringInput: z.string(),
    stringPassword: z.string(),
    stringRadio: z.enum(['a', 'b', 'c']),
    stringSelect: z.enum(['a', 'b', 'c']),
    stringTextArea: z.string(),
    setListbox: z.set(z.enum(['a', 'b', 'c'])),
    setSelect: z.set(z.enum(['a', 'b', 'c']))
  })
});
