import { useFormContext } from 'react-hook-form';
import * as yup from 'yup';

/**
 * Zde vytvořte formulářové vstupy pomocí react-hook-form, které:
 * 1) Budou součástí formuláře v MainForm, ale zůstanou v odděleném souboru
 * 2) Reference formuláře NEbude získána skrze Prop input (vyvarovat se "Prop drilling")
 * 3) Získá volby (options) pro pole "kategorie" z externího API: https://dummyjson.com/products/categories jako "value" bude "slug", jako "label" bude "name".
 *
 *
 * V tomto souboru budou definovány pole:
 * allocation - number; Bude disabled pokud není amount (z MainForm) vyplněno. Validace na min=0, max=[zadaná hodnota v amount]
 * category - string; Select input s volbami z API (label=name; value=slug)
 * witnesses - FieldArray - dynamické pole kdy lze tlačítkem přidat a odebrat dalšího svědka; Validace minimálně 1 svědek, max 5 svědků
 * witnesses.name - string; Validace required
 * witnesses.email - string; Validace e-mail a asynchronní validace, že email neexistuje na API https://dummyjson.com/users/search?q=[ZADANÝ EMAIL]  - tato validace by měla mít debounce 500ms
 */
export interface NestedFieldsProps {}

export const nestedFieldsSchema = yup.object().shape({
  allocation: yup
    .number()
    .typeError('Value must be a number')
    .required('Allocation is required')
    .min(0)
    /*.test(
      'maxAllocation',
      'Allocation must be less than or equal to ${amount}',
      function (value) {
        return value <= this.parent.amount;
      }
    ),*/
    .max(
      yup.ref('amount'),
      'Allocation must be less than or equal to ${amount}'
    ),
});

export const NestedFields: React.FC<NestedFieldsProps> = (props) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();
  const amount = watch('amount');
  const hasAmount = !!amount;
  return (
    <>
      <div>
        <label htmlFor="allocation">Allocation</label>
        <input
          id="allocation"
          {...register('allocation')}
          type="number"
          disabled={!hasAmount}
          style={{ border: errors.allocation ? '1px solid red' : undefined }}
        />
        {hasAmount && errors.allocation && <p>{errors.allocation.message}</p>}
      </div>
    </>
  );
};
