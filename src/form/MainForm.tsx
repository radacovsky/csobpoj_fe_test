/**
 * Zde vytvořte formulář pomocí knihovny react-hook-form.
 * Formulář by měl splňovat:
 * 1) být validován yup schématem
 * 2) formulář obsahovat pole "NestedFields" z jiného souboru
 * 3) být plně TS typovaný
 * 4) nevalidní vstupy červeně označit (background/outline/border) a zobrazit u nich chybové hlášky
 * 5) nastavte výchozí hodnoty objektem initalValues
 * 6) mít "Submit" tlačítko, po jeho stisku se vylogují data z formuláře:  "console.log(formData)"
 *
 * V tomto souboru budou definovány pole:
 * amount - number; Validace min=0, max=300
 * damagedParts - string[] formou multi-checkboxu s volbami "roof", "front", "side", "rear"
 * vykresleny pole z form/NestedFields
 */

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { NestedFields, nestedFieldsSchema } from './NestedFields';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// příklad očekávaného výstupního JSON, předvyplňte tímto objektem formulář
export const initialValues = {
  amount: 250,
  allocation: 140,
  damagedParts: ['side', 'rear'],
  category: 'kitchen-accessories',
  witnesses: [
    {
      name: 'Marek',
      email: 'marek@email.cz',
    },
    {
      name: 'Emily',
      email: 'emily.johnson@x.dummyjson.com',
    },
  ],
};

const damagedPartsOptions = ['roof', 'front', 'side', 'rear'];

export const MainFormSchema = yup.object().shape({
  amount: yup
    .number()
    .typeError('Value must be a number')
    .required('Amount is required')
    .min(0)
    .max(300),
  damagedParts: yup.array().of(yup.string().oneOf(damagedPartsOptions)),
  ...nestedFieldsSchema.fields,
});

export interface MainFormProps {
  initialValues?: yup.InferType<typeof MainFormSchema>;
}

export const MainForm: React.FC<MainFormProps> = (props) => {
  const form = useForm({
    defaultValues: props.initialValues,
    resolver: yupResolver(MainFormSchema),
  });
  const onSubmit = (data) => console.log(data);
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            {...form.register('amount')}
            type="number"
            style={{
              border: form.formState.errors.amount
                ? '1px solid red'
                : undefined,
            }}
          />
          {form.formState.errors.amount && (
            <p>{form.formState.errors.amount.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="damagedParts">Damaged parts</label>
          <div id="damagedParts">
            {damagedPartsOptions.map((part) => (
              <div key={part}>
                <label>
                  <input
                    type="checkbox"
                    value={part}
                    {...form.register('damagedParts')}
                    style={{
                      border: form.formState.errors.damagedParts
                        ? '1px solid red'
                        : undefined,
                    }}
                  />
                  {part}
                </label>
              </div>
            ))}
          </div>
        </div>
        <NestedFields />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
};
