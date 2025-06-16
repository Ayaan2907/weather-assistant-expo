import { View, Text } from 'react-native';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { AlertCircle } from 'lucide-react-native';

export default function AlertsScreen() {
  return ( 
    <View className="flex-1 items-center justify-center p-5 bg-background">
      <Text className="mb-5 text-3xl font-bold text-foreground">Weather Alerts</Text>
      <Alert icon={AlertCircle} iconSize={24} iconClassName="text-destructive" variant="destructive">
        <AlertTitle>
          <Text>Weather Alert</Text>
        </AlertTitle>
        <AlertDescription>
          <Text>A severe weather alert has been issued for your area.</Text>
        </AlertDescription>
      </Alert>
      <Text className="text-center text-base text-muted-foreground">
        No active weather alerts
      </Text>
    </View>
  );
}
