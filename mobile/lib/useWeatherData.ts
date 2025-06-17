import { useState, useEffect, useCallback, useMemo } from 'react';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import { useSettingsStore } from './settings-store';
import type {
  CurrentWeatherResponse,
  HourlyWeatherResponse,
  DailyWeatherResponse,
  WeatherApiParams,
} from './types/weather';

const WEATHER_API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000';

// Global cache for hourly weather data (for notifications)
let hourlyWeatherCache: {
  data: HourlyWeatherResponse | null;
  timestamp: number;
  coordinates: { lat: number; lon: number };
} | null = null;

// Cache duration: 30 minutes
const CACHE_DURATION = 30 * 60 * 1000;

// Function to get cached hourly data for notifications
export function getCachedHourlyWeatherForNotifications(): HourlyWeatherResponse | null {
  if (!hourlyWeatherCache) return null;
  
  const now = Date.now();
  const isExpired = now - hourlyWeatherCache.timestamp > CACHE_DURATION;
  
  if (isExpired) {
    hourlyWeatherCache = null;
    return null;
  }
  
  return hourlyWeatherCache.data;
}

// Function to set cached hourly data
function setCachedHourlyWeather(data: HourlyWeatherResponse, coordinates: { lat: number; lon: number }) {
  hourlyWeatherCache = {
    data,
    timestamp: Date.now(),
    coordinates
  };
}

// Function to check if coordinates have changed significantly (for cache invalidation)
function coordinatesChanged(oldCoords: { lat: number; lon: number }, newCoords: { lat: number; lon: number }): boolean {
  const threshold = 0.01; // ~1km
  return Math.abs(oldCoords.lat - newCoords.lat) > threshold || 
         Math.abs(oldCoords.lon - newCoords.lon) > threshold;
}

export function useLocation() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [isUsingLastKnown, setIsUsingLastKnown] = useState(false);
  const [cityName, setCityName] = useState<string | null>(null);
  const [cityLoading, setCityLoading] = useState(false);
  const { useCurrentLocation, lastKnownLocation, setLastKnownLocation } = useSettingsStore();

  // Function to get city name from coordinates
  const getCityName = useCallback(async (lat: number, lon: number) => {
    setCityLoading(true);
    try {
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lon,
      });

      if (reverseGeocode && reverseGeocode.length > 0) {
        const location = reverseGeocode[0];
        // Build city name from available data
        const parts = [];
        if (location.city) parts.push(location.city);
        else if (location.district) parts.push(location.district);
        else if (location.subregion) parts.push(location.subregion);

        if (location.region && parts.length > 0) {
          parts.push(location.region);
        } else if (location.region) {
          parts.push(location.region);
        }

        if (location.country && parts.length > 0) {
          parts.push(location.country);
        }

        const cityString = parts.join(', ') || 'Unknown location';
        setCityName(cityString);
      } else {
        setCityName('Unknown location');
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      setCityName(null);
    } finally {
      setCityLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!useCurrentLocation) {
      setLocation(null);
      setIsUsingLastKnown(false);
      setLocationError(null);
      setCityName(null);
      return;
    }

    const getCurrentLocation = async () => {
      setLocationLoading(true);
      setLocationError(null);

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Location permission denied');
          // Fall back to last known location if available
          if (lastKnownLocation) {
            setLocation({
              lat: lastKnownLocation.lat,
              lon: lastKnownLocation.lon,
            });
            setIsUsingLastKnown(true);
            // Get city name for last known location
            getCityName(lastKnownLocation.lat, lastKnownLocation.lon);
          }
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const newLocation = {
          lat: currentLocation.coords.latitude,
          lon: currentLocation.coords.longitude,
        };

        setLocation(newLocation);
        setIsUsingLastKnown(false);

        // Get city name for current location
        getCityName(newLocation.lat, newLocation.lon);

        setLastKnownLocation({
          lat: newLocation.lat,
          lon: newLocation.lon,
          timestamp: Date.now(),
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to get location';
        setLocationError(errorMessage);
        console.error('Location Error:', err);

        // Fall back to last known location if available
        if (lastKnownLocation) {
          setLocation({
            lat: lastKnownLocation.lat,
            lon: lastKnownLocation.lon,
          });
          setIsUsingLastKnown(true);
          setLocationError(`${errorMessage}. Using last known location.`);
          // Get city name for last known location
          getCityName(lastKnownLocation.lat, lastKnownLocation.lon);
        }
      } finally {
        setLocationLoading(false);
      }
    };

    getCurrentLocation();
  }, [useCurrentLocation, getCityName]);

  // Update last known location with city name when it's resolved
  useEffect(() => {
    if (cityName && location && !isUsingLastKnown) {
      setLastKnownLocation({
        lat: location.lat,
        lon: location.lon,
        timestamp: Date.now(),
        cityName: cityName,
      });
    }
  }, [cityName, location, isUsingLastKnown, setLastKnownLocation]);

  return {
    location,
    locationError,
    locationLoading,
    isUsingLastKnown,
    lastKnownLocation,
    cityName,
    cityLoading,
  };
}

