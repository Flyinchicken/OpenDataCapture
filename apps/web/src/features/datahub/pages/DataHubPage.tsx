import React from 'react';

import { Heading } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from 'react-i18next';

import { LoadingFallback } from '@/components/LoadingFallback';
import { PageHeader } from '@/components/PageHeader';

import { SubjectsTable } from '../components/SubjectsTable';

export const DataHubPage = () => {
  const { t } = useTranslation('datahub');

  return (
    <React.Fragment>
      <PageHeader>
        <Heading className="text-center" variant="h2">
          {t('index.title')}
        </Heading>
      </PageHeader>
      <React.Suspense fallback={<LoadingFallback />}>
        <SubjectsTable />
      </React.Suspense>
    </React.Fragment>
  );
};