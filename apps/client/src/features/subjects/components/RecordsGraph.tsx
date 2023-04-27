import React, { useMemo, useState } from 'react';

import { DateUtils, FormInstrument, SubjectFormRecords } from '@douglasneuroinformatics/common';

import { Dropdown, LineGraph, SelectDropdown } from '@/components';

type SelectedMeasure = {
  key: string;
  label: string;
};

/** Apply a callback function to filter items from object */
function filterObj<T extends object>(obj: T, fn: (entry: { key: keyof T; value: T[keyof T] }) => any) {
  const result: Partial<T> = {};
  for (const key in obj) {
    if (fn({ key, value: obj[key] })) {
      result[key] = obj[key];
    }
  }
  return result;
}

export interface RecordsGraphProps {
  data: SubjectFormRecords[];
}

export const RecordsGraph = ({ data }: RecordsGraphProps) => {
  const [timeframe, setTimeframe] = useState<'all' | 'pastYear' | 'pastMonth'>('all');
  const [selectedInstrument, setSelectedInstrument] = useState<FormInstrument>();
  const [selectedMeasures, setSelectedMeasures] = useState<SelectedMeasure[]>([]);
  const records = data.find(({ instrument }) => instrument === selectedInstrument)?.records ?? [];

  /** Instrument identifiers mapped to titles */
  const instrumentOptions = Object.fromEntries(
    data
      .filter(({ instrument }) => instrument.measures)
      .map(({ instrument }) => [instrument.identifier, instrument.details.title])
  );

  const measureOptions = useMemo(() => {
    const arr: SelectedMeasure[] = [];
    if (selectedInstrument) {
      for (const measure in selectedInstrument.measures) {
        arr.push({
          key: measure,
          label: selectedInstrument.measures[measure].label
        });
      }
    }
    return arr;
  }, [selectedInstrument]);

  const graphData = useMemo(() => {
    const arr: Record<string, any>[] = [];
    for (const record of records) {
      arr.push({
        dateCollected: DateUtils.toBasicISOString(new Date(record.dateCollected)),
        ...filterObj(record.computedMeasures!, ({ key }) => selectedMeasures.find((item) => item.key === key))
      });
    }
    return arr;
  }, [records, selectedMeasures]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="ml-[70px] p-2">
        <h3 className="mb-5 text-center text-xl font-medium">
          {selectedInstrument?.details.title ?? 'Please Select an Instrument'}
        </h3>
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Dropdown
              className="text-sm"
              options={instrumentOptions}
              title="Instrument"
              variant="light"
              onSelection={(selection) => {
                setSelectedMeasures([]);
                setSelectedInstrument(data.find(({ instrument }) => instrument.identifier === selection)?.instrument);
              }}
            />
            <SelectDropdown
              className="text-sm"
              options={measureOptions}
              title="Measures"
              variant="light"
              onChange={setSelectedMeasures}
            />
          </div>
          <div>
            <Dropdown
              className="text-sm"
              options={{
                all: 'All',
                pastYear: 'Past Year',
                pastMonth: 'Past Month'
              }}
              title="Timeframe"
              variant="light"
              onSelection={setTimeframe}
            />
          </div>
        </div>
      </div>
      <div>
        <LineGraph
          data={graphData}
          legend="bottom"
          lines={selectedMeasures.map((measure) => ({
            name: measure.label,
            val: measure.key
          }))}
          xAxis={{
            key: 'dateCollected',
            label: 'Date Collected'
          }}
          yAxis={{
            label: 'Y'
          }}
        />
      </div>
    </div>
  );
};