// Base hook for API calls with error handling and loading states
function useWeatherApi<T>(endpoint: string, params: WeatherApiParams, enabled: boolean = true) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled || !params.lat || !params.lon || params.lat === 0 || params.lon === 0) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams({
        lat: params.lat.toString(),
        lon: params.lon.toString(),
        ...(params.temperatureUnit && { temperatureUnit: params.temperatureUnit }),
        ...(params.windSpeedUnit && { windSpeedUnit: params.windSpeedUnit }),
        ...(params.precipitationUnit && { precipitationUnit: params.precipitationUnit }),
        ...(params.forecastDays && { forecastDays: params.forecastDays.toString() }),
      });

      const response = await fetch(
        `${WEATHER_API_BASE_URL}/api/weather/${endpoint}?${searchParams}`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
      }

      const weatherData: T = await response.json();
      setData(weatherData);
      setLastUpdated(new Date());

      // Cache hourly data for notifications
      if (endpoint === 'hourly' && weatherData) {
        setCachedHourlyWeather(weatherData as unknown as HourlyWeatherResponse, {
          lat: params.lat,
          lon: params.lon
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : `Failed to fetch ${endpoint} weather`;
      setError(errorMessage);
      console.error(`${endpoint} Weather API Error:`, err);
    } finally {
      setLoading(false);
    }
  }, [
    endpoint,
    params.lat,
    params.lon,
    params.temperatureUnit,
    params.windSpeedUnit,
    params.precipitationUnit,
    params.forecastDays,
    enabled,
  ]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    lastUpdated,
    fetchData,
  };
}

// Hook for current weather (lightweight, frequent updates)
export function useCurrentWeather(
  coordinates: { lat: number; lon: number },
  options: { enableAutoRefresh?: boolean } = {}
) {
  const { temperatureUnit, windSpeedUnit, precipitationUnit, autoRefresh, refreshInterval } =
    useSettingsStore();

  // Check if coordinates are valid
  const hasValidCoordinates = coordinates.lat !== 0 && coordinates.lon !== 0;

  const params = useMemo(
    () => ({
      lat: coordinates.lat,
      lon: coordinates.lon,
      temperatureUnit,
      windSpeedUnit,
      precipitationUnit,
    }),
    [coordinates.lat, coordinates.lon, temperatureUnit, windSpeedUnit, precipitationUnit]
  );

  const { data, loading, error, refetch, lastUpdated, fetchData } =
    useWeatherApi<CurrentWeatherResponse>('current', params, hasValidCoordinates);

  // Initial fetch
  useEffect(() => {
    if (hasValidCoordinates) {
      fetchData();
    }
  }, [fetchData, hasValidCoordinates]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh || !options.enableAutoRefresh || !hasValidCoordinates) {
      return;
    }

    const intervalMs = refreshInterval * 60 * 1000;
    const interval = setInterval(fetchData, intervalMs);

    return () => clearInterval(interval);
  }, [autoRefresh, options.enableAutoRefresh, refreshInterval, fetchData, hasValidCoordinates]);

  return {
    data,
    loading,
    error,
    refetch,
    lastUpdated,
  };
}

