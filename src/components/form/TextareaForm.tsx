"use client";

import { cn } from "@/src/libs/utils";
import {
    Description,
    FieldError,
    Label,
    TextArea,
    TextField,
} from "@heroui/react";

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
    rows?: number;
};

export default function TextAreaForm<T>({
    form,
    name,
    label,
    placeholder,
    description,
    isRequired,
    isDisabled,
    className,
    icon,
    rows = 4,
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

            <TextArea
                name={fieldName}
                variant="secondary"
                rows={rows}
                placeholder={
                    placeholder ?? `Ingresar ${label ? label.toLowerCase() : fieldName}`
                }
                value={String(value)}
                className={cn("resize-none", {
                    "select-none cursor-not-allowed": isDisabled,
                })}
                aria-label={fieldName}
                onChange={(e) => form.setValue(name, e.target.value)}
            />

            {description && <Description>{description}.</Description>}

            <FieldError>{error}</FieldError>
        </TextField>
    );
}