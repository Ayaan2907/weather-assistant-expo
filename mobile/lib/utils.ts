import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCoordinates = (lat: number, lon: number) => {
  return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
};

export const temperatureOptions = [
  { label: 'Celsius (°C)', value: 'celsius' },
  { label: 'Fahrenheit (°F)', value: 'fahrenheit' },
];

export const windSpeedOptions = [
  { label: 'km/h', value: 'kmh' },
  { label: 'mph', value: 'mph' },
  { label: 'm/s', value: 'ms' },
];

export const precipitationOptions = [
  { label: 'Millimeters (mm)', value: 'mm' },
  { label: 'Inches (in)', value: 'inch' },
];

export const refreshIntervalOptions = [
  { label: '15 minutes', value: '15' },
  { label: '30 minutes', value: '30' },
  { label: '1 hour', value: '60' },
  { label: '2 hours', value: '120' },
];

export const themeOptions = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' },
];
