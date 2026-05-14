"use client";

import {
  emptyValue,
  validateString,
  verifyLetters,
  verifyNumbers,
} from "../libs/functionsStrings";
import { useEffect, useState } from "react";

export interface Validations {
  required?: string;
  validateEmail?: boolean;
  onlyNumbers?: boolean;
  onlyLetters?: boolean;
  minLength?: {
    value: number;
    message: string;
  };
  maxLength?: {
    value: number;
    message: string;
  };
}

export const validateValue = (
  value: string | null,
  validations: Validations | undefined
): {
  value: number | string | null;
  error: string | null;
  errors: string[];
} => {
  // WITHOUT VALIDATIONS
  if (Object.keys(validations ?? {}).length === 0) {
    return { value, error: null, errors: [] };
  }

  const errors = [];

  if (validations?.onlyNumbers) {
    const valueNumber = verifyNumbers(value ? String(value) : "");

    if (valueNumber === null) {
      errors.push("El valor debe ser numérico.");
    }
  }

  if (validations?.onlyLetters) {
    const valueVerified = verifyLetters(value);

    if (valueVerified === null) {
      errors.push("El valor solo debe contener letras.");
    }
  }

  // VALIDATE REQUIRED
  if (validations?.required && emptyValue(value)) {
    errors.push(
      validations.minLength
        ? validations.minLength.message
        : validations?.required
    );
  }

  // VALIDATE LENGTHS
  if (!validations?.validateEmail) {
    const valueLength = value ? String(value).length : 0;
    // VALIDATE MIN LENGTH
    if (validations?.minLength) {
      if (valueLength < validations?.minLength.value) {
        if (validations?.required) {
          errors.push(validations?.minLength.message);
        } else if (!validations?.required && valueLength > 0) {
          errors.push(validations?.minLength.message);
        }
      }
    }

    // VALIDATE MAX LENGTH
    if (validations?.maxLength) {
      if (valueLength > validations?.maxLength.value) {
        errors.push(validations?.maxLength.message);
      }
    }
  }

  // VALIDATE EMAIL
  if (validations?.validateEmail) {
    if (value) {
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
        errors.push("El email no es válido.");
      }
    }
  }

  return {
    value:
      value !== null
        ? validations && validations?.onlyNumbers
          ? verifyNumbers(value)
          : validations && validations?.onlyLetters
          ? validateString(value)
          : validateString(value)
        : value,
    error: errors.length > 0 ? errors[0] : null,
    errors: errors,
  };
};

export interface TypeUseValidateForm<TypeData> {
  setField: ({
    name,
    value,
  }: {
    name: string;
    value: string | number | null;
  }) => void;
  data: TypeData;
  validData: boolean;
  isReady: boolean;
  setReady: () => void;
  loadData: (data: any) => void;
  resetData: () => void;
  validators: (nameField: string) => Validations | undefined;
}

const useValidateForm = <TState>(
  requiredFields: {
    name: string;
    number?: boolean;
    validations?: Validations;
  }[],
  chargeData?: boolean
): TypeUseValidateForm<TState> => {
  const createInitialState = () => {
    const objInitialState: any = {};

    for (let field of requiredFields) {
      objInitialState[field.name] = null;
    }

    return objInitialState;
  };

  const [ready, setReady] = useState<boolean>(chargeData ? !chargeData : true);
  const [validData, setValidData] = useState<boolean>(false);
  const [data, setData] = useState<TState>(createInitialState());

  const setField = ({
    name,
    value,
  }: {
    name: string;
    value: string | number | null;
  }) => {
    const detailsField = requiredFields.find((field) => field.name === name);

    if (!detailsField) return;

    setData({
      ...data,
      [name]: !value
        ? null
        : detailsField.number
        ? isNaN(Number(value))
          ? null
          : Number(value)
        : value,
    });
  };

  const loadData = (data: any) => {
    setReady(false);
    const initialState = createInitialState();
    const currentKeys = Object.keys(initialState);
    const entries = Object.entries(data);

    for (let entry of entries) {
      if (currentKeys.includes(entry[0])) {
        initialState[entry[0]] = entry[1];
      }
    }

    setData(initialState);
    setReady(true);
  };

  const resetData = () => setData(createInitialState());

  const validators = (nameField: string): Validations | undefined => {
    const field = requiredFields.find((i) => i.name === nameField);

    if (!field) return undefined;

    return field.validations;
  };

  const validateData = (state: TState): void => {
    const entriesData = Object.entries(state as object);
    const totalInvalidFields = [];

    for (let entry of entriesData) {
      const requiredField = requiredFields.find(
        (field) => field.name === entry[0]
      );
      const result = validateValue(entry[1], requiredField?.validations);

      if (result.error) {
        totalInvalidFields.push(true);
      }
    }

    if (totalInvalidFields.length > 0) setValidData(false);
    if (totalInvalidFields.length < 1) setValidData(true);
  };

  useEffect(() => {
    validateData(data);
  }, [data]);

  return {
    setField,
    data,
    validData,
    isReady: ready,
    setReady: () => setReady(true),
    loadData,
    resetData,
    validators,
  };
};

export default useValidateForm;
