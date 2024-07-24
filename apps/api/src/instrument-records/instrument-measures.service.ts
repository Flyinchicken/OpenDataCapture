import type { FormDataType } from '@douglasneuroinformatics/libui-form-types';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import type { Json } from '@opendatacapture/schemas/core';
import type {
  InstrumentMeasure,
  InstrumentMeasureValue,
  InstrumentMeasures
} from '@opendatacapture/schemas/instrument';
import type { Prisma } from '@prisma/client';
import { match } from 'ts-pattern';

@Injectable()
export class InstrumentMeasuresService {
  private readonly logger = new Logger(InstrumentMeasuresService.name);

  computeMeasures(measures: InstrumentMeasures, data: FormDataType | Json | Prisma.JsonValue) {
    const computedMeasures: { [key: string]: InstrumentMeasureValue } = {};
    for (const key in measures) {
      computedMeasures[key] = this.computeMeasure(measures[key], data);
    }
    return computedMeasures;
  }

  private computeMeasure(measure: InstrumentMeasure, data: FormDataType | Json | Prisma.JsonValue) {
    return match(measure)
      .with({ kind: 'computed' }, (measure) => {
        return measure.value(data);
      })
      .with({ kind: 'const' }, (measure) => {
        if (!(data && typeof data === 'object')) {
          this.logger.error({ data, message: 'Invalid Data' });
          const label = typeof measure.label === 'string' ? measure.label : (measure.label?.en ?? measure.label?.fr)!;
          throw new InternalServerErrorException(`Failed to compute measure '${label}': data must be object'`);
        }
        return Reflect.get(data, measure.ref) as InstrumentMeasureValue;
      })
      .exhaustive();
  }
}
