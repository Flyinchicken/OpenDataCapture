import { setupWorker } from 'msw/browser';

import { authHandlers } from './handlers/auth.handlers';
import { setupHandlers } from './handlers/setup.handlers';
import { SummaryHandlers } from './handlers/summary.handlers';
import { VisitHandler } from './handlers/visit.handlers';
import { FormHandlers } from './handlers/form.handlers';

export const worker = setupWorker(...authHandlers, ...setupHandlers, ...SummaryHandlers, ...VisitHandler, ...FormHandlers);
