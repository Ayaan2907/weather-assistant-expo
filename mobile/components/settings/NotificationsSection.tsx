import React from 'react';
import { View } from 'react-native';

import { useSettingsStore } from '~/lib/settings-store';
import { Text } from '~/components/ui/text';
import { SettingsSwitch } from '~/components/settings/SettingsComponents';
import { Separator } from '~/components/ui/separator';

export function NotificationsSection() {
  const { notifications, setNotifications } = useSettingsStore();

  return (
    <View className="space-y-4">
      <Text className="text-lg font-semibold text-foreground">Notifications</Text>

      <SettingsSwitch
        title="Push Notifications"
        subtitle="Receive weather updates and alerts"
        icon="notifications"
        value={notifications.enabled}
        onValueChange={(enabled) => setNotifications({ enabled })}
      />

      <Separator />

      <SettingsSwitch
        title="Weather Alerts"
        subtitle="Get notified about severe weather conditions"
        icon="warning"
        value={notifications.weatherAlerts}
        onValueChange={(weatherAlerts) => setNotifications({ weatherAlerts })}
      />

      <Separator />

      <SettingsSwitch
        title="Daily Forecast"
        subtitle="Receive daily weather forecast notifications"
        icon="sunny"
        value={notifications.dailyForecast}
        onValueChange={(dailyForecast) => setNotifications({ dailyForecast })}
      />

      <Separator />

      <SettingsSwitch
        title="Rain Alerts"
        subtitle="Get notified when rain is expected"
        icon="rainy"
        value={notifications.rainAlerts}
        onValueChange={(rainAlerts) => setNotifications({ rainAlerts })}
      />
    </View>
  );
}
