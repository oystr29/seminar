import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// List skeleton
export function listSkel(element: JSX.Element, count?: number) {
  return Array.from({ length: count ?? 4 }, (_, i) => i).map(() => element);
}
