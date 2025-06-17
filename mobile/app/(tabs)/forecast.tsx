import { View, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCurrentLocationDailyWeather } from '~/lib/useWeatherData';
import { useSettingsStore } from '~/lib/settings-store';
import { Text } from '~/components/ui/text';
import { H1, H2, Large, Muted } from '~/components/ui/typography';

export default function ForecastScreen() {
  const { temperatureUnit } = useSettingsStore();
  const { data, loading, error, locationError, locationLoading } = useCurrentLocationDailyWeather({
    enabled: true,
  });

  const formatTemperature = (temp: number) => {
    const symbol = temperatureUnit === 'fahrenheit' ? '°F' : '°C';
    return `${Math.round(temp)}${symbol}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  if (loading) {
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
        <H2 className="mb-4 text-destructive">Error</H2>
        <Muted className="text-center">{error}</Muted>
        {locationError && (
          <Text className="mt-4 text-center text-sm text-orange-500">{locationError}</Text>
        )}
      </SafeAreaView>
    );
  }

  const dailyData = data?.daily;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <ScrollView className="flex-1">
        <View className="p-5">
          <H1 className="mb-5">7-Day Forecast</H1>

          {dailyData && dailyData.time.length > 0 ? (
            <View className="space-y-3">
              {dailyData.time.map((date: any, index: number) => (
                <View
                  key={index}
                  className="flex-row items-center justify-between rounded-lg bg-card p-4">
                  <View className="flex-1">
                    <Large className="text-card-foreground">{formatDate(new Date(date))}</Large>
                    <Muted>Weather Code: {dailyData.weatherCode[index]}</Muted>
                  </View>

                  <View className="flex-row items-center space-x-4">
                    <View className="items-center">
                      <Muted>High</Muted>
                      <Text className="text-lg font-bold text-primary">
                        {formatTemperature(dailyData.temperature2mMax[index])}
                      </Text>
                    </View>

                    <View className="items-center">
                      <Muted>Low</Muted>
                      <Text className="text-lg font-medium text-muted-foreground">
                        {formatTemperature(dailyData.temperature2mMin[index])}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Muted className="text-center">No forecast data available</Muted>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
