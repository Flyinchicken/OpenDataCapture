import { z } from 'zod';

import { $BaseModel } from '../core/core.js';

export type GroupType = z.infer<typeof $GroupType>;
export const $GroupType = z.enum(['CLINICAL', 'RESEARCH']);

export type Group = z.infer<typeof $Group>;
export const $Group = $BaseModel.extend({
  name: z.string().min(1),
  subjectIds: z.array(z.string()),
  type: $GroupType,
  userIds: z.array(z.string())
});

export type CreateGroupData = z.infer<typeof $CreateGroupData>;
export const $CreateGroupData = z.object({
  name: z.string().min(1),
  type: $GroupType
});

export type UpdateGroupData = z.infer<typeof $UpdateGroupData>;
export const $UpdateGroupData = $CreateGroupData.omit({ type: true }).partial();
