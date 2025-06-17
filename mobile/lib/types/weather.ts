// Current Weather Types
export interface WeatherCurrent {
  time: Date;
  temperature2m: number;
  relativeHumidity2m: number;
  apparentTemperature: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weatherCode: number;
  cloudCover: number;
  pressureMsl: number;
  windSpeed10m: number;
  windDirection10m: number;
  windGusts10m: number;
}

export interface CurrentWeatherResponse {
  utcOffsetSeconds: number;
  timezone: string;
  timezoneAbbreviation: string;
  latitude: number;
  longitude: number;
  current: WeatherCurrent;
}

// Hourly Weather Types
export interface WeatherHourly {
  time: Date[];
  temperature2m: number[];
  relativeHumidity2m: number[];
  apparentTemperature: number[];
  precipitationProbability: number[];
  precipitation: number[];
  rain: number[];
  showers: number[];
  snowfall: number[];
  snowDepth: number[];
  weatherCode: number[];
  pressureMsl: number[];
  cloudCover: number[];
  visibility: number[];
  windSpeed10m: number[];
  windDirection10m: number[];
  windGusts10m: number[];
  uvIndex: number[];
}

export interface HourlyWeatherResponse {
  utcOffsetSeconds: number;
  timezone: string;
  timezoneAbbreviation: string;
  latitude: number;
  longitude: number;
  hourly: WeatherHourly;
}

// Daily Weather Types
export interface WeatherDaily {
  time: Date[];
  weatherCode: number[];
  temperature2mMax: number[];
  temperature2mMin: number[];
  apparentTemperatureMax: number[];
  apparentTemperatureMin: number[];
  sunrise: Date[];
  sunset: Date[];
  daylightDuration: number[];
  sunshineDuration: number[];
  uvIndexMax: number[];
  precipitationSum: number[];
  rainSum: number[];
  showersSum: number[];
  snowfallSum: number[];
  precipitationHours: number[];
  precipitationProbabilityMax: number[];
  windSpeed10mMax: number[];
  windGusts10mMax: number[];
  windDirection10mDominant: number[];
}

export interface DailyWeatherResponse {
  utcOffsetSeconds: number;
  timezone: string;
  timezoneAbbreviation: string;
  latitude: number;
  longitude: number;
  daily: WeatherDaily;
}

// Common API Parameters
export interface WeatherApiParams {
  lat: number;
  lon: number;
  temperatureUnit?: 'celsius' | 'fahrenheit';
  windSpeedUnit?: 'kmh' | 'mph' | 'ms';
  precipitationUnit?: 'mm' | 'inch';
  forecastDays?: number;
}

// Legacy types for backward compatibility (deprecated)
export interface WeatherMinutely15 {
  time: Date[];
  rain: number[];
  snowfall: number[];
  temperature2m: number[];
  windGusts10m: number[];
}

export interface WeatherData {
  current: WeatherCurrent;
  minutely15?: WeatherMinutely15;
  hourly?: WeatherHourly;
  daily?: WeatherDaily;
}

export interface WeatherApiResponse {
  utcOffsetSeconds: number;
  timezone: string;
  timezoneAbbreviation: string;
  latitude: number;
  longitude: number;
  weatherData: WeatherData;
}
