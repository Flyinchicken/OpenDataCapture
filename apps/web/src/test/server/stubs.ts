import type { Subject } from '@opendatacapture/schemas/subject';
import type { User } from '@opendatacapture/schemas/user';

export const adminUser: User = Object.freeze({
  basePermissionLevel: 'ADMIN',
  createdAt: new Date(),
  firstName: 'David',
  groupIds: [],
  groups: [],
  id: '12345',
  lastName: 'Roper',
  password: 'Password123',
  updatedAt: new Date(),
  username: 'david'
});

export const testSubject: Subject = Object.freeze({
  createdAt: new Date(),
  dateOfBirth: new Date(),
  firstName: 'testSubject',
  groupIds: [],
  id: '231314',
  lastName: 'tester',
  sex: 'MALE',
  updatedAt: new Date()
});
