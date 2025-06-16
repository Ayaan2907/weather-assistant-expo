import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'mph' | 'ms';
export type PrecipitationUnit = 'mm' | 'inch';

interface LastKnownLocation {
  lat: number;
  lon: number;
  timestamp: number;
  cityName?: string;
}

interface SettingsState {
  // Temperature settings
  temperatureUnit: TemperatureUnit;
  setTemperatureUnit: (unit: TemperatureUnit) => void;

  // Wind speed settings
  windSpeedUnit: WindSpeedUnit;
  setWindSpeedUnit: (unit: WindSpeedUnit) => void;

  // Precipitation settings
  precipitationUnit: PrecipitationUnit;
  setPrecipitationUnit: (unit: PrecipitationUnit) => void;

  // Notification settings
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;

  useCurrentLocation: boolean;
  setUseCurrentLocation: (enabled: boolean) => void;

  weatherAlertsEnabled: boolean;
  setWeatherAlertsEnabled: (enabled: boolean) => void;

  autoRefresh: boolean;
  setAutoRefresh: (enabled: boolean) => void;

  refreshInterval: number; // in minutes
  setRefreshInterval: (interval: number) => void;

  // Last known location
  lastKnownLocation: LastKnownLocation | null;
  setLastKnownLocation: (location: LastKnownLocation) => void;
  clearLastKnownLocation: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Default values
      temperatureUnit: 'celsius',
      windSpeedUnit: 'kmh',
      precipitationUnit: 'mm',
      notificationsEnabled: true,
      useCurrentLocation: true,
      weatherAlertsEnabled: true,
      autoRefresh: true,
      refreshInterval: 30,
      lastKnownLocation: null,

      // Actions
      setTemperatureUnit: (unit) => set({ temperatureUnit: unit }),
      setWindSpeedUnit: (unit) => set({ windSpeedUnit: unit }),
      setPrecipitationUnit: (unit) => set({ precipitationUnit: unit }),
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      setUseCurrentLocation: (enabled) => set({ useCurrentLocation: enabled }),
      setWeatherAlertsEnabled: (enabled) => set({ weatherAlertsEnabled: enabled }),
      setAutoRefresh: (enabled) => set({ autoRefresh: enabled }),
      setRefreshInterval: (interval) => set({ refreshInterval: interval }),
      setLastKnownLocation: (location) => set({ lastKnownLocation: location }),
      clearLastKnownLocation: () => set({ lastKnownLocation: null }),
    }),
    {
      name: 'weather-app-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
