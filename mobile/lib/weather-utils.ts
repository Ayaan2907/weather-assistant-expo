import { TemperatureUnit, WindSpeedUnit, PrecipitationUnit } from './settings-store'

export function formatTemperature(celsius: number, unit: TemperatureUnit): string {
  if (unit === 'fahrenheit') {
    const fahrenheit = (celsius * 9/5) + 32
    return `${Math.round(fahrenheit)}°F`
  }
  return `${Math.round(celsius)}°C`
}

export function formatWindSpeed(kmh: number, unit: WindSpeedUnit): string {
  switch (unit) {
    case 'mph':
      const mph = kmh * 0.621371
      return `${Math.round(mph)} mph`
    case 'ms':
      const ms = kmh / 3.6
      return `${Math.round(ms)} m/s`
    default:
      return `${Math.round(kmh)} km/h`
  }
}

export function formatPrecipitation(mm: number, unit: PrecipitationUnit): string {
  if (unit === 'inch') {
    const inches = mm * 0.0393701
    return `${inches.toFixed(1)} in`
  }
  return `${mm.toFixed(1)} mm`
}

export function getTemperatureSymbol(unit: TemperatureUnit): string {
  return unit === 'fahrenheit' ? '°F' : '°C'
}

export function getWindSpeedSymbol(unit: WindSpeedUnit): string {
  switch (unit) {
    case 'mph':
      return 'mph'
    case 'ms':
      return 'm/s'
    default:
      return 'km/h'
  }
}

export function getPrecipitationSymbol(unit: PrecipitationUnit): string {
  return unit === 'inch' ? 'in' : 'mm'
} 