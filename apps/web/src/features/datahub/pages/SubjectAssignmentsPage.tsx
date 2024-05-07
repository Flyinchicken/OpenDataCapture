import React, { useState } from 'react';

import { Button, Heading } from '@douglasneuroinformatics/libui/components';
import { PlusIcon } from '@heroicons/react/24/solid';
import type { Assignment } from '@opendatacapture/schemas/assignment';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useAssignmentsQuery } from '@/hooks/useAssignmentsQuery';
import { useCreateAssignment } from '@/hooks/useCreateAssignment';
import { useInstrumentSummariesQuery } from '@/hooks/useInstrumentSummariesQuery';
import { useUpdateAssignment } from '@/hooks/useUpdateAssignment';

import { AssignmentModal } from '../components/AssignmentModal';
import { AssignmentSlider } from '../components/AssignmentSlider';
import { AssignmentsTable } from '../components/AssignmentsTable';

export const SubjectAssignmentsPage = () => {
  const params = useParams();
  const { t } = useTranslation('datahub');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditSliderOpen, setIsEditSliderOpen] = useState(false);

  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const assignmentsQuery = useAssignmentsQuery({ params: { subjectId: params.subjectId } });
  const createAssignmentMutation = useCreateAssignment();
  const updateAssignmentMutation = useUpdateAssignment();

  const instrumentSummariesQuery = useInstrumentSummariesQuery();

  const instrumentOptions = Object.fromEntries(
    instrumentSummariesQuery.data.map((instrument) => [instrument.id, instrument.details.title])
  );

  return (
    <div>
      <div className="mb-5 flex flex-col items-center justify-start gap-2 md:justify-between lg:flex-row">
        <Heading variant="h4">{t('assignments.assignedInstruments')}</Heading>
        <Button className="w-full lg:w-auto" variant="secondary" onClick={() => setIsCreateModalOpen(true)}>
          {t('assignments.addAssignment')}
          <PlusIcon />
        </Button>
      </div>
      <AssignmentsTable
        assignments={assignmentsQuery.data}
        onSelection={(assignment) => {
          setSelectedAssignment(assignment);
          setIsEditSliderOpen(true);
        }}
      />
      <AssignmentSlider
        assignment={selectedAssignment}
        isOpen={isEditSliderOpen}
        setIsOpen={setIsEditSliderOpen}
        onCancel={({ id }) => {
          updateAssignmentMutation.mutate({ data: { status: 'CANCELED' }, params: { id } });
          setIsEditSliderOpen(false);
        }}
      />
      <AssignmentModal
        instrumentOptions={instrumentOptions}
        isOpen={isCreateModalOpen}
        setIsOpen={setIsCreateModalOpen}
        onSubmit={(data) => {
          createAssignmentMutation.mutate({ data: { ...data, subjectId: params.subjectId! } });
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
};
