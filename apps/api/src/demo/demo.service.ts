import { randomValue } from '@douglasneuroinformatics/libjs';
import { toUpperCase } from '@douglasneuroinformatics/libjs';
import { faker } from '@faker-js/faker';
import { Injectable, Logger } from '@nestjs/common';
import { DEMO_GROUPS, DEMO_USERS } from '@opendatacapture/demo';
import briefPsychiatricRatingScale from '@opendatacapture/instrument-library/forms/brief-psychiatric-rating-scale.js';
import enhancedDemographicsQuestionnaire from '@opendatacapture/instrument-library/forms/enhanced-demographics-questionnaire.js';
import happinessQuestionnaire from '@opendatacapture/instrument-library/forms/happiness-questionnaire.js';
import miniMentalStateExamination from '@opendatacapture/instrument-library/forms/mini-mental-state-examination.js';
import montrealCognitiveAssessment from '@opendatacapture/instrument-library/forms/montreal-cognitive-assessment.js';
import patientHealthQuestionnaire9 from '@opendatacapture/instrument-library/forms/patient-health-questionnaire-9.js';
import breakoutTask from '@opendatacapture/instrument-library/interactive/breakout-task.js';
import { type Json, type Language } from '@opendatacapture/schemas/core';
import type { Group } from '@opendatacapture/schemas/group';
import type { FormInstrument } from '@opendatacapture/schemas/instrument';
import { encodeScopedSubjectId, generateSubjectHash } from '@opendatacapture/subject-utils';

import { GroupsService } from '@/groups/groups.service';
import { InstrumentRecordsService } from '@/instrument-records/instrument-records.service';
import { InstrumentsService } from '@/instruments/instruments.service';
import { PrismaService } from '@/prisma/prisma.service';
import { SessionsService } from '@/sessions/sessions.service';
import { SubjectsService } from '@/subjects/subjects.service';
import { UsersService } from '@/users/users.service';
import { VirtualizationService } from '@/virtualization/virtualization.service';

type HappinessQuestionnaireData = {
  isSatisfiedOverall: boolean;
  personalLifeSatisfaction: number;
  professionalLifeSatisfaction: number;
  reasonNotSatisfied?: string;
};

faker.seed(123);

@Injectable()
export class DemoService {
  private readonly logger = new Logger(DemoService.name);

  constructor(
    private readonly groupsService: GroupsService,
    private readonly instrumentRecordsService: InstrumentRecordsService,
    private readonly instrumentsService: InstrumentsService,
    private readonly prismaService: PrismaService,
    private readonly sessionsService: SessionsService,
    private readonly subjectsService: SubjectsService,
    private readonly usersService: UsersService,
    private readonly virtualizationService: VirtualizationService
  ) {}

  async init({
    dummySubjectCount,
    recordsPerSubject
  }: {
    dummySubjectCount: number;
    recordsPerSubject: number;
  }): Promise<void> {
    try {
      const dbName = await this.prismaService.getDbName();
      this.logger.log(`Initializing demo for database: '${dbName}'`);

      const hq = (await this.instrumentsService
        .createFromBundle(happinessQuestionnaire)
        .then((entity) => this.virtualizationService.getInstrumentInstance(entity))) as FormInstrument<
        HappinessQuestionnaireData,
        Language[]
      >;

      await Promise.all([
        this.instrumentsService.createFromBundle(briefPsychiatricRatingScale),
        this.instrumentsService.createFromBundle(enhancedDemographicsQuestionnaire),
        this.instrumentsService.createFromBundle(miniMentalStateExamination),
        this.instrumentsService.createFromBundle(montrealCognitiveAssessment),
        this.instrumentsService.createFromBundle(patientHealthQuestionnaire9)
      ]);

      this.logger.debug('Done creating forms');

      await this.instrumentsService.createFromBundle(breakoutTask);
      this.logger.debug('Done creating interactive instruments');

      const groups: Group[] = [];
      for (const group of DEMO_GROUPS) {
        groups.push(await this.groupsService.create(group));
      }
      this.logger.debug('Done creating groups');

      for (const user of DEMO_USERS) {
        await this.usersService.create({
          ...user,
          groupIds: user.groupNames.map((name) => groups.find((group) => group.name === name)!.id)
        });
      }
      this.logger.debug('Done creating users');

      let researchId = 1;
      for (let i = 0; i < dummySubjectCount; i++) {
        this.logger.debug(`Creating dummy subject ${i + 1}/${dummySubjectCount}`);
        const group = randomValue(groups);
        const subjectIdData = {
          dateOfBirth: faker.date.birthdate(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          sex: toUpperCase(faker.person.sexType())
        };

        let subjectId: string;
        if (group.type === 'CLINICAL') {
          subjectId = await generateSubjectHash(subjectIdData);
        } else {
          subjectId = encodeScopedSubjectId(researchId, { groupName: group.name });
          researchId++;
        }

        const subject = await this.subjectsService.create({
          ...subjectIdData,
          id: subjectId
        });

        const session = await this.sessionsService.create({
          date: new Date(),
          groupId: group.id,
          subjectData: subject,
          type: 'IN_PERSON'
        });

        for (let i = 0; i < recordsPerSubject; i++) {
          const isSatisfiedOverall = faker.datatype.boolean();
          const [min, max] = isSatisfiedOverall ? [5, 10] : [1, 5];
          const data: HappinessQuestionnaireData = {
            isSatisfiedOverall,
            personalLifeSatisfaction: faker.number.int({ max, min }),
            professionalLifeSatisfaction: faker.number.int({ max, min })
          };
          if (!isSatisfiedOverall) {
            data.reasonNotSatisfied = faker.lorem.sentence();
          }
          await this.instrumentRecordsService.create({
            data: data as Json,
            date: faker.date.past({ years: 2 }),
            groupId: group.id,
            instrumentId: this.instrumentsService.generateInstrumentId(hq.internal),
            sessionId: session.id,
            subjectId: subject.id
          });
        }
        this.logger.debug(`Done creating dummy subject ${i + 1}`);
      }
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(err.cause);
        this.logger.error(err);
      }
      throw err;
    }
  }
}
