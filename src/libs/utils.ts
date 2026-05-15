import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const validateString = (
  value: any,
  type: "str" | "int" | "date" = "str",
) => {
  if (value === "" || (value !== 0 && !value)) return null;

  if (type === "str") {
    return value.toString().trim();
  }

  if (type === "int") {
    const result = isNaN(Number(value)) ? -1 : Math.trunc(Number(value));

    if (result < 0) return null;

    return result;
  }

  if (type === "date") {
    if (isNaN(Date.parse(value))) return null;

    return value.toString().trim();
  }
};

export const emptyValue = (
  value: any,
  type: "str" | "int" = "str",
): boolean => {
  if (value !== 0 && !value) return true;

  if (type === "str") {
    if (value === "") return true;

    return false;
  }

  if (type === "int") {
    const result = isNaN(Number(value)) ? -1 : Math.trunc(Number(value));

    if (result < 0) return true;

    return false;
  }

  return true;
};

export const verifyLetters = (text: string | number | null): string | null => {
  if (text === null) return "";

  if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+$/g.test(String(text))) return null;

  return String(text).trim();
};

export const verifyNumbers = (value: string | number | null): number | null => {
  if (value === null) return null;

  if (!/^[0-9,$]*$/g.test(String(value))) return null;

  return Number(value);
};

export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== "string") {
    return false;
  }

  email = email.trim();

  if (email.length < 3 || email.length > 254) {
    return false;
  }

  const atIndex = email.indexOf("@");
  const lastAtIndex = email.lastIndexOf("@");

  if (atIndex === -1 || atIndex !== lastAtIndex) {
    return false;
  }

  if (atIndex === 0 || atIndex === email.length - 1) {
    return false;
  }

  const localPart = email.substring(0, atIndex);
  const domainPart = email.substring(atIndex + 1);

  if (
    localPart.length === 0 ||
    localPart.startsWith(".") ||
    localPart.endsWith("..") ||
    localPart.includes("..")
  ) {
    return false;
  }
  const allowedLocalChars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234456789.-_+%";
  for (let i = 0; i < localPart.length; i++) {
    if (!allowedLocalChars.includes(localPart[i])) {
      return false;
    }
  }

  const dotIndex = domainPart.indexOf(".");
  const lastDotIndex = domainPart.lastIndexOf(".");

  if (
    domainPart.length === 0 ||
    dotIndex === -1 ||
    domainPart.startsWith(".") ||
    domainPart.endsWith(".") ||
    domainPart.includes("..")
  ) {
    return false;
  }

  if (dotIndex === 0) {
    return false;
  }

  const tld = domainPart.substring(lastDotIndex + 1);
  if (tld.length < 2) {
    return false;
  }

  const allowedDomainChars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-.";
  for (let i = 0; i < domainPart.length; i++) {
    if (!allowedDomainChars.includes(domainPart[i])) {
      return false;
    }
  }

  if (email.includes(" ")) {
    return false;
  }

  return true;
};
