import { type ClassValue, clsx } from "clsx"
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function encryptKey(passkey: string) {
  return btoa(passkey);
}

export function decryptKey(passkey: string) {
  return atob(passkey);
}

export const convertToIST = (timestamp: number) => {
  // Create a new Date object with the provided timestamp
  const date = new Date(timestamp);

  // Define options for formatting the date and time
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Kolkata", // Indian Standard Time (IST) timezone
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  // Format the date using Intl.DateTimeFormat
  return new Intl.DateTimeFormat("en-IN", options).format(date);
};

export const useDebounce = <T,>(value: T, delay = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);

  return debouncedValue;
};