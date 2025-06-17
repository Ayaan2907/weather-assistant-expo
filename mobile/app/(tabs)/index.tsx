import React from 'react'
import { View, TouchableOpacity, ActivityIndicator, RefreshControl, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { 
  MapPin, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge,
  RefreshCw,
  Clock,
  Sun,
  Thermometer,
  CloudRain,
  Zap
} from 'lucide-react-native'

import { useCurrentLocationWeather } from '~/lib/useWeatherData'
import { Text } from '~/components/ui/text'
import { H1, Large, Muted } from '~/components/ui/typography'
import { Card } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { WeatherCard } from '~/components/weather-card'
import { HourlyForecast } from '~/components/hourly-forecast'
import { useSettingsStore } from '~/lib/settings-store'
import {
  formatTemperature,
  formatTime,
  formatWindSpeed,
  formatWindDirection,
  formatPrecipitation,
  formatPressure,
  getWeatherDescription,
  getWeatherEmoji,
  getUVIndexLevel,
  getPrecipitationProbabilityLevel
} from '~/lib/weather-utils'

export default function HomeScreen() {
  const { temperatureUnit, windSpeedUnit, precipitationUnit } = useSettingsStore()
  const { 
    data, 
    loading, 
    error, 
    refetch, 
    lastUpdated, 
    locationError, 
    locationLoading,
    cityName,
    cityLoading,
    isUsingLastKnown
  } = useCurrentLocationWeather({ enableAutoRefresh: true })

  if (loading && !data) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center bg-background p-5"
        edges={['bottom']}>
        <ActivityIndicator size="large" color="hsl(240 5.9% 10%)" />
        <Large className="mt-4">Loading weather data...</Large>
        {locationLoading && (
          <Muted className="mt-2">Getting your location...</Muted>
        )}
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center bg-background p-5"
        edges={['bottom']}>
        <H1 className="mb-4 text-destructive">Error</H1>
        <Muted className="mb-4 text-center">{error}</Muted>
        {locationError && (
          <Text className="mb-4 text-center text-sm text-orange-500">{locationError}</Text>
        )}
        <Button onPress={refetch} variant="outline">
          <RefreshCw size={16} />
          <Text className="ml-2">Retry</Text>
        </Button>
      </SafeAreaView>
    )
  }

  const currentWeather = data?.current

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }>
        <View className="p-5 space-y-6">
          {/* Location Header */}
          <View className="items-center space-y-2">
            <View className="flex-row items-center space-x-2">
              <MapPin size={20} color="hsl(240 3.8% 46.1%)" />
              <Text className="text-lg font-medium">
                {cityLoading ? 'Loading location...' : cityName || 'Unknown location'}
              </Text>
            </View>
            {isUsingLastKnown && (
              <Muted className="text-center text-orange-500">Using last known location</Muted>
            )}
          </View>

          {currentWeather ? (
            <>
              {/* Main Weather Display */}
              <Card className="p-6 items-center space-y-4">
                <Text className="text-8xl">
                  {getWeatherEmoji(currentWeather.weatherCode)}
                </Text>
                <Text className="text-6xl font-light text-primary">
                  {formatTemperature(currentWeather.temperature2m, temperatureUnit)}
                </Text>
                <Large className="text-center text-muted-foreground">
                  {getWeatherDescription(currentWeather.weatherCode)}
                </Large>
                <Muted>
                  Feels like {formatTemperature(currentWeather.apparentTemperature, temperatureUnit)}
                </Muted>
              </Card>

              {/* Weather Details Grid - Using WeatherCard component */}
              <View className="space-y-3">
                <View className="flex-row space-x-3">
                  <WeatherCard
                    icon={<Droplets size={24} color="#3b82f6" />}
                    title="Precipitation"
                    value={formatPrecipitation(currentWeather.precipitation, precipitationUnit)}
                  />
                  <WeatherCard
                    icon={<Wind size={24} color="#6b7280" />}
                    title="Wind"
                    value={formatWindSpeed(currentWeather.windSpeed10m, windSpeedUnit)}
                    subtitle={formatWindDirection(currentWeather.windDirection10m)}
                  />
                </View>

                <View className="flex-row space-x-3">
                  <WeatherCard
                    icon={<Eye size={24} color="#8b5cf6" />}
                    title="Humidity"
                    value={`${Math.round(currentWeather.relativeHumidity2m)}%`}
                  />
                  <WeatherCard
                    icon={<Gauge size={24} color="#ef4444" />}
                    title="Pressure"
                    value={formatPressure(currentWeather.pressureMsl)}
                  />
                </View>

                {/* Additional Weather Cards */}
                <View className="flex-row space-x-3">
                  <WeatherCard
                    icon={<Thermometer size={24} color="#f59e0b" />}
                    title="Feels Like"
                    value={formatTemperature(currentWeather.apparentTemperature, temperatureUnit)}
                  />
                  <WeatherCard
                    icon={<CloudRain size={24} color="#3b82f6" />}
                    title="Cloud Cover"
                    value={`${Math.round(currentWeather.cloudCover)}%`}
                  />
                </View>

                {/* Wind Details */}
                <View className="flex-row space-x-3">
                  <WeatherCard
                    icon={<Zap size={24} color="#ef4444" />}
                    title="Wind Gusts"
                    value={formatWindSpeed(currentWeather.windGusts10m, windSpeedUnit)}
                  />
                  <WeatherCard
                    icon={<Sun size={24} color="#eab308" />}
                    title="Visibility"
                    value="Good"
                    subtitle="Clear conditions"
                  />
                </View>
              </View>

              {/* Precipitation Details */}
              {(currentWeather.rain > 0 || currentWeather.showers > 0 || currentWeather.snowfall > 0) && (
                <Card className="p-4 space-y-3">
                  <Large>Precipitation Details</Large>
                  <View className="space-y-2">
                    {currentWeather.rain > 0 && (
                      <View className="flex-row justify-between">
                        <Muted>Rain</Muted>
                        <Text>{formatPrecipitation(currentWeather.rain, precipitationUnit)}</Text>
                      </View>
                    )}
                    {currentWeather.showers > 0 && (
                      <View className="flex-row justify-between">
                        <Muted>Showers</Muted>
                        <Text>{formatPrecipitation(currentWeather.showers, precipitationUnit)}</Text>
                      </View>
                    )}
                    {currentWeather.snowfall > 0 && (
                      <View className="flex-row justify-between">
                        <Muted>Snow</Muted>
                        <Text>{formatPrecipitation(currentWeather.snowfall, precipitationUnit)}</Text>
                      </View>
                    )}
                  </View>
                </Card>
              )}

              <HourlyForecast 
                dayIndex={0} 
                hoursToShow={12} 
                title="Today's Hourly Forecast" 
              />

              {/* Last Updated */}
              {lastUpdated && (
                <View className="flex-row items-center justify-center space-x-2">
                  <Clock size={16} color="hsl(240 3.8% 46.1%)" />
                  <Muted>Last updated: {formatTime(lastUpdated)}</Muted>
                </View>
              )}
            </>
          ) : (
            <Card className="p-6 items-center">
              <Muted className="text-center">No weather data available</Muted>
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
} 
