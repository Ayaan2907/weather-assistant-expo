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

interface NotificationSettings {
  enabled: boolean;
  weatherAlerts: boolean;
  dailyForecast: boolean;
  rainAlerts: boolean;
  temperatureExtremes: boolean;
  notificationTime: string;
  alertSound: string;
}

interface SettingsState {
  // Core settings
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
  precipitationUnit: PrecipitationUnit;
  useCurrentLocation: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  lastKnownLocation: LastKnownLocation | null;

  // Notifications
  notifications: NotificationSettings;

  // Hydration & persistence
  isHydrated: boolean;
  lastSaved: number;

  // Actions
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setWindSpeedUnit: (unit: WindSpeedUnit) => void;
  setPrecipitationUnit: (unit: PrecipitationUnit) => void;
  setUseCurrentLocation: (enabled: boolean) => void;
  setAutoRefresh: (enabled: boolean) => void;
  setRefreshInterval: (interval: number) => void;
  setLastKnownLocation: (location: LastKnownLocation) => void;
  clearLastKnownLocation: () => void;
  setNotifications: (notifications: Partial<NotificationSettings>) => void;
  setHydrated: (hydrated: boolean) => void;
  resetToDefaults: () => void;
  saveSettings: () => Promise<void>;
}

const defaultNotifications: NotificationSettings = {
  enabled: true,
  weatherAlerts: true,
  dailyForecast: true,
  rainAlerts: false,
  temperatureExtremes: true,
  notificationTime: '08:00',
  alertSound: 'default',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Default values
      temperatureUnit: 'celsius',
      windSpeedUnit: 'kmh',
      precipitationUnit: 'mm',
      useCurrentLocation: true,
      autoRefresh: true,
      refreshInterval: 30,
      lastKnownLocation: null,
      notifications: defaultNotifications,
      isHydrated: false,
      lastSaved: Date.now(),

      // Actions
      setTemperatureUnit: (unit) => {
        set({ temperatureUnit: unit, lastSaved: Date.now() });
        get().saveSettings();
      },
      setWindSpeedUnit: (unit) => {
        set({ windSpeedUnit: unit, lastSaved: Date.now() });
        get().saveSettings();
      },
      setPrecipitationUnit: (unit) => {
        set({ precipitationUnit: unit, lastSaved: Date.now() });
        get().saveSettings();
      },
      setUseCurrentLocation: (enabled) => {
        set({ useCurrentLocation: enabled, lastSaved: Date.now() });
        get().saveSettings();
      },
      setAutoRefresh: (enabled) => {
        set({ autoRefresh: enabled, lastSaved: Date.now() });
        get().saveSettings();
      },
      setRefreshInterval: (interval) => {
        set({ refreshInterval: interval, lastSaved: Date.now() });
        get().saveSettings();
      },
      setLastKnownLocation: (location) => {
        set({ lastKnownLocation: location, lastSaved: Date.now() });
        get().saveSettings();
      },
      clearLastKnownLocation: () => {
        set({ lastKnownLocation: null, lastSaved: Date.now() });
        get().saveSettings();
      },
      setNotifications: (newNotifications) => {
        set((state) => ({
          notifications: { ...state.notifications, ...newNotifications },
          lastSaved: Date.now(),
        }));
        get().saveSettings();
      },
      resetToDefaults: () => {
        set({
          temperatureUnit: 'celsius',
          windSpeedUnit: 'kmh',
          precipitationUnit: 'mm',
          useCurrentLocation: true,
          autoRefresh: true,
          refreshInterval: 30,
          lastKnownLocation: null,
          notifications: defaultNotifications,
          lastSaved: Date.now(),
        });
        get().saveSettings();
      },
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
      saveSettings: async () => {
        try {
          const state = get();
          await AsyncStorage.setItem('weather-app-settings', JSON.stringify({ state, version: 1 }));
        } catch (error) {
          console.error('Failed to save settings:', error);
        }
      },
    }),
    {
      name: 'weather-app-settings',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      version: 1,
    }
  )
);
