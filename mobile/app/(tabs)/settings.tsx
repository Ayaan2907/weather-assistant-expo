import { View, Text, ScrollView } from 'react-native'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useSettingsStore } from '@/lib/settings-store'
import { 
  SettingsSection, 
  SettingsSwitch, 
  SettingsSelector, 
  SettingsRow 
} from '@/components/SettingsComponents'

export default function SettingsScreen() {
  const {
    temperatureUnit,
    setTemperatureUnit,
    windSpeedUnit,
    setWindSpeedUnit,
    precipitationUnit,
    setPrecipitationUnit,
    notificationsEnabled,
    setNotificationsEnabled,
    useCurrentLocation,
    setUseCurrentLocation,
    weatherAlertsEnabled,
    setWeatherAlertsEnabled,
    autoRefresh,
    setAutoRefresh,
    refreshInterval,
    setRefreshInterval,
  } = useSettingsStore()

  const temperatureOptions = [
    { label: 'Celsius (°C)', value: 'celsius' },
    { label: 'Fahrenheit (°F)', value: 'fahrenheit' },
  ]

  const windSpeedOptions = [
    { label: 'km/h', value: 'kmh' },
    { label: 'mph', value: 'mph' },
    { label: 'm/s', value: 'ms' },
  ]

  const precipitationOptions = [
    { label: 'Millimeters (mm)', value: 'mm' },
    { label: 'Inches (in)', value: 'inch' },
  ]

  const refreshIntervalOptions = [
    { label: '15 minutes', value: '15' },
    { label: '30 minutes', value: '30' },
    { label: '1 hour', value: '60' },
    { label: '2 hours', value: '120' },
  ]

  return (
    <ScrollView className="flex-1 bg-gray-100 dark:bg-gray-900">
      <View className="p-5">
        <Text className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
          Settings
        </Text>
        
        {/* Units Section */}
        <SettingsSection title="Units">
          <SettingsSelector
            title="Temperature"
            subtitle="Choose your preferred temperature unit"
            icon="thermometer"
            value={temperatureUnit}
            options={temperatureOptions}
            onValueChange={(value) => setTemperatureUnit(value as any)}
          />
          
          <SettingsSelector
            title="Wind Speed"
            subtitle="Choose your preferred wind speed unit"
            icon="speedometer"
            value={windSpeedUnit}
            options={windSpeedOptions}
            onValueChange={(value) => setWindSpeedUnit(value as any)}
          />
          
          <SettingsSelector
            title="Precipitation"
            subtitle="Choose your preferred precipitation unit"
            icon="water"
            value={precipitationUnit}
            options={precipitationOptions}
            onValueChange={(value) => setPrecipitationUnit(value as any)}
          />
        </SettingsSection>

        {/* Appearance Section */}
        <SettingsSection title="Appearance">
          <SettingsRow
            title="Theme"
            subtitle="Choose your preferred app theme"
            icon="color-palette"
          >
            <ThemeToggle />
          </SettingsRow>
        </SettingsSection>

        {/* Location & Data Section */}
        <SettingsSection title="Location & Data">
          <SettingsSwitch
            title="Use Current Location"
            subtitle="Automatically detect your location for weather data"
            icon="location"
            value={useCurrentLocation}
            onValueChange={setUseCurrentLocation}
          />
          
          <SettingsSwitch
            title="Auto Refresh"
            subtitle="Automatically update weather data"
            icon="refresh"
            value={autoRefresh}
            onValueChange={setAutoRefresh}
          />
          
          {autoRefresh && (
            <SettingsSelector
              title="Refresh Interval"
              subtitle="How often to update weather data"
              icon="time"
              value={refreshInterval.toString()}
              options={refreshIntervalOptions}
              onValueChange={(value) => setRefreshInterval(parseInt(value))}
            />
          )}
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection title="Notifications">
          <SettingsSwitch
            title="Push Notifications"
            subtitle="Receive weather updates and alerts"
            icon="notifications"
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
          
          <SettingsSwitch
            title="Weather Alerts"
            subtitle="Get notified about severe weather conditions"
            icon="warning"
            value={weatherAlertsEnabled}
            onValueChange={setWeatherAlertsEnabled}
          />
        </SettingsSection>

        {/* About Section */}
        <SettingsSection title="About">
          <SettingsRow
            title="Version"
            subtitle="1.0.0"
            icon="information-circle"
          />
          
          <SettingsRow
            title="Built with"
            subtitle="Expo Router, NativeWind & Zustand"
            icon="code"
          />
        </SettingsSection>
      </View>
    </ScrollView>
  )
} 