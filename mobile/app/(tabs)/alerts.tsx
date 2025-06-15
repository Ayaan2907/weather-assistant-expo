import { View, Text } from 'react-native'

export default function AlertsScreen() {
  return (
    <View className="flex-1 items-center justify-center p-5 bg-gray-100 dark:bg-gray-900">
      <Text className="text-3xl font-bold mb-5 text-gray-800 dark:text-white">
        Weather Alerts
      </Text>
      <Text className="text-base text-center text-gray-500 dark:text-gray-400">
        No active weather alerts
      </Text>
    </View>
  )
} 