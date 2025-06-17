import { View, Text } from 'react-native';
import { useLocation } from '~/lib/useWeatherData';

export function CustomStatusBar() {
  const { locationError, locationLoading, isUsingLastKnown, lastKnownLocation } = useLocation();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getLocationStatusText = () => {
    if (locationLoading) {
      return 'Getting your location...';
    }

    if (isUsingLastKnown && lastKnownLocation) {
      return `Using last known location (${formatDate(lastKnownLocation.timestamp)})`;
    }

    if (locationError && !isUsingLastKnown) {
      return `Location error: ${locationError}`;
    }

    return 'Current location';
  };

  const getLocationStatusColor = () => {
    if (locationLoading) return 'text-muted-foreground';
    if (isUsingLastKnown) return 'text-orange-500';
    if (locationError && !isUsingLastKnown) return 'text-destructive';
    return 'text-green-600';
  };

  const getLocationIcon = () => {
    if (locationLoading) return '🔄';
    if (isUsingLastKnown) return '📍';
    if (locationError && !isUsingLastKnown) return '❌';
    return '📍';
  };

  return (
    <View className="border-b border-border bg-card px-4 py-2">
      <Text className={`text-center text-xs ${getLocationStatusColor()}`}>
        {getLocationIcon()} {getLocationStatusText()}
      </Text>
    </View>
  );
}
