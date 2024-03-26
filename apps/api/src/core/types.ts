import type { PureAbility } from '@casl/ability';
import type { PrismaQuery } from '@casl/prisma';
import type {
  GroupModel,
  InstrumentRecordModel,
  SubjectModel,
  UserModel,
  VisitModel
} from '@opendatacapture/database/core';
import type { AppAction, AppSubjectName } from '@opendatacapture/schemas/core';

type AppSubject = AppSubjectName | GroupModel | InstrumentRecordModel | SubjectModel | UserModel | VisitModel;

export type AppAbility = PureAbility<[AppAction, AppSubject], PrismaQuery>;

export type EntityOperationOptions = {
  ability?: AppAbility;
};
