import { Sex } from '../enums/sex.enum';

import { ValidationSchema } from '@/core/decorators/validation-schema.decorator';

interface CreateSubjectData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: Sex;
}

@ValidationSchema<CreateSubjectData>({
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      minLength: 1
    },
    lastName: {
      type: 'string',
      minLength: 1
    },
    dateOfBirth: {
      type: 'string',
      format: 'date'
    },
    sex: {
      type: 'string',
      enum: Object.values(Sex)
    }
  },
  required: ['firstName', 'lastName', 'dateOfBirth', 'sex']
})
export class CreateSubjectDto {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: Sex;
}
