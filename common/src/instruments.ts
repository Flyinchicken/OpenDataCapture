import { z } from 'zod';

export const instrumentFieldTypeOptions = ['text'] as const;

export type InstrumentFieldType = (typeof instrumentFieldTypeOptions)[number];

export const instrumentFieldSchema = z.object({
  name: z.string(),
  label: z.string(),
  type: z.enum(instrumentFieldTypeOptions),
  isRequired: z.coerce.boolean()
});

export type InstrumentField = z.infer<typeof instrumentFieldSchema>;

export const instrumentSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  instructions: z.string(),
  estimatedDuration: z.number(),
  version: z.number(),
  fields: z.array(instrumentFieldSchema)
});

export type Instrument = z.infer<typeof instrumentSchema>;

export const instrumentRecordSchema = z.object({
  subject: z.any(), // ref to object id
  responses: z.record(z.string(), z.any())
});

export type InstrumentRecord = z.infer<typeof instrumentRecordSchema>;
