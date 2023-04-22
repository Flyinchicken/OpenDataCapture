import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { AccessibleModel } from '@casl/mongoose';
import { FormInstrument, FormInstrumentData, FormInstrumentSummary } from '@douglasneuroinformatics/common';
import { TranslatedForms } from '@douglasneuroinformatics/instruments';
import { Model, ObjectId } from 'mongoose';

import { FormInstrumentEntity } from '../entities/form-instrument.entity';
import { InstrumentEntity } from '../entities/instrument.entity';

@Injectable()
export class FormsService {
  constructor(
    @InjectModel(InstrumentEntity.modelName)
    private readonly formModel: Model<FormInstrumentEntity, AccessibleModel<FormInstrumentEntity>>
  ) {}

  create<T extends FormInstrumentData>(formInstrument: FormInstrument<T>): Promise<FormInstrument> {
    return this.formModel.create(formInstrument);
  }

  async createTranslatedForms<T extends FormInstrumentData>(
    translatedForms: TranslatedForms<T>
  ): Promise<FormInstrument[]> {
    translatedForms;
    return Promise.all(Object.values(translatedForms).map(async (form) => await this.create(form)));
  }

  findAll(): Promise<FormInstrument[]> {
    return this.formModel.find({ kind: 'form' });
  }

  async getAvailable(): Promise<FormInstrumentSummary[]> {
    return this.formModel.find({ kind: 'form' }).select('name tags version details').lean();
  }

  async findById(id: string | ObjectId): Promise<FormInstrument> {
    const result = await this.formModel.findById(id);
    if (!result || result.kind !== 'form') {
      throw new NotFoundException(`Failed to find form with id: ${id.toString()}`);
    }
    return result;
  }

  async findByName(name: string): Promise<FormInstrument> {
    const result = await this.formModel.findOne({ name });
    if (!result || result.kind !== 'form') {
      throw new NotFoundException(`Failed to find form with name: ${name}`);
    }
    return result;
  }

  async remove(id: string): Promise<FormInstrument> {
    const result = await this.formModel.findByIdAndDelete(id, { new: true });
    if (!result) {
      throw new NotFoundException(`Failed to find form with id: ${id}`);
    }
    return result;
  }
}
