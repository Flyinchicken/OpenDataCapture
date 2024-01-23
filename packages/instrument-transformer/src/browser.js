import initSwc, { parse, parseSync, transform, transformSync } from '@swc/wasm-web';

import { BaseInstrumentTransformer } from './base';

await initSwc();

export class InstrumentTransformer extends BaseInstrumentTransformer {
  constructor() {
    super({
      parse,
      parseSync,
      transform,
      transformSync
    });
  }
}
