import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatNumber = (num: string | number, decimals: number = 2) => {
  return parseFloat(num.toString()).toFixed(decimals);
};

export const formatCurrency = (num: string | number) => {
  return `$${parseFloat(num.toString()).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};