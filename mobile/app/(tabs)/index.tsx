import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettingsStore } from '~/lib/settings-store';
import { useCurrentLocationWeather } from '~/lib/useWeatherData';

export default function HomeScreen() {
  const { temperatureUnit } = useSettingsStore();
  const { 
    data, 
    loading, 
    error, 
    refetch, 
    lastUpdated, 
    locationError, 
    locationLoading 
  } = useCurrentLocationWeather({ enableAutoRefresh: true });

  const formatTemperature = (temp: number) => {
    const symbol = temperatureUnit === 'fahrenheit' ? '°F' : '°C';
    return `${Math.round(temp)}${symbol}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading && !data) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center p-5 bg-background" edges={['bottom']}>
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
      <SafeAreaView className="flex-1 items-center justify-center p-5 bg-background" edges={['bottom']}>
        <Text className="mb-4 text-xl font-bold text-destructive">Error</Text>
        <Text className="mb-4 text-center text-base text-muted-foreground">{error}</Text>
        {locationError && (
          <Text className="mb-4 text-center text-sm text-orange-500">{locationError}</Text>
        )}
        <TouchableOpacity
          onPress={refetch}
          className="bg-primary px-6 py-3 rounded-lg">
          <Text className="text-primary-foreground font-medium">Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const currentWeather = data?.current;
  const currentTemp = currentWeather?.temperature2m;

  return (
    <SafeAreaView className="flex-1 items-center justify-center p-5 bg-background" edges={['bottom']}>
      <Text className="mb-5 text-3xl font-bold text-foreground">
        Weather App
      </Text>
      {/* TODO: RNR: REPLACE STATIC TEXT */}
      
      {currentTemp !== undefined ? (
        <>
          <Text className="mb-2 text-6xl font-light text-primary">
            {formatTemperature(currentTemp)}
          </Text>
          <Text className="text-lg text-muted-foreground mb-5">
            Weather Code: {currentWeather?.weatherCode}
          </Text>
          
          <View className="mb-5 p-4 bg-card rounded-lg">
            <Text className="text-sm text-muted-foreground mb-2">Current Conditions</Text>
            <Text className="text-base text-card-foreground">
              Precipitation: {currentWeather?.precipitation}mm
            </Text>
            <Text className="text-base text-card-foreground">
              Rain: {currentWeather?.rain}mm
            </Text>
          </View>

          {lastUpdated && (
            <Text className="text-sm text-muted-foreground mb-4">
              Last updated: {formatTime(lastUpdated)}
            </Text>
          )}

          <TouchableOpacity
            onPress={refetch}
            disabled={loading}
            className="bg-primary px-6 py-3 rounded-lg">
            <Text className="text-primary-foreground font-medium">
              {loading ? 'Refreshing...' : 'Refresh'}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text className="text-center text-base text-muted-foreground">
          No weather data available
        </Text>
      )}
    </SafeAreaView>
  );
}
