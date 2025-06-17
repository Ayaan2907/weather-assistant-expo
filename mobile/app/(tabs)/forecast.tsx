import React, { useEffect, useState } from 'react'
import { View, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';

import { useCurrentLocationDailyWeather } from '~/lib/useWeatherData';
import { Text } from '~/components/ui/text';
import { H1, Large, Muted } from '~/components/ui/typography';
import { Button } from '~/components/ui/button';
import { ForecastList, DayWeatherDetail } from '~/components/forecast';
import { extractDayData } from '~/lib/weather-utils';

export default function ForecastScreen() {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const { data, loading, error, refetch, locationError, locationLoading } = useCurrentLocationDailyWeather({
    enabled: true,
  });

  // Reset selectedDayIndex when component mounts
  useEffect(() => {
    setSelectedDayIndex(null)
  }, [])

  const handleDaySelect = (dayIndex: number) => {
    setSelectedDayIndex(dayIndex);
  };

  const handleBackToList = () => {
    setSelectedDayIndex(null);
  };

  if (loading && !data) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center bg-background p-5"
        edges={['bottom']}>
        <ActivityIndicator size="large" color="hsl(240 5.9% 10%)" />
        <Large className="mt-4">Loading forecast...</Large>
        {locationLoading && <Muted className="mt-2">Getting your location...</Muted>}
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center bg-background p-5"
        edges={['bottom']}>
        <H1 className="mb-4 text-destructive">Error</H1>
        <Muted className="text-center">{error}</Muted>
        {locationError && (
          <Text className="mt-4 text-center text-sm text-orange-500">{locationError}</Text>
        )}
      </SafeAreaView>
    );
  }

  const dailyData = data?.daily;

  // Show detailed day view
  if (selectedDayIndex !== null && dailyData) {
    const dayData = extractDayData(dailyData, selectedDayIndex);
    
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
        {/* Header with back button */}
        <View className="flex-row items-center p-4 border-b border-border">
          <Button
            onPress={handleBackToList}
            variant="ghost"
            size="sm"
            className="mr-3">
            <ArrowLeft size={20} />
          </Button>
          <Text className="text-lg font-semibold">Weather Details</Text>
        </View>

        {/* Day weather detail with pull-to-refresh */}
        <DayWeatherDetail 
          dayData={dayData} 
          dayIndex={selectedDayIndex}
          onRefresh={refetch}
          refreshing={loading}
        />
      </SafeAreaView>
    );
  }

  // Show forecast list
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }>
        <View className="p-5">
          <H1 className="mb-5">7-Day Forecast</H1>

          {dailyData ? (
            <ForecastList dailyData={dailyData} onDaySelect={handleDaySelect} />
          ) : (
            <Muted className="text-center">No forecast data available</Muted>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
