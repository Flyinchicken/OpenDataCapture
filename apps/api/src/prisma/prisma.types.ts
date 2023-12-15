import { Prisma } from '@open-data-capture/database/core';
import type { Replace } from 'type-fest';

import type { AppPrismaClient } from './prisma.module';

export type ModelReferenceName = Uncapitalize<Prisma.ModelName>;

export type ModelName<T extends ModelEntityName> = `${T}Model` & Prisma.ModelName;

export type ModelEntityName = Replace<Prisma.ModelName, 'Model', ''>;

export type Model<T extends ModelEntityName> = AppPrismaClient[`${Uncapitalize<T>}Model`];

export type ModelUpdateData<T extends ModelEntityName> = Parameters<Model<T>['update']>[0]['data'];
