import React from 'react';

import { Spinner } from '@douglasneuroinformatics/libui/components';
import { InstrumentRenderer } from '@opendatacapture/instrument-renderer';
import { P, match } from 'ts-pattern';

import { useTranspiler } from '@/hooks/useTranspiler';

import { CompileErrorFallback } from '../CompileErrorFallback';

export const Viewer = () => {
  const state = useTranspiler();
  return (
    <div className="h-full pl-12">
      {match(state)
        .with({ status: 'built' }, ({ bundle }) => (
          <InstrumentRenderer
            bundle={bundle}
            customErrorFallback={CompileErrorFallback}
            options={{ validate: true }}
            onSubmit={(data) => {
              // eslint-disable-next-line no-alert
              alert(JSON.stringify({ _message: 'The following data will be submitted', data }, null, 2));
            }}
          />
        ))
        .with({ status: 'error' }, CompileErrorFallback)
        .with({ status: P.union('building', 'initial') }, () => <Spinner />)
        .exhaustive()}
    </div>
  );
};
