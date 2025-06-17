// Weather code mappings based on WMO Weather interpretation codes
export const weatherCodeDescriptions: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail'
}

// Weather code emoji mappings
export const weatherCodeEmojis: Record<number, string> = {
  0: '☀️',
  1: '🌤️',
  2: '⛅',
  3: '☁️',
  45: '🌫️',
  48: '🌫️',
  51: '🌦️',
  53: '🌦️',
  55: '🌧️',
  56: '🌧️',
  57: '🌧️',
  61: '🌧️',
  63: '🌧️',
  65: '⛈️',
  66: '🌧️',
  67: '⛈️',
  71: '🌨️',
  73: '❄️',
  75: '❄️',
  77: '🌨️',
  80: '🌦️',
  81: '🌧️',
  82: '⛈️',
  85: '🌨️',
  86: '❄️',
  95: '⛈️',
  96: '⛈️',
  99: '⛈️'
}

export function getWeatherDescription(code: number): string {
  return weatherCodeDescriptions[code] || 'Unknown'
}

export function getWeatherEmoji(code: number): string {
  return weatherCodeEmojis[code] || '🌡️'
}

export function formatTemperature(temp: number, unit: 'celsius' | 'fahrenheit' = 'celsius'): string {
  const symbol = unit === 'fahrenheit' ? '°F' : '°C'
  return `${Math.round(temp)}${symbol}`
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
}

export function formatFullDate(date: Date): string {
  return date.toLocaleDateString([], { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${minutes}m`
}

export function formatWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

export function formatWindSpeed(speed: number, unit: 'kmh' | 'mph' | 'ms' = 'kmh'): string {
  const unitSymbol = unit === 'mph' ? 'mph' : unit === 'ms' ? 'm/s' : 'km/h'
  return `${Math.round(speed)} ${unitSymbol}`
}

export function formatPrecipitation(amount: number, unit: 'mm' | 'inch' = 'mm'): string {
  const unitSymbol = unit === 'inch' ? 'in' : 'mm'
  return `${amount.toFixed(1)} ${unitSymbol}`
}

export function formatPressure(pressure: number): string {
  return `${Math.round(pressure)} hPa`
}

export function getUVIndexLevel(uvIndex: number): { level: string; color: string } {
  if (uvIndex <= 2) return { level: 'Low', color: '#22c55e' }
  if (uvIndex <= 5) return { level: 'Moderate', color: '#eab308' }
  if (uvIndex <= 7) return { level: 'High', color: '#f97316' }
  if (uvIndex <= 10) return { level: 'Very High', color: '#ef4444' }
  return { level: 'Extreme', color: '#8b5cf6' }
}

export function getPrecipitationProbabilityLevel(probability: number): { level: string; color: string } {
  if (probability <= 20) return { level: 'Low', color: '#22c55e' }
  if (probability <= 50) return { level: 'Moderate', color: '#eab308' }
  if (probability <= 80) return { level: 'High', color: '#f97316' }
  return { level: 'Very High', color: '#ef4444' }
}

// Single day weather data interface
export interface DayWeatherData {
  date: Date
  weatherCode: number
  temperatureMax: number
  temperatureMin: number
  apparentTemperatureMax: number
  apparentTemperatureMin: number
  sunrise: Date
  sunset: Date
  daylightDuration: number
  sunshineDuration: number
  uvIndexMax: number
  precipitationSum: number
  rainSum: number
  showersSum: number
  snowfallSum: number
  precipitationHours: number
  precipitationProbabilityMax: number
  windSpeedMax: number
  windGustsMax: number
  windDirection: number
}

// Extract single day data from daily weather response
export function extractDayData(dailyData: any, dayIndex: number): DayWeatherData {
  return {
    date: new Date(dailyData.time[dayIndex]),
    weatherCode: dailyData.weatherCode[dayIndex],
    temperatureMax: dailyData.temperature2mMax[dayIndex],
    temperatureMin: dailyData.temperature2mMin[dayIndex],
    apparentTemperatureMax: dailyData.apparentTemperatureMax[dayIndex],
    apparentTemperatureMin: dailyData.apparentTemperatureMin[dayIndex],
    sunrise: new Date(dailyData.sunrise[dayIndex]),
    sunset: new Date(dailyData.sunset[dayIndex]),
    daylightDuration: dailyData.daylightDuration[dayIndex],
    sunshineDuration: dailyData.sunshineDuration[dayIndex],
    uvIndexMax: dailyData.uvIndexMax[dayIndex],
    precipitationSum: dailyData.precipitationSum[dayIndex],
    rainSum: dailyData.rainSum[dayIndex],
    showersSum: dailyData.showersSum[dayIndex],
    snowfallSum: dailyData.snowfallSum[dayIndex],
    precipitationHours: dailyData.precipitationHours[dayIndex],
    precipitationProbabilityMax: dailyData.precipitationProbabilityMax[dayIndex],
    windSpeedMax: dailyData.windSpeed10mMax[dayIndex],
    windGustsMax: dailyData.windGusts10mMax[dayIndex],
    windDirection: dailyData.windDirection10mDominant[dayIndex]
  }
} 