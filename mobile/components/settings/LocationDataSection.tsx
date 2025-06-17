import React from 'react';
import { View } from 'react-native';

import { useSettingsStore } from '~/lib/settings-store';
import { Text } from '~/components/ui/text';
import { SettingsSwitch, SettingsSelector } from './SettingsComponents';
import { Separator } from '~/components/ui/separator';
import { refreshIntervalOptions } from '~/lib/utils';

export function LocationDataSection() {
  const {
    useCurrentLocation,
    setUseCurrentLocation,
    autoRefresh,
    setAutoRefresh,
    refreshInterval,
    setRefreshInterval,
  } = useSettingsStore();

  return (
    <View className="space-y-4">
      <Text className="text-lg font-semibold text-foreground">Location & Data</Text>

      <SettingsSwitch
        title="Use Current Location"
        subtitle="Automatically detect your location"
        icon="location"
        value={useCurrentLocation}
        onValueChange={setUseCurrentLocation}
      />

      <Separator />

      <SettingsSwitch
        title="Auto Refresh"
        subtitle="Automatically update weather data"
        icon="refresh"
        value={autoRefresh}
        onValueChange={setAutoRefresh}
      />

      {autoRefresh && (
        <>
          <Separator />
          <SettingsSelector
            title="Refresh Interval"
            subtitle="How often to update data"
            icon="time"
            value={refreshInterval.toString()}
            options={refreshIntervalOptions}
            onValueChange={(value) => setRefreshInterval(parseInt(value))}
          />
        </>
      )}
    </View>
  );
}
