import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, Path, useForm, UseFormProps } from 'react-hook-form';
import { ZodSchema } from 'zod';

interface UseFormWithZodProps<T extends FieldValues> extends Omit<UseFormProps<T>, 'resolver'> {
  schema: ZodSchema<T>;
}

export function useFormWithZod<T extends FieldValues>({
  schema,
  ...props
}: UseFormWithZodProps<T>) {
  return useForm<T>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    ...props,
  });
}

// Field error helper
export function getFieldError<T extends FieldValues>(
  errors: any,
  fieldName: Path<T>
): string | undefined {
  const error = fieldName.split('.').reduce((err, key) => err?.[key], errors);
  return error?.message;
}