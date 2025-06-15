import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type TemperatureUnit = 'celsius' | 'fahrenheit'
export type WindSpeedUnit = 'kmh' | 'mph' | 'ms'
export type PrecipitationUnit = 'mm' | 'inch'

interface SettingsState {
  // Temperature settings
  temperatureUnit: TemperatureUnit
  setTemperatureUnit: (unit: TemperatureUnit) => void
  
  // Wind speed settings
  windSpeedUnit: WindSpeedUnit
  setWindSpeedUnit: (unit: WindSpeedUnit) => void
  
  // Precipitation settings
  precipitationUnit: PrecipitationUnit
  setPrecipitationUnit: (unit: PrecipitationUnit) => void
  
  // Notification settings
  notificationsEnabled: boolean
  setNotificationsEnabled: (enabled: boolean) => void
  
  // Location settings
  useCurrentLocation: boolean
  setUseCurrentLocation: (enabled: boolean) => void
  
  // Weather alerts
  weatherAlertsEnabled: boolean
  setWeatherAlertsEnabled: (enabled: boolean) => void
  
  // App preferences
  autoRefresh: boolean
  setAutoRefresh: (enabled: boolean) => void
  
  refreshInterval: number // in minutes
  setRefreshInterval: (interval: number) => void
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
      
      // Actions
      setTemperatureUnit: (unit) => set({ temperatureUnit: unit }),
      setWindSpeedUnit: (unit) => set({ windSpeedUnit: unit }),
      setPrecipitationUnit: (unit) => set({ precipitationUnit: unit }),
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      setUseCurrentLocation: (enabled) => set({ useCurrentLocation: enabled }),
      setWeatherAlertsEnabled: (enabled) => set({ weatherAlertsEnabled: enabled }),
      setAutoRefresh: (enabled) => set({ autoRefresh: enabled }),
      setRefreshInterval: (interval) => set({ refreshInterval: interval }),
    }),
    {
      name: 'weather-app-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
) 