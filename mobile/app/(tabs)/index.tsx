import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useCurrentLocationWeather } from '~/lib/useWeatherData';
import { useColorScheme } from '~/lib/useColorScheme';
import { Text } from '~/components/ui/text';
import { H1, H2, Large, Muted } from '~/components/ui/typography';
import { useSettingsStore } from '~/lib/settings-store';

export default function HomeScreen() {
  const { temperatureUnit } = useSettingsStore();
  const { data, loading, error, refetch, lastUpdated, locationError, locationLoading } =
    useCurrentLocationWeather({ enableAutoRefresh: true });

  const formatTemperature = (temp: number) => {
    const symbol = temperatureUnit === 'fahrenheit' ? '°F' : '°C';
    return `${Math.round(temp)}${symbol}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading && !data) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center bg-background p-5"
        edges={['bottom']}>
        <ActivityIndicator size="large" color="hsl(240 5.9% 10%)" />
        <Text className="mt-4 text-lg text-muted-foreground">Loading weather data...</Text>
        {locationLoading && (
          <Text className="mt-2 text-sm text-muted-foreground">Getting your location...</Text>
        )}
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center bg-background p-5"
        edges={['bottom']}>
        <Text className="mb-4 text-xl font-bold text-destructive">Error</Text>
        <Text className="mb-4 text-center text-base text-muted-foreground">{error}</Text>
        {locationError && (
          <Text className="mb-4 text-center text-sm text-orange-500">{locationError}</Text>
        )}
        <TouchableOpacity onPress={refetch} className="rounded-lg bg-primary px-6 py-3">
          <Text className="font-medium text-primary-foreground">Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const currentWeather = data?.current;
  const currentTemp = currentWeather?.temperature2m;

  return (
    <SafeAreaView
      className="flex-1 items-center justify-center bg-background p-5"
      edges={['bottom']}>
      <H1 className="mb-5">Weather App</H1>
      {/* TODO: RNR: REPLACE STATIC TEXT */}

      {currentTemp !== undefined ? (
        <>
          <Text className="mb-2 text-6xl font-light text-primary">
            {formatTemperature(currentTemp)}
          </Text>
          <Large className="mb-5">Weather Code: {currentWeather?.weatherCode}</Large>

          <View className="mb-5 rounded-lg bg-card p-4">
            <Muted className="mb-2">Current Conditions</Muted>
            <Text className="text-base text-card-foreground">
              Precipitation: {currentWeather?.precipitation}mm
            </Text>
            <Text className="text-base text-card-foreground">Rain: {currentWeather?.rain}mm</Text>
          </View>

          {lastUpdated && <Muted className="mb-4">Last updated: {formatTime(lastUpdated)}</Muted>}

          <TouchableOpacity
            onPress={refetch}
            disabled={loading}
            className="rounded-lg bg-primary px-6 py-3">
            <Text className="font-medium text-primary-foreground">
              {loading ? 'Refreshing...' : 'Refresh'}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <Muted className="text-center">No weather data available</Muted>
      )}
    </SafeAreaView>
  );
}
