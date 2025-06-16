import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCurrentLocationDailyWeather } from '~/lib/useWeatherData';
import { useSettingsStore } from '~/lib/settings-store';

export default function ForecastScreen() {
  const { temperatureUnit } = useSettingsStore();
  const { 
    data, 
    loading, 
    error, 
    locationError, 
    locationLoading 
  } = useCurrentLocationDailyWeather({ enabled: true });

  const formatTemperature = (temp: number) => {
    const symbol = temperatureUnit === 'fahrenheit' ? '°F' : '°C';
    return `${Math.round(temp)}${symbol}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background p-5" edges={['bottom']}>
        <ActivityIndicator size="large" color="hsl(240 5.9% 10%)" />
        <Text className="mt-4 text-lg text-muted-foreground">Loading forecast...</Text>
        {locationLoading && (
          <Text className="mt-2 text-sm text-muted-foreground">Getting your location...</Text>
        )}
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background p-5" edges={['bottom']}>
        <Text className="mb-4 text-xl font-bold text-destructive">Error</Text>
        <Text className="text-center text-base text-muted-foreground">{error}</Text>
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
          <Text className="mb-5 text-3xl font-bold text-foreground">7-Day Forecast</Text>
          
          {dailyData && dailyData.time.length > 0 ? (
            <View className="space-y-3">
              {dailyData.time.map((date, index) => (
                <View key={index} className="flex-row items-center justify-between p-4 bg-card rounded-lg">
                  <View className="flex-1">
                    <Text className="text-lg font-medium text-card-foreground">
                      {formatDate(new Date(date))}
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      Weather Code: {dailyData.weatherCode[index]}
                    </Text>
                  </View>
                  
                  <View className="flex-row items-center space-x-4">
                    <View className="items-center">
                      <Text className="text-sm text-muted-foreground">High</Text>
                      <Text className="text-lg font-bold text-primary">
                        {formatTemperature(dailyData.temperature2mMax[index])}
                      </Text>
                    </View>
                    
                    <View className="items-center">
                      <Text className="text-sm text-muted-foreground">Low</Text>
                      <Text className="text-lg font-medium text-muted-foreground">
                        {formatTemperature(dailyData.temperature2mMin[index])}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text className="text-center text-base text-muted-foreground">
              No forecast data available
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
