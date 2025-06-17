import React from 'react';
import { View } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';

import { useColorScheme } from '~/lib/useColorScheme';
import { Text } from '~/components/ui/text';
import { Switch } from '~/components/ui/switch';

export function ThemeSelector() {
  const { setColorScheme, isDarkColorScheme } = useColorScheme();

  const toggleTheme = (checked: boolean) => {
    setColorScheme(checked ? 'dark' : 'light');
  };

  return (
    <View className="flex-row items-center justify-between py-1">
      <View className="flex-row items-center">
        {isDarkColorScheme ? (
          <Moon size={20} color="#60a5fa" />
        ) : (
          <Sun size={20} color="#f59e0b" />
        )}
        <Text className="ml-3 text-base text-foreground">
          {isDarkColorScheme ? 'Dark' : 'Light'} Theme
        </Text>
      </View>
      <Switch checked={isDarkColorScheme} onCheckedChange={toggleTheme} />
    </View>
  );
}
 