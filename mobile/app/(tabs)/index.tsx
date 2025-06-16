import { View, Text } from 'react-native';
import { useSettingsStore } from '~/lib/settings-store';

export default function HomeScreen() {
  const { temperatureUnit } = useSettingsStore();

  // Mock temperature data - in real app this would come from API in the correct unit
  const currentTemp = temperatureUnit === 'fahrenheit' ? 72 : 22;
  const tempSymbol = temperatureUnit === 'fahrenheit' ? '°F' : '°C';

  return (
    <View className="flex-1 items-center justify-center p-5 bg-background">
      <Text className="mb-5 text-3xl font-bold text-foreground">
        Weather App
      </Text>
      <Text className="mb-2 text-6xl font-light text-primary">
        {currentTemp}
        {tempSymbol}
      </Text>
      <Text className="text-lg text-muted-foreground mb-5">Sunny</Text>
      <Text className="text-center text-base text-muted-foreground">
        Current weather conditions will appear here. Temperature unit: {temperatureUnit}
      </Text>
    </View>
  );
}
