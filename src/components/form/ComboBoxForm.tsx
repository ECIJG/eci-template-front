"use client"

import { ComboBox, Description, FieldError, Input, Label, ListBox, EmptyState, type Key } from "@heroui/react"
import { cn } from "@/src/libs/utils"
import { useState } from "react"

type Option = {
    label: string;
    value: string | number;
    description?: string | undefined
};

type Props<T> = {
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

export default function ComboBoxForm<T>({
    form,
    name,
    label,
    placeholder,
    description,
    isRequired,
    isDisabled,
    className,
    options,
}: Props<T>) {
    const fieldName = String(name);
    const error = form.errors?.[name];

    const formValue = form.values?.[name];

    const matchedOption = options.find(
        (o) => String(o.value) === String(formValue ?? "")
    );

    const [inputText, setInputText] = useState<string>(
        matchedOption ? matchedOption.label : (formValue ? String(formValue) : "")
    );

    const handleInputChange = (text: string) => {
        setInputText(text);

        if (!text) {
            form.setValue(fieldName, null);
            return;
        }

        const exactMatch = options.find(
            (o) => o.label.toLowerCase() === text.toLowerCase()
        );

        if (exactMatch) {
            form.setValue(fieldName, exactMatch.value);
        } else {
            form.setValue(fieldName, text);
        }
    };

    const handleSelectionChange = (key: Key | null) => {
        if (!key) {
            setInputText("");
            form.setValue(fieldName, null);
            return;
        }

        const selected = options.find((o) => String(o.value) === String(key));
        if (selected) {
            setInputText(selected.label);
            form.setValue(fieldName, selected.value);
        }
    };

    return (
        <ComboBox
            allowsCustomValue
            isInvalid={!!error}
            variant="secondary"
            allowsEmptyCollection
            inputValue={inputText}
            isRequired={isRequired}
            isDisabled={isDisabled}
            onInputChange={handleInputChange}
            onSelectionChange={handleSelectionChange}
            selectedKey={matchedOption ? String(matchedOption.value) : null}
            className={cn(
                { "select-none cursor-not-allowed": isDisabled },
                className
            )}
        >
            {label && <Label>{label}</Label>}
            <ComboBox.InputGroup>
                <Input
                    placeholder={
                        placeholder ?? `Seleccionar ${label ? label.toLowerCase() : fieldName}`
                    }
                />
                <ComboBox.Trigger />
            </ComboBox.InputGroup>
            {description && <Description>{description}</Description>}
            {error && <FieldError>{error}</FieldError>}
            <ComboBox.Popover>
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
                            <div>
                                {option.label}
                                {option.description && (
                                    <p className="text-xs text-gray-400">{option.description}</p>
                                )}
                            </div>
                            <ListBox.ItemIndicator />
                        </ListBox.Item>
                    ))}
                </ListBox>
            </ComboBox.Popover>
        </ComboBox>
    );
}