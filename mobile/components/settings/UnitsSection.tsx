import React from 'react';
import { View } from 'react-native';

import { useSettingsStore } from '~/lib/settings-store';
import { Text } from '~/components/ui/text';
import { SettingsSelector } from '~/components/settings/SettingsComponents';
import { Separator } from '~/components/ui/separator';
import { temperatureOptions, windSpeedOptions, precipitationOptions } from '~/lib/utils';

export function UnitsSection() {
  const {
    temperatureUnit,
    setTemperatureUnit,
    windSpeedUnit,
    setWindSpeedUnit,
    precipitationUnit,
    setPrecipitationUnit,
  } = useSettingsStore();

  return (
    <View className="space-y-4">
      <Text className="text-lg font-semibold text-foreground">Units</Text>

      <SettingsSelector
        title="Temperature"
        subtitle="Choose your preferred temperature unit"
        icon="thermometer"
        value={temperatureUnit}
        options={temperatureOptions}
        onValueChange={(value) => setTemperatureUnit(value as any)}
      />

      <Separator />

      <SettingsSelector
        title="Wind Speed"
        subtitle="Choose your preferred wind speed unit"
        icon="speedometer"
        value={windSpeedUnit}
        options={windSpeedOptions}
        onValueChange={(value) => setWindSpeedUnit(value as any)}
      />

      <Separator />

      <SettingsSelector
        title="Precipitation"
        subtitle="Choose your preferred precipitation unit"
        icon="water"
        value={precipitationUnit}
        options={precipitationOptions}
        onValueChange={(value) => setPrecipitationUnit(value as any)}
      />
    </View>
  );
}
