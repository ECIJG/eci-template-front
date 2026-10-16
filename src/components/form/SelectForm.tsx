"use client";

import type { Key } from "@heroui/react";

import { cn } from "@/src/libs/utils";
import {
  Autocomplete,
  Description,
  EmptyState,
  FieldError,
  Label,
  ListBox,
  SearchField,
  useFilter,
} from "@heroui/react";
import Icon from "../ui/Icon";

type Option = {
  label: string;
  value: string | number;
  description?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
};

type Props<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  name: keyof T;
  label?: string;
  placeholder?: string;
  description?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  className?: string;
  icon?: string;
  options: Option[];
};

export default function AutocompleteForm<T>({
  form,
  name,
  label,
  placeholder,
  description,
  isRequired,
  isDisabled,
  className,
  icon,
  options,
}: Props<T>) {
  const { contains } = useFilter({
    sensitivity: "base",
  });

  const fieldName = String(name);

  const value = form.values[name];
  const error = form.errors[name];

  return (
    <Autocomplete
      variant="secondary"
      isInvalid={!!error}
      allowsEmptyCollection
      selectionMode="single"
      isRequired={isRequired}
      isDisabled={isDisabled}
      value={value ? String(value) : null}
      placeholder={
        placeholder ?? `Seleccionar ${label ? label.toLowerCase() : fieldName}`
      }
      onChange={(key: Key | Key[] | null) => {
        form.setValue(name, key || null);
      }}
      className={cn(
        {
          "select-none cursor-not-allowed": isDisabled,
        },
        className,
      )}
    >
      {label && <Label>{label}</Label>}

      <Autocomplete.Trigger>
        {icon && <Icon icon={icon} className="mr-3 text-field-placeholder" />}
        <Autocomplete.Value />
        {!isRequired && <Autocomplete.ClearButton />}
        <Autocomplete.Indicator />
      </Autocomplete.Trigger>

      <Autocomplete.Popover>
        <Autocomplete.Filter filter={contains}>
          <SearchField
            autoFocus
            name={`${fieldName}-search`}
            variant="secondary"
          >
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="Buscar..." />

              {!isRequired && <SearchField.ClearButton />}
            </SearchField.Group>
          </SearchField>

          <ListBox
            renderEmptyState={() => (
              <EmptyState>No se encontraron resultados</EmptyState>
            )}
          >
            {options.map((option) => (
              <ListBox.Item
                key={String(option.value)}
                id={String(option.value)}
                textValue={option.label}
              >
                <div className="flex items-center gap-3">
                  {option.startContent && (
                    <div className="shrink-0">{option.startContent}</div>
                  )}
                  <div>
                    {option.label}
                    {option.description && (
                      <p className="text-xs truncate max-w-[300px] text-gray-400">
                        {option.description}
                      </p>
                    )}
                  </div>
                  {option.endContent && (
                    <div className="shrink-0 justify-end">
                      {option.endContent}
                    </div>
                  )}
                </div>
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Autocomplete.Filter>
      </Autocomplete.Popover>

      {description && <Description>{description}.</Description>}

      <FieldError>{error}</FieldError>
    </Autocomplete>
  );
}
