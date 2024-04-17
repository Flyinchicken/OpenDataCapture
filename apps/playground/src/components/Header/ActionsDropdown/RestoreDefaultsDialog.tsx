import { AlertDialog, Button } from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import React from '@opendatacapture/runtime-v1/react.js';

import { useInstrumentStore } from '@/store/instrument.store';
import { useSettingsStore } from '@/store/settings.store';

export type RestoreDefaultsDialogProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

export const RestoreDefaultsDialog = ({ isOpen, setIsOpen }: RestoreDefaultsDialogProps) => {
  const addNotification = useNotificationsStore((store) => store.addNotification);
  const resetInstruments = useInstrumentStore((store) => store.resetInstruments);
  const resetSettings = useSettingsStore((store) => store.resetSettings);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
          <AlertDialog.Description>
            This action will <span className="font-bold uppercase">delete all user-defined instruments</span> in local
            storage and restore the default configuration.
          </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <Button
            variant="danger"
            onClick={() => {
              localStorage.clear();
              resetInstruments();
              resetSettings();
              addNotification({ type: 'success' });
              setIsOpen(false);
            }}
          >
            Reset
          </Button>
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
};
