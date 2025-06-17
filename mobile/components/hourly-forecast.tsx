import React from 'react'
import { View, ScrollView } from 'react-native'
import { Droplets } from 'lucide-react-native'
import { Card } from './ui/card'
import { Text } from './ui/text'
import { H2, Muted } from './ui/typography'
import { useSettingsStore } from '~/lib/settings-store'
import { useCurrentLocationHourlyWeather } from '~/lib/useWeatherData'
import {
  formatTemperature,
  formatTime,
  getWeatherEmoji,
  formatWindSpeed,
  formatPressure,
  getUVIndexLevel
} from '~/lib/weather-utils'

interface HourlyForecastProps {
  dayIndex?: number
  hoursToShow?: number
  title?: string
}

export function HourlyForecast({ dayIndex = 0, hoursToShow = 24, title = 'Hourly Forecast' }: HourlyForecastProps) {
  const { temperatureUnit, windSpeedUnit } = useSettingsStore()
  
  const { data: hourlyData, loading } = useCurrentLocationHourlyWeather({
    forecastDays: Math.max(dayIndex + 1, 3), // Ensure we get enough days
    enabled: true
  })

  if (loading || !hourlyData?.hourly) {
    return (
      <Card className="p-4">
        <H2 className="mb-3">{title}</H2>
        <Muted>Loading hourly data...</Muted>
      </Card>
    )
  }

  // Filter hourly data for the specific day
  const targetDate = new Date()
  targetDate.setDate(targetDate.getDate() + dayIndex)
  const targetDateString = targetDate.toDateString()

  const dayHourlyData = hourlyData.hourly.time
    .map((time, index) => ({
      time: new Date(time),
      temperature: hourlyData.hourly.temperature2m[index],
      weatherCode: hourlyData.hourly.weatherCode[index],
      precipitation: hourlyData.hourly.precipitation[index],
      precipitationProbability: hourlyData.hourly.precipitationProbability[index],
      windSpeed: hourlyData.hourly.windSpeed10m[index],
      uvIndex: hourlyData.hourly.uvIndex[index],
      humidity: hourlyData.hourly.relativeHumidity2m[index],
      pressure: hourlyData.hourly.pressureMsl[index],
      cloudCover: hourlyData.hourly.cloudCover[index],
      visibility: hourlyData.hourly.visibility[index]
    }))
    .filter(item => item.time.toDateString() === targetDateString)
    .slice(0, hoursToShow)

  if (dayHourlyData.length === 0) {
    return (
      <Card className="p-4">
        <H2 className="mb-3">{title}</H2>
        <Muted>No hourly data available for this day</Muted>
      </Card>
    )
  }

  return (
    <View className="space-y-3">
      <H2>{title}</H2>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-3">
        <View className="flex-row space-x-3 px-1">
          {dayHourlyData.map((hour, index) => {
            const uvLevel = getUVIndexLevel(hour.uvIndex)
            
            return (
              <Card key={index} className="w-24 p-3 items-center space-y-2">
                <Muted className="text-xs">{formatTime(hour.time)}</Muted>
                <Text className="text-lg">{getWeatherEmoji(hour.weatherCode)}</Text>
                <Text className="font-bold text-sm">
                  {formatTemperature(hour.temperature, temperatureUnit)}
                </Text>
                
                {/* Precipitation */}
                {hour.precipitationProbability > 20 && (
                  <View className="items-center">
                    <Droplets size={12} color="#3b82f6" />
                    <Muted className="text-xs">{Math.round(hour.precipitationProbability)}%</Muted>
                  </View>
                )}
                
                {/* Wind */}
                {hour.windSpeed > 10 && (
                  <Muted className="text-xs text-center">
                    {formatWindSpeed(hour.windSpeed, windSpeedUnit)}
                  </Muted>
                )}
                
                {/* UV Index */}
                {hour.uvIndex > 3 && (
                  <View className="items-center">
                    <Text className="text-xs font-bold" style={{ color: uvLevel.color }}>
                      UV {Math.round(hour.uvIndex)}
                    </Text>
                  </View>
                )}
                
                {/* Additional details for expanded view */}
                {hoursToShow <= 12 && (
                  <View className="items-center space-y-1">
                    <Muted className="text-xs">{Math.round(hour.humidity)}% RH</Muted>
                    <Muted className="text-xs">{formatPressure(hour.pressure)}</Muted>
                    <Muted className="text-xs">{Math.round(hour.cloudCover)}% ☁️</Muted>
                  </View>
                )}
              </Card>
            )
          })}
        </View>
      </ScrollView>
    </View>
  )
} 