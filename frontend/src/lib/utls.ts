import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {format} from "date-fns"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function rgbToHex(rgb: string): string {
  // Memisahkan string RGB menjadi array
  const splitedRgb = rgb.split(",").map(Number);

  // Fungsi untuk mengubah satu nilai RGB menjadi Hex
  const toHex = (rgbValue: number): string => {
    const hex = rgbValue.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };

  // Mengubah setiap nilai RGB menjadi Hex dan menggabungkannya
  const hexColor =
    "#" + toHex(splitedRgb[0]) + toHex(splitedRgb[1]) + toHex(splitedRgb[2]);

  return hexColor;
}

import axios from "axios";
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const imageFromBackend = (url: string) => {
  return import.meta.env.VITE_SERVER_URL + "/public/" + url;
};

export const rupiahFormat = (value: number): string => {
  const formattedValue = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);

  // Remove the decimal part
  const [integerPart] = formattedValue.split(',');

  return integerPart;
};


export const dateFormat = (date: string): string => {
  return format(new Date(date), "dd MMM yyyy");
}