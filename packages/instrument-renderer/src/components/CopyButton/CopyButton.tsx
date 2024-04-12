import React, { useState } from 'react';

import { Button } from '@douglasneuroinformatics/libui/components';
import { AnimatePresence, motion } from 'framer-motion';
import { ClipboardCheckIcon, ClipboardListIcon } from 'lucide-react';
import { match } from 'ts-pattern';

export const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [state, setState] = useState<'READY' | 'SUCCESS'>('READY');

  return (
    <Button
      data-testid=""
      size="icon"
      type="button"
      variant="outline"
      onClick={() => {
        if (state === 'READY') {
          navigator.clipboard
            .writeText(text)
            .then(() => setState('SUCCESS'))
            .catch(console.error);
        }
      }}
      onMouseLeave={() => {
        setState('READY');
      }}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          key={state}
          transition={{ duration: 0.5 }}
        >
          {match(state)
            .with('READY', () => <ClipboardListIcon height={20} width={20} />)
            .with('SUCCESS', () => <ClipboardCheckIcon height={20} width={20} />)
            .exhaustive()}
        </motion.div>
      </AnimatePresence>
    </Button>
  );
};
