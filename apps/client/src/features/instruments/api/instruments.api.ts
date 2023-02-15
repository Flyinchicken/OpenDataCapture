import axios from 'axios';
import { BaseInstrumentInterface, InstrumentInterface, baseInstrumentSchema, instrumentSchema } from 'common';
import { z } from 'zod';

export class InstrumentsAPI {
  static async getAvailableInstruments(): Promise<BaseInstrumentInterface[]> {
    const response = await axios.get('/api/instruments/available');
    return z.array(baseInstrumentSchema).parseAsync(response.data);
  }

  static async getInstrument(name: string): Promise<InstrumentInterface> {
    const response = await axios.get(`/api/instruments/archive/${name}`);
    return instrumentSchema.parseAsync(response.data);
  }

  static async submitRecord(title: string) {
    await axios.post(`/api/instruments/records/${title}`, {});
  }
}
