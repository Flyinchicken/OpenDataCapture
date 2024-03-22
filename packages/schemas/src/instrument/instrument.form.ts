import type {
  BaseFormField,
  BooleanFormField,
  DateFormField,
  FieldsetValue,
  NumberFormField,
  NumberRecordFieldValue,
  NumberRecordFormField,
  RecordArrayFieldValue,
  RecordArrayFormField,
  RequiredFieldValue,
  ScalarFieldValue,
  SetFormField,
  StaticFieldKind,
  StringFormField
} from '@douglasneuroinformatics/libui-form-types';
import type { Simplify } from 'type-fest';
import { z } from 'zod';

import { $$InstrumentUIOption, type InstrumentLanguage, type InstrumentUIOption } from './instrument.base.js';

const $StaticFieldKind: z.ZodType<StaticFieldKind> = z.enum([
  'string',
  'number',
  'boolean',
  'number-record',
  'record-array',
  'date',
  'set'
]);

/**
 * Utility type to implement one of the core field types defined in `@douglasneuroinformatics/libui-form-types`
 *
 * @typeParam TLanguage - the language(s) of the instrument
 * @typeParam TBase - the base field type that this field corresponds to
 * @typeParam TField - optional extensions to the multilingual base type, only applying to union members with the keys
 */
type FormInstrumentFieldMixin<
  TLanguage extends InstrumentLanguage,
  TBase extends BaseFormField,
  TField extends object = object
> = Simplify<
  TBase extends any
    ? Extract<keyof TField, string> extends Extract<keyof TBase, string>
      ? Omit<TBase, 'description' | 'label' | keyof TField> & {
          description?: InstrumentUIOption<TLanguage, string>;
          label: InstrumentUIOption<TLanguage, string>;
        } & TField
      : Omit<TBase, 'description' | 'label'> & {
          description?: InstrumentUIOption<TLanguage, string>;
          label: InstrumentUIOption<TLanguage, string>;
        }
    : never
>;
const $FormInstrumentBaseField = z.object({
  description: $$InstrumentUIOption(z.string().min(1)).optional(),
  isRequired: z.boolean().optional(),
  kind: $StaticFieldKind,
  label: $$InstrumentUIOption(z.string().min(1))
}) satisfies z.ZodType<FormInstrumentFieldMixin<InstrumentLanguage, BaseFormField>>;

type FormInstrumentStringField<
  TLanguage extends InstrumentLanguage = InstrumentLanguage,
  TValue extends string = string
> = FormInstrumentFieldMixin<
  TLanguage,
  StringFormField,
  {
    options: InstrumentUIOption<
      TLanguage,
      {
        [K in TValue]: string;
      }
    >;
  }
>;
const $FormInstrumentStringField: z.ZodType<FormInstrumentStringField> = z.union([
  $FormInstrumentBaseField.extend({
    kind: z.literal('string'),
    options: $$InstrumentUIOption(z.record(z.string().min(1))),
    variant: z.enum(['radio', 'select'])
  }),
  $FormInstrumentBaseField.extend({
    kind: z.literal('string'),
    variant: z.enum(['input', 'password', 'textarea'])
  })
]);

type FormInstrumentNumberField<
  TLanguage extends InstrumentLanguage = InstrumentLanguage,
  TValue extends number = number
> = FormInstrumentFieldMixin<
  TLanguage,
  NumberFormField,
  {
    options: InstrumentUIOption<
      TLanguage,
      {
        [K in TValue]: string;
      }
    >;
  }
>;
const $FormInstrumentNumberField: z.ZodType<FormInstrumentNumberField> = z.union([
  $FormInstrumentBaseField.extend({
    kind: z.literal('number'),
    max: z.number().int(),
    min: z.number().int(),
    variant: z.literal('slider')
  }),
  $FormInstrumentBaseField.extend({
    kind: z.literal('number'),
    max: z.number().optional(),
    min: z.number().optional(),
    variant: z.literal('input')
  }),
  $FormInstrumentBaseField.extend({
    kind: z.literal('number'),
    options: $$InstrumentUIOption(z.record(z.string().min(1))),
    variant: z.literal('radio')
  })
]);

