import { Tabs, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings } from 'lucide-react-native';
import { useColorScheme } from '~/lib/useColorScheme';
import { useLocation } from '~/lib/useWeatherData';
import { formatCoordinates } from '~/lib/utils';
import { Text } from '~/components/ui/text';
// import { FloatingAssistantButton } from '~/components/FloatingAssistantButton';

function LocationHeader() {
  const insets = useSafeAreaInsets();
  const { isDarkColorScheme } = useColorScheme();
  const {
    location,
    locationError,
    locationLoading,
    isUsingLastKnown,
    lastKnownLocation,
    cityName,
    cityLoading,
  } = useLocation();

  const getLocationStatusText = () => {
    if (locationLoading) {
      return 'Getting location...';
    }

    if (isUsingLastKnown && lastKnownLocation) {
      // Show city name if available, otherwise coordinates
      const locationText =
        lastKnownLocation.cityName ||
        formatCoordinates(lastKnownLocation.lat, lastKnownLocation.lon);
      return `Last known (${locationText})`;
    }

    if (locationError && !isUsingLastKnown) {
      return 'Location error';
    }

    if (location) {
      // Show city name if available and not loading, otherwise coordinates
      if (cityLoading) {
        return `${formatCoordinates(location.lat, location.lon)} (getting city...)`;
      }
      return cityName || formatCoordinates(location.lat, location.lon);
    }

    return 'No location';
  };

  const getLocationStatusColor = () => {
    if (locationLoading) return isDarkColorScheme ? '#6b7280' : '#9ca3af';
    if (isUsingLastKnown) return '#f59e0b';
    if (locationError && !isUsingLastKnown) return '#ef4444';
    return '#10b981';
  };

  const getLocationIcon = () => {
    if (locationLoading) return '🔄';
    if (isUsingLastKnown) return '📍';
    if (locationError && !isUsingLastKnown) return '❌';
    return '📍';
  };

  return (
    <View
      className="flex-row items-center justify-between border-b border-gray-200 bg-gray-50 px-4 pb-2 dark:border-gray-700 dark:bg-gray-900"
      style={{ paddingTop: insets.top }}>
      <View className="flex-1 items-center">
        <Text className="text-center text-xs" style={{ color: getLocationStatusColor() }}>
          {getLocationIcon()} {getLocationStatusText()}
        </Text>
      </View>

      <Pressable
        onPress={() => router.push('/settings')}
        className="rounded-full bg-gray-200 p-2 dark:bg-gray-700">
        <Settings size={20} color={isDarkColorScheme ? '#f9fafb' : '#111827'} />
      </Pressable>
    </View>
  );
}

export default function TabLayout() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDarkColorScheme ? '#60a5fa' : '#3b82f6',
        tabBarInactiveTintColor: isDarkColorScheme ? '#6b7280' : '#9ca3af',
        tabBarStyle: {
          backgroundColor: isDarkColorScheme ? '#1f2937' : '#ffffff',
          borderTopColor: isDarkColorScheme ? '#374151' : '#e5e7eb',
        },
        headerShown: true,
        header: () => <LocationHeader />,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="forecast"
        options={{
          title: 'Forecast',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="partly-sunny" size={size} color={color} />
          ),
        }}
      />
    {/* <FloatingAssistantButton /> */}
    </Tabs>
  );
}
