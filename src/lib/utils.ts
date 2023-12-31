import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// List skeleton
export function listSkel(element: (key: number) => JSX.Element, count?: number) {
  return Array.from({ length: count ?? 4 }, (_, i) => i).map((i) => element(i));
}
