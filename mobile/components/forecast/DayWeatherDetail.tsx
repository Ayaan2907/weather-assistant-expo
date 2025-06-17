import React from 'react'
import { View, ScrollView, RefreshControl } from 'react-native'
import { 
  Sun, 
  Sunset, 
  Eye, 
  Droplets, 
  Wind, 
  Gauge, 
  Clock,
  Zap,
  TrendingUp
} from 'lucide-react-native'

import { Text } from '~/components/ui/text'
import { H1, H2, Large, Muted } from '~/components/ui/typography'
import { Card } from '~/components/ui/card'
import { WeatherCard } from '~/components/weather-card'
import { HourlyForecast } from '~/components/hourly-forecast'
import { useSettingsStore } from '~/lib/settings-store'
import { 
  DayWeatherData,
  formatFullDate,
  formatTime,
  formatTemperature,
  formatDuration,
  formatWindSpeed,
  formatWindDirection,
  formatPrecipitation,
  getWeatherDescription,
  getWeatherEmoji,
  getUVIndexLevel,
  getPrecipitationProbabilityLevel
} from '~/lib/weather-utils'

interface DayWeatherDetailProps {
  dayData: DayWeatherData
  dayIndex: number
  onRefresh?: () => void
  refreshing?: boolean
}

export function DayWeatherDetail({ dayData, dayIndex, onRefresh, refreshing = false }: DayWeatherDetailProps) {
  const { temperatureUnit, windSpeedUnit, precipitationUnit } = useSettingsStore()
  
  const uvLevel = getUVIndexLevel(dayData.uvIndexMax)
  const precipLevel = getPrecipitationProbabilityLevel(dayData.precipitationProbabilityMax)

  return (
    <ScrollView 
      className="flex-1 bg-background"
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }>
      <View className="p-5 space-y-6">
        {/* Header */}
        <View className="items-center space-y-2">
          <Text className="text-6xl">{getWeatherEmoji(dayData.weatherCode)}</Text>
          <H1 className="text-center">{formatFullDate(dayData.date)}</H1>
          <Large className="text-center text-muted-foreground">
            {getWeatherDescription(dayData.weatherCode)}
          </Large>
        </View>

        {/* Temperature Overview */}
        <Card className="p-6">
          <View className="flex-row justify-around">
            <View className="items-center">
              <Muted>High</Muted>
              <Text className="text-3xl font-bold text-primary">
                {formatTemperature(dayData.temperatureMax, temperatureUnit)}
              </Text>
              <Muted>Feels like {formatTemperature(dayData.apparentTemperatureMax, temperatureUnit)}</Muted>
            </View>
            <View className="items-center">
              <Muted>Low</Muted>
              <Text className="text-3xl font-bold text-muted-foreground">
                {formatTemperature(dayData.temperatureMin, temperatureUnit)}
              </Text>
              <Muted>Feels like {formatTemperature(dayData.apparentTemperatureMin, temperatureUnit)}</Muted>
            </View>
          </View>
        </Card>

        {/* Hourly Forecast */}
        <HourlyForecast dayIndex={dayIndex} />

        {/* Sun & Moon */}
        <View>
          <H2 className="mb-3">Sun & Moon</H2>
          <View className="flex-row space-x-3">
            <WeatherCard
              icon={<Sun size={24} color="#f59e0b" />}
              title="Sunrise"
              value={formatTime(dayData.sunrise)}
            />
            <WeatherCard
              icon={<Sunset size={24} color="#f97316" />}
              title="Sunset"
              value={formatTime(dayData.sunset)}
            />
          </View>
          <View className="flex-row space-x-3 mt-3">
            <WeatherCard
              icon={<Clock size={24} color="#6b7280" />}
              title="Daylight"
              value={formatDuration(dayData.daylightDuration)}
            />
            <WeatherCard
              icon={<Sun size={24} color="#eab308" />}
              title="Sunshine"
              value={formatDuration(dayData.sunshineDuration)}
            />
          </View>
        </View>

        {/* Weather Conditions */}
        <View>
          <H2 className="mb-3">Weather Conditions</H2>
          <View className="flex-row space-x-3">
            <WeatherCard
              icon={<Droplets size={24} color="#3b82f6" />}
              title="Precipitation"
              value={formatPrecipitation(dayData.precipitationSum, precipitationUnit)}
              subtitle={`${dayData.precipitationHours}h duration`}
            />
            <WeatherCard
              icon={<Gauge size={24} color={precipLevel.color} />}
              title="Rain Chance"
              value={`${Math.round(dayData.precipitationProbabilityMax)}%`}
              subtitle={precipLevel.level}
              color={precipLevel.color}
            />
          </View>
        </View>

        {/* Wind */}
        <View>
          <H2 className="mb-3">Wind</H2>
          <View className="flex-row space-x-3">
            <WeatherCard
              icon={<Wind size={24} color="#6b7280" />}
              title="Wind Speed"
              value={formatWindSpeed(dayData.windSpeedMax, windSpeedUnit)}
              subtitle={formatWindDirection(dayData.windDirection)}
            />
            <WeatherCard
              icon={<Zap size={24} color="#ef4444" />}
              title="Wind Gusts"
              value={formatWindSpeed(dayData.windGustsMax, windSpeedUnit)}
            />
          </View>
        </View>

        {/* UV Index */}
        <View>
          <H2 className="mb-3">UV Index</H2>
          <WeatherCard
            icon={<Eye size={24} color={uvLevel.color} />}
            title="UV Index"
            value={dayData.uvIndexMax.toFixed(1)}
            subtitle={uvLevel.level}
            color={uvLevel.color}
          />
        </View>

        {/* Precipitation Breakdown */}
        {(dayData.rainSum > 0 || dayData.showersSum > 0 || dayData.snowfallSum > 0) && (
          <View>
            <H2 className="mb-3">Precipitation Breakdown</H2>
            <View className="space-y-3">
              {dayData.rainSum > 0 && (
                <View className="flex-row justify-between items-center p-3 bg-card rounded-lg">
                  <Text>Rain</Text>
                  <Text className="font-medium">
                    {formatPrecipitation(dayData.rainSum, precipitationUnit)}
                  </Text>
                </View>
              )}
              {dayData.showersSum > 0 && (
                <View className="flex-row justify-between items-center p-3 bg-card rounded-lg">
                  <Text>Showers</Text>
                  <Text className="font-medium">
                    {formatPrecipitation(dayData.showersSum, precipitationUnit)}
                  </Text>
                </View>
              )}
              {dayData.snowfallSum > 0 && (
                <View className="flex-row justify-between items-center p-3 bg-card rounded-lg">
                  <Text>Snow</Text>
                  <Text className="font-medium">
                    {formatPrecipitation(dayData.snowfallSum, precipitationUnit)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  )
} 