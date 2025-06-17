import React from 'react'
import { View, Pressable } from 'react-native'
import { ChevronRight } from 'lucide-react-native'

import { Text } from '~/components/ui/text'
import { Large, Muted } from '~/components/ui/typography'
import { useSettingsStore } from '~/lib/settings-store'
import { 
  formatDate, 
  formatTemperature, 
  getWeatherDescription, 
  getWeatherEmoji 
} from '~/lib/weather-utils'

interface ForecastDayItemProps {
  date: Date
  weatherCode: number
  temperatureMax: number
  temperatureMin: number
  dayIndex: number
  onPress: () => void
}

export function ForecastDayItem({
  date,
  weatherCode,
  temperatureMax,
  temperatureMin,
  dayIndex,
  onPress
}: ForecastDayItemProps) {
  const { temperatureUnit } = useSettingsStore()

  const isToday = new Date().toDateString() === date.toDateString()

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between rounded-lg bg-card p-4 active:bg-muted/50">
      <View className="flex-1">
        <View className="flex-row items-center space-x-2">
          <Text className="text-2xl">{getWeatherEmoji(weatherCode)}</Text>
          <View>
            <Large className="text-card-foreground">
              {isToday ? 'Today' : formatDate(date)}
            </Large>
            <Muted>{getWeatherDescription(weatherCode)}</Muted>
          </View>
        </View>
      </View>

      <View className="flex-row items-center space-x-4">
        <View className="items-center">
          <Muted>High</Muted>
          <Text className="text-lg font-bold text-primary">
            {formatTemperature(temperatureMax, temperatureUnit)}
          </Text>
        </View>

        <View className="items-center">
          <Muted>Low</Muted>
          <Text className="text-lg font-medium text-muted-foreground">
            {formatTemperature(temperatureMin, temperatureUnit)}
          </Text>
        </View>

        <ChevronRight size={20} color="hsl(240 3.8% 46.1%)" />
      </View>
    </Pressable>
  )
} 