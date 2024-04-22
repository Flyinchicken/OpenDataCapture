import React from 'react';

import { LanguageToggle, ThemeToggle } from '@douglasneuroinformatics/libui/components';
import { Branding } from '@opendatacapture/react-core';

import { ActionsDropdown } from './ActionsDropdown';
import { CloneButton } from './CloneButton';
import { DownloadButton } from './DownloadButton';
import { InstrumentSelector } from './InstrumentSelector';
import { RefreshButton } from './RefreshButton';
import { ShareButton } from './ShareButton';

export const Header = () => {
  return (
    <header className="flex h-16 items-center justify-between py-4">
      <Branding />
      <div className="flex space-x-2">
        <InstrumentSelector />
        <CloneButton />
        <ShareButton />
        <ThemeToggle className="h-9 w-9" />
        <LanguageToggle
          align="end"
          options={{
            en: 'English',
            fr: 'Français'
          }}
          triggerClassName="h-9 w-9"
        />
        <DownloadButton />
        <RefreshButton />
        <ActionsDropdown />
      </div>
    </header>
  );
};
