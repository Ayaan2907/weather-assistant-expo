import { View, Text } from 'react-native'
import { SimpleThemeToggle } from '@/components/ThemeToggle'
import { useSettingsStore } from '@/lib/settings-store'
import { formatTemperature } from '@/lib/weather-utils'

export default function HomeScreen() {
  const { temperatureUnit } = useSettingsStore()
  
  // Example temperature data (in Celsius)
  const currentTemp = 22
  const highTemp = 28
  const lowTemp = 16

  return (
    <View className="flex-1 items-center justify-center p-5 bg-gray-100 dark:bg-gray-900">
      <View className="absolute top-12 right-5">
        <SimpleThemeToggle />
      </View>
      
      <Text className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
        Weather App
      </Text>
      <Text className="text-lg mb-5 text-gray-600 dark:text-gray-300">
        Current Weather
      </Text>
      
      {/* Example weather display using settings */}
      <View className="items-center mb-8">
        <Text className="text-6xl font-light text-gray-800 dark:text-white mb-2">
          {formatTemperature(currentTemp, temperatureUnit)}
        </Text>
        <View className="flex-row space-x-4">
          <Text className="text-lg text-gray-600 dark:text-gray-400">
            H: {formatTemperature(highTemp, temperatureUnit)}
          </Text>
          <Text className="text-lg text-gray-600 dark:text-gray-400">
            L: {formatTemperature(lowTemp, temperatureUnit)}
          </Text>
        </View>
      </View>
      
      <Text className="text-base text-center text-gray-500 dark:text-gray-400">
        Temperature unit: {temperatureUnit === 'celsius' ? 'Celsius' : 'Fahrenheit'}
      </Text>
      <Text className="text-sm text-center text-gray-400 dark:text-gray-500 mt-2">
        Change units in Settings tab
      </Text>
    </View>
  )
} 