type FormInstrumentDateField<TLanguage extends InstrumentLanguage = InstrumentLanguage> = FormInstrumentFieldMixin<
  TLanguage,
  DateFormField
>;
const $FormInstrumentDateField: z.ZodType<FormInstrumentDateField> = $FormInstrumentBaseField.extend({
  kind: z.literal('date')
});

type FormInstrumentBooleanField<TLanguage extends InstrumentLanguage = InstrumentLanguage> = FormInstrumentFieldMixin<
  TLanguage,
  BooleanFormField,
  {
    options?: InstrumentUIOption<
      TLanguage,
      {
        false: string;
        true: string;
      }
    >;
  }
>;
const $FormInstrumentBooleanField: z.ZodType<FormInstrumentBooleanField> = z.union([
  $FormInstrumentBaseField.extend({
    kind: z.literal('boolean'),
    variant: z.literal('checkbox')
  }),
  $FormInstrumentBaseField.extend({
    kind: z.literal('boolean'),
    options: $$InstrumentUIOption(
      z.object({
        false: z.string().min(1),
        true: z.string().min(1)
      })
    ).optional(),
    variant: z.literal('radio')
  })
]);

type FormInstrumentSetField<
  TLanguage extends InstrumentLanguage = InstrumentLanguage,
  TValue extends Set<string> = Set<string>
> = FormInstrumentFieldMixin<
  TLanguage,
  SetFormField<TValue>,
  {
    options: TValue extends Set<infer TItem extends string>
      ? InstrumentUIOption<
          TLanguage,
          {
            [K in TItem]: string;
          }
        >
      : never;
  }
>;
const $FormInstrumentSetField: z.ZodType<FormInstrumentSetField> = $FormInstrumentBaseField.extend({
  kind: z.literal('set'),
  options: $$InstrumentUIOption(z.record(z.string().min(1))),
  variant: z.enum(['listbox', 'select'])
});

/**
 * Conditional type representing a static field corresponding for a `ScalarFieldValue`
 *
 * @typeParam TLanguage - the language(s) of the instrument
 * @typeParam TValue - the value corresponding to this field in `FormDataType`, excluding undefined
 */
type FormInstrumentScalarField<
  TLanguage extends InstrumentLanguage = InstrumentLanguage,
  TValue extends RequiredFieldValue<ScalarFieldValue> = RequiredFieldValue<ScalarFieldValue>
> = TValue extends object
  ? TValue extends Date
    ? FormInstrumentDateField<TLanguage>
    : TValue extends Set<string>
      ? FormInstrumentSetField<TLanguage, TValue>
      : never
  : TValue extends string
    ? FormInstrumentStringField<TLanguage, TValue>
    : TValue extends number
      ? FormInstrumentNumberField<TLanguage, TValue>
      : TValue extends boolean
        ? FormInstrumentBooleanField<TLanguage>
        : never;

const $FormInstrumentScalarField: z.ZodType<FormInstrumentScalarField> = z.union([
  $FormInstrumentDateField,
  $FormInstrumentSetField,
  $FormInstrumentStringField,
  $FormInstrumentNumberField,
  $FormInstrumentBooleanField
]);

type FormInstrumentDynamicFieldsetField<
  TLanguage extends InstrumentLanguage = InstrumentLanguage,
  TFieldsetValue extends FieldsetValue = FieldsetValue,
  TValue extends RequiredFieldValue<ScalarFieldValue> = RequiredFieldValue<ScalarFieldValue>
> = {
  kind: 'dynamic';
  render: (fieldset: Partial<TFieldsetValue>) => FormInstrumentScalarField<TLanguage, TValue> | null;
};
const $FormInstrumentDynamicFieldsetField: z.ZodType<FormInstrumentDynamicFieldsetField> = z.object({
  kind: z.literal('dynamic'),
  render: z.function().args(z.any()).returns($FormInstrumentScalarField)
});

type FormInstrumentFieldset<
  TLanguage extends InstrumentLanguage = InstrumentLanguage,
  TFieldset extends { [key: string]: NonNullable<ScalarFieldValue> } = { [key: string]: NonNullable<ScalarFieldValue> }
