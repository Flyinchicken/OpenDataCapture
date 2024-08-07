import { CryptoService } from '@douglasneuroinformatics/libnest/modules';
import { Injectable, Logger } from '@nestjs/common';
import { ConflictException, NotFoundException, UnprocessableEntityException } from '@nestjs/common/exceptions';
import { type BundlerInput, InstrumentBundler } from '@opendatacapture/instrument-bundler';
import {
  $AnyScalarInstrument,
  $FormInstrument,
  $InteractiveInstrument,
  type InstrumentKind,
  type InstrumentSummary,
  type SomeScalarInstrument
} from '@opendatacapture/schemas/instrument';
import type { Prisma } from '@prisma/client';
import { omit } from 'lodash-es';

import { accessibleQuery } from '@/ability/ability.utils';
import type { EntityOperationOptions } from '@/core/types';
import { InjectModel } from '@/prisma/prisma.decorators';
import type { Model } from '@/prisma/prisma.types';
import { VirtualizationService } from '@/virtualization/virtualization.service';

import { CreateInstrumentDto } from './dto/create-instrument.dto';

@Injectable()
export class InstrumentsService {
  private readonly instrumentBundler = new InstrumentBundler();
  private readonly logger = new Logger(InstrumentsService.name);

  constructor(
    @InjectModel('Instrument') private readonly instrumentModel: Model<'Instrument'>,
    private readonly cryptoService: CryptoService,
    private readonly virtualizationService: VirtualizationService
  ) {}

  async count(
    filter: NonNullable<Parameters<Model<'Instrument'>['count']>[0]>['where'] = {},
    { ability }: EntityOperationOptions = {}
  ) {
    return this.instrumentModel.count({ where: { AND: [accessibleQuery(ability, 'read', 'Instrument'), filter] } });
  }

  async create<TKind extends InstrumentKind>({ inputs, kind }: CreateInstrumentDto<TKind>) {
    this.logger.debug('Attempting to parse instrument source...');
    const bundle = await this.parseInputs(inputs);
    this.logger.debug('Done parsing source for instrument');

    return this.createFromBundle(bundle, { kind });
  }

  async createFromBundle<TKind extends InstrumentKind>(bundle: string, options?: { kind?: TKind }) {
    const instance = await this.interpretBundle(bundle, options);

    this.logger.debug(
      `Checking if instrument '${instance.internal.name}' edition '${instance.internal.edition}' exists...`
    );
    if (await this.instrumentModel.exists({ internal: instance.internal })) {
      throw new ConflictException(
        `Instrument with name '${instance.internal.name}' and edition '${instance.internal.edition}' already exists!`
      );
    }

    this.logger.debug(
      `Instrument with name '${instance.internal.name}' and edition '${instance.internal.edition}' does not exist`
    );

    /**
     * After upgrading TypeScript from v5.3 to 5.4, the type of string | { en: string, fr: string }
     * does not seem to be assignable to as Prisma.InputJsonValue anymore. I know this works and
     * don't have the time to fix it at the moment (the type error gives no useful info).
     */
    return this.instrumentModel.create({
      data: {
        ...omit({ ...instance }, ['content', 'measures', 'validationSchema']),
        bundle,
        details: {
          ...instance.details,
          authors: instance.details.authors ?? [],
          description: instance.details.description as Prisma.InputJsonValue,
          instructions: instance.details.instructions as Prisma.InputJsonValue,
          title: instance.details.title as Prisma.InputJsonValue
        },
        id: this.generateInstrumentId(instance.internal)
      }
    });
  }

  async find(query: { kind?: InstrumentKind } = {}, { ability }: EntityOperationOptions = {}) {
    return this.instrumentModel.findMany({
      where: { AND: [accessibleQuery(ability, 'read', 'Instrument'), query] }
    });
  }

  async findBundles(query: { kind?: InstrumentKind } = {}, { ability }: EntityOperationOptions = {}) {
    return this.instrumentModel.findMany({
      select: {
        bundle: true,
        id: true
      },
      where: { AND: [accessibleQuery(ability, 'read', 'Instrument'), query] }
    });
  }

  async findById(id: string, { ability }: EntityOperationOptions = {}) {
    const instrument = await this.instrumentModel.findFirst({
      where: { AND: [accessibleQuery(ability, 'read', 'Instrument')], id }
    });
    if (!instrument) {
      throw new NotFoundException(`Failed to find instrument with ID: ${id}`);
    }
    return instrument;
  }

  async findIds(query: { kind?: InstrumentKind } = {}, { ability }: EntityOperationOptions = {}) {
    return this.instrumentModel.findMany({
      select: { id: true },
      where: { AND: [accessibleQuery(ability, 'read', 'Instrument'), query] }
    });
  }

  async findInstanceById(id: string, options: EntityOperationOptions = {}) {
    return this.findById(id, options).then((instrument) => {
      return this.virtualizationService.getInstrumentInstance(instrument);
    });
  }

  async findSources(query: { kind?: InstrumentKind } = {}, { ability }: EntityOperationOptions = {}) {
    return this.instrumentModel.findMany({
      where: { AND: [accessibleQuery(ability, 'read', 'Instrument'), query] }
    });
  }

  async findSummaries(
    query: {
      kind?: InstrumentKind;
      subjectId?: string;
    } = {},
    { ability }: EntityOperationOptions = {}
  ): Promise<InstrumentSummary[]> {
    return this.instrumentModel.findMany({
      select: { details: true, id: true, internal: true, kind: true, language: true, tags: true },
      where: {
        AND: [
          {
            kind: query.kind,
            records: query.subjectId
              ? {
                  some: {
                    subjectId: query.subjectId
                  }
                }
              : undefined
          },
          accessibleQuery(ability, 'read', 'Instrument')
        ]
      }
    }) as Promise<InstrumentSummary[]>;
  }

  generateInstrumentId({ edition, name }: { edition: number; name: string }) {
    return this.cryptoService.hash(`${name}-${edition}`);
  }

  private async interpretBundle<TKind extends InstrumentKind>(bundle: string, options?: { kind?: TKind }) {
    let instance: SomeScalarInstrument<TKind>;
    try {
      instance = await this.virtualizationService.runInContext(bundle);
      switch (options?.kind) {
        case undefined:
          return $AnyScalarInstrument.parseAsync(instance);
        case 'FORM':
          return $FormInstrument.parseAsync(instance);
        case 'INTERACTIVE':
          return $InteractiveInstrument.parseAsync(instance);
        default:
          throw new Error(`Unexpected instrument kind: ${options?.kind}`);
      }
    } catch (err) {
      throw new UnprocessableEntityException('Failed to interpret instrument bundle', {
        cause: err
      });
    }
  }

  /**
   * Attempt to resolve an instance of an instrument from inputs.
   * If this fails, then throws an UnprocessableContentException
   */
  private async parseInputs(inputs: BundlerInput[]) {
    let bundle: string;
    try {
      bundle = await this.instrumentBundler.bundle({ inputs });
    } catch (err) {
      if (err instanceof Error) {
        this.logger.debug(err.cause);
        if (err.cause instanceof Error) {
          this.logger.debug(err.cause.cause);
        }
      }
      throw new UnprocessableEntityException('Failed to parse instrument source', {
        cause: err
      });
    }
    return bundle;
  }
}
