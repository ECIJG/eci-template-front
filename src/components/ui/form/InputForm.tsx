"use client";

import { FieldError, Input, Label, TextField } from "@heroui/react";

type Props<T> = {
  form: any;
  name: keyof T;
  label?: string;
  type?: string;
  placeholder?: string;
  description?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  className?: string;
};

export default function InputForm<T>({
  form,
  name,
  label,
  type = "text",
  placeholder,
  description,
  isRequired,
  isDisabled,
  className,
}: Props<T>) {
  const fieldName = String(name);
  const value = form.values[name] ?? "";

  const error = form.errors[name];

  return (
    <TextField
      isInvalid={!!error}
      isRequired={isRequired}
      isDisabled={isDisabled}
      className={className}
    >
      {label && <Label>{label}</Label>}
      {description && (
        <p className="text-xs text-foreground/60">{description}.</p>
      )}

      <Input
        name={fieldName}
        type={type}
        placeholder={
          placeholder ?? `Ingresar ${label ? label.toLowerCase() : fieldName}`
        }
        value={String(value)}
        variant="secondary"
        className={isDisabled ? "select-none" : undefined}
        onChange={(e) =>
          form.setValue(
            name,
            type === "number"
              ? e.target.value === ""
                ? null
                : Number(e.target.value)
              : e.target.value,
          )
        }
      />


      <FieldError>{error}</FieldError>
    </TextField>
  );
}