> = {
  [K in keyof TFieldset]:
    | FormInstrumentDynamicFieldsetField<TLanguage, TFieldset, TFieldset[K]>
    | FormInstrumentScalarField<TLanguage, TFieldset[K]>;
};
const $FormInstrumentFieldset: z.ZodType<FormInstrumentFieldset> = z.record(
  z.union([$FormInstrumentDynamicFieldsetField, $FormInstrumentScalarField])
);

type FormInstrumentRecordArrayField<
  TLanguage extends InstrumentLanguage = InstrumentLanguage,
  TValue extends RequiredFieldValue<RecordArrayFieldValue> = RequiredFieldValue<RecordArrayFieldValue>
> = FormInstrumentFieldMixin<
  TLanguage,
  RecordArrayFormField<TValue>,
  {
    fieldset: FormInstrumentFieldset<TLanguage, TValue[number]>;
  }
>;
const $FormInstrumentRecordArrayField: z.ZodType<FormInstrumentRecordArrayField> = $FormInstrumentBaseField.extend({
  fieldset: $FormInstrumentFieldset,
  kind: z.literal('record-array')
});

type FormInstrumentNumberRecordField<
  TLanguage extends InstrumentLanguage = InstrumentLanguage,
  TValue extends RequiredFieldValue<NumberRecordFieldValue> = RequiredFieldValue<NumberRecordFieldValue>
> = FormInstrumentFieldMixin<
  TLanguage,
  NumberRecordFormField,
  {
    items: {
      [K in keyof TValue]: {
        description?: InstrumentUIOption<TLanguage, string>;
        label: InstrumentUIOption<TLanguage, string>;
      };
    };
    kind: 'number-record';
    options: InstrumentUIOption<
      TLanguage,
      {
        [key: number]: string;
      }
    >;
    variant: 'likert';
  }
>;

export { $FormInstrumentRecordArrayField, type FormInstrumentNumberRecordField };

// export type CompositeFormField<TValue extends RequiredFieldValue<CompositeFieldValue>> =
//   TValue extends RequiredFieldValue<RecordArrayFieldValue>
//     ? RecordArrayFormField<TValue>
//     : TValue extends RequiredFieldValue<NumberRecordFieldValue>
//       ? NumberRecordFormField<TValue>
//       : never;

// export type StaticFormField<TValue extends RequiredFieldValue> =
//   TValue extends RequiredFieldValue<ScalarFieldValue>
//     ? ScalarFormField<TValue>
//     : TValue extends RequiredFieldValue<CompositeFieldValue>
//       ? TValue extends RequiredFieldValue<RecordArrayFieldValue>
//         ? RecordArrayFormField<TValue>
//         : TValue extends RequiredFieldValue<NumberRecordFieldValue>
//           ? NumberRecordFormField<TValue>
//           : never
//       : never;

// export type StaticFormFields<
//   TData extends FormDataType,
//   TRequiredData extends RequiredFormDataType<TData> = RequiredFormDataType<TData>
// > = {
//   [K in keyof TRequiredData]: StaticFormField<TRequiredData[K]>;
// };

// export type DynamicFormField<TData extends FormDataType, TValue extends RequiredFieldValue = RequiredFieldValue> = {
//   deps: readonly Extract<keyof TData, string>[];
//   kind: 'dynamic';
//   render: (data: PartialFormDataType<TData> | null) => StaticFormField<TValue> | null;
// };

// export type UnknownFormField<
//   TData extends FormDataType = FormDataType,
//   TKey extends keyof TData = keyof TData,
//   TRequiredData extends RequiredFormDataType<TData> = RequiredFormDataType<TData>
// > = DynamicFormField<TData, TRequiredData[TKey]> | StaticFormField<TRequiredData[TKey]>;

// export type FormFields<TData extends FormDataType = FormDataType> = {
//   [K in keyof TData]-?: UnknownFormField<TData, K>;
// };

// export type FormFieldsGroup<TData extends FormDataType> = {
//   description?: string;
//   fields: {
//     [K in keyof TData]?: UnknownFormField<RequiredFormDataType<TData>, K>;
//   };
//   title: string;
// };

// export type FormContent<TData extends FormDataType = FormDataType> = FormFields<TData> | FormFieldsGroup<TData>[];
