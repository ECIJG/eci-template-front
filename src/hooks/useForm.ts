"use client";

import { useMemo, useState } from "react";

export type Rule = {
  required?: string;
  minLength?: {
    value: number;
    message: string;
  };
  maxLength?: {
    value: number;
    message: string;
  };
  email?: boolean;
  number?: boolean;
};

type Schema<T> = {
  [key in keyof T]?: Rule;
};

export default function useForm<T extends Record<string, any>>({
  initialValues,
  schema,
}: {
  initialValues: T;
  schema?: Schema<T>;
}) {
  const [values, setValues] = useState<T>(initialValues);

  const [errors, setErrors] = useState<Partial<Record<keyof T, string | null>>>(
    {},
  );

  const validateField = (name: keyof T, value: any): string | null => {
    const rules = schema?.[name];

    if (!rules) return null;

    const empty =
      value === null || value === undefined || String(value).trim() === "";

    if (rules.required && empty) {
      return rules.required;
    }

    if (rules.minLength && String(value).length < rules.minLength.value) {
      return rules.minLength.message;
    }

    if (rules.maxLength && String(value).length > rules.maxLength.value) {
      return rules.maxLength.message;
    }

    if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Correo inválido";
    }

    if (rules.number && !empty && isNaN(Number(value))) {
      return "Debe ser numérico";
    }

    return null;
  };

  const setValue = (name: keyof T, value: any) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    const error = validateField(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const setFormValues = (data: Partial<T>) => {
    setValues((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof T, string | null>> = {};

    Object.keys(values).forEach((key) => {
      const field = key as keyof T;

      newErrors[field] = validateField(field, values[field]);
    });

    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  const isValid = useMemo(() => {
    return Object.keys(schema || {}).every((key) => {
      const field = key as keyof T;

      return !validateField(field, values[field]);
    });
  }, [values, schema]);

  return {
    values,
    errors,

    setValue,
    setValues: setFormValues,

    validate,
    reset,

    isValid,
  };
}