// Hook for hourly weather (on-demand, when hourly tab is viewed)
export function useHourlyWeather(
  coordinates: { lat: number; lon: number },
  options: { forecastDays?: number; enabled?: boolean; enableCaching?: boolean } = {}
) {
  const { temperatureUnit, windSpeedUnit, precipitationUnit } = useSettingsStore();

  const params = useMemo(
    () => ({
      lat: coordinates.lat,
      lon: coordinates.lon,
      temperatureUnit,
      windSpeedUnit,
      precipitationUnit,
      forecastDays: options.forecastDays || 3,
    }),
    [
      coordinates.lat,
      coordinates.lon,
      temperatureUnit,
      windSpeedUnit,
      precipitationUnit,
      options.forecastDays,
    ]
  );

  const { data, loading, error, refetch, lastUpdated, fetchData } =
    useWeatherApi<HourlyWeatherResponse>('hourly', params, options.enabled);

  // Check cache first if caching is enabled
  useEffect(() => {
    if (options.enabled && options.enableCaching) {
      const cachedData = getCachedHourlyWeatherForNotifications();
      if (cachedData && hourlyWeatherCache) {
        // Check if coordinates are similar
        if (!coordinatesChanged(hourlyWeatherCache.coordinates, coordinates)) {
          // Use cached data but still fetch fresh data in background
          fetchData();
          return;
        }
      }
      fetchData();
    } else if (options.enabled) {
      fetchData();
    }
  }, [fetchData, options.enabled, options.enableCaching, coordinates.lat, coordinates.lon]);

  return {
    data,
    loading,
    error,
    refetch,
    lastUpdated,
  };
}

// Hook for daily weather (on-demand, when forecast tab is viewed)
export function useDailyWeather(
  coordinates: { lat: number; lon: number },
  options: { forecastDays?: number; enabled?: boolean } = {}
) {
  const { temperatureUnit, windSpeedUnit, precipitationUnit } = useSettingsStore();

  const params = useMemo(
    () => ({
      lat: coordinates.lat,
      lon: coordinates.lon,
      temperatureUnit,
      windSpeedUnit,
      precipitationUnit,
      forecastDays: options.forecastDays || 7,
    }),
    [
      coordinates.lat,
      coordinates.lon,
      temperatureUnit,
      windSpeedUnit,
      precipitationUnit,
      options.forecastDays,
    ]
  );

  const { data, loading, error, refetch, lastUpdated, fetchData } =
    useWeatherApi<DailyWeatherResponse>('daily', params, options.enabled);

  // Fetch when enabled
  useEffect(() => {
    if (options.enabled) {
      fetchData();
    }
  }, [fetchData, options.enabled]);

  return {
    data,
    loading,
    error,
    refetch,
    lastUpdated,
  };
}

// Hook for getting current location weather with fallback to last known location
export function useCurrentLocationWeather(options: { enableAutoRefresh?: boolean } = {}) {
  const locationData = useLocation();

  // Always call useCurrentWeather - it will handle invalid coordinates internally
  const weatherData = useCurrentWeather(locationData.location || { lat: 0, lon: 0 }, options);

  return {
    ...weatherData,
    ...locationData,
  };
}

// Hook for getting current location daily weather with fallback to last known location
export function useCurrentLocationDailyWeather(
  options: { forecastDays?: number; enabled?: boolean } = {}
) {
  const locationData = useLocation();

  // Always call useDailyWeather - it will handle invalid coordinates internally
  const weatherData = useDailyWeather(locationData.location || { lat: 0, lon: 0 }, options);

  return {
    ...weatherData,
    ...locationData,
  };
}

// Hook for getting current location hourly weather with fallback to last known location
export function useCurrentLocationHourlyWeather(
  options: { forecastDays?: number; enabled?: boolean; enableCaching?: boolean } = {}
) {
  const locationData = useLocation()

  // Always call useHourlyWeather - it will handle invalid coordinates internally
  const weatherData = useHourlyWeather(locationData.location || { lat: 0, lon: 0 }, {
    ...options,
    enableCaching: options.enableCaching ?? true // Enable caching by default for notifications
  })

  return {
    ...weatherData,
    ...locationData,
  }
}

// Utility hook for demo/testing with fixed coordinates
export function useDemoCurrentWeather(options: { enableAutoRefresh?: boolean } = {}) {
  const coordinates = useMemo(
    () => ({
      lat: 40.7128,
      lon: -74.006,
    }),
    []
  );

  return useCurrentWeather(coordinates, {
    enableAutoRefresh: false,
    ...options,
  });
}

// Utility hook for demo daily weather
export function useDemoDailyWeather(options: { forecastDays?: number; enabled?: boolean } = {}) {
  const coordinates = useMemo(
    () => ({
      lat: 40.7128,
      lon: -74.006,
    }),
    []
  );

  return useDailyWeather(coordinates, {
    forecastDays: 7,
    enabled: true,
    ...options,
  });
}

// Utility hook for demo hourly weather
export function useDemoHourlyWeather(options: { forecastDays?: number; enabled?: boolean } = {}) {
  const coordinates = useMemo(
    () => ({
      lat: 40.7128,
      lon: -74.006,
    }),
    []
  );

  return useHourlyWeather(coordinates, {
    forecastDays: 3,
    enabled: true,
    ...options,
  });
}
