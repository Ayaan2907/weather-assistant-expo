import { View, Text } from 'react-native';

export default function ForecastScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background p-5">
      <Text className="mb-5 text-3xl font-bold text-foreground">7-Day Forecast</Text>
      <Text className="text-center text-base text-muted-foreground">
        Extended forecast will appear here
      </Text>
    </View>
  );
}
