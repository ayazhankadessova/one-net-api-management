import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {Location} from "@/types/common"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const validateCoordinates = (field: keyof Location, value: number | null) => {
    if (value === null) return ''

    if (field === 'lat' && (value < -90 || value > 90)) {
      return 'Latitude must be between -90 and 90'
    }
    if (field === 'lon' && (value < -180 || value > 180)) {
      return 'Longitude must be between -180 and 180'
    }
    return ''
  }
