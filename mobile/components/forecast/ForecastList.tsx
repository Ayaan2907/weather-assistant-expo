import React from 'react'
import { View } from 'react-native'

import { ForecastDayItem } from './ForecastDayItem'
import { WeatherDaily } from '~/lib/types/weather'

interface ForecastListProps {
  dailyData: WeatherDaily
  onDaySelect: (dayIndex: number) => void
}

export function ForecastList({ dailyData, onDaySelect }: ForecastListProps) {
  if (!dailyData || !dailyData.time.length) {
    return null
  }

  return (
    <View className="space-y-3">
      {dailyData.time.map((date: any, index: number) => (
        <ForecastDayItem
          key={index}
          date={new Date(date)}
          weatherCode={dailyData.weatherCode[index]}
          temperatureMax={dailyData.temperature2mMax[index]}
          temperatureMin={dailyData.temperature2mMin[index]}
          dayIndex={index}
          onPress={() => onDaySelect(index)}
        />
      ))}
    </View>
  )
} 