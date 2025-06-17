import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ChevronRight } from 'lucide-react-native';

import { useColorScheme } from '~/lib/useColorScheme';
import { Text } from '~/components/ui/text';
import { Switch } from '~/components/ui/switch';

// Simple section wrapper
export function SettingsSection({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <View className={`bg-card rounded-lg p-3 mb-3 ${className}`}>
          {children}
        </View>
  );
}

// Switch row component
interface SettingsSwitchProps {
  title: string;
  subtitle?: string;
  icon?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export function SettingsSwitch({ 
  title, 
  subtitle, 
  icon, 
  value, 
  onValueChange,
}: SettingsSwitchProps) {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <Pressable 
      onPress={() => onValueChange(!value)}
      className="flex-row items-center justify-between py-1">
      <View className="flex-row items-center flex-1">
        {icon && (
          <View className="mr-3 w-8 h-8 items-center justify-center rounded-full bg-muted">
            <Ionicons 
              name={icon as any} 
              size={18} 
              color={isDarkColorScheme ? '#9ca3af' : '#6b7280'} 
            />
          </View>
        )}
        <View className="flex-1">
          <Text className="text-base font-medium text-foreground">{title}</Text>
          {subtitle && <Text className="text-sm text-muted-foreground mt-1">{subtitle}</Text>}
        </View>
      </View>
      <Switch checked={value} onCheckedChange={onValueChange} />
    </Pressable>
  );
}

// Simple selector component
interface SettingsSelectorProps {
  title: string;
  subtitle?: string;
  icon?: string;
  value: string;
  options: { label: string; value: string }[];
  onValueChange: (value: string) => void;
}

export function SettingsSelector({ 
  title, 
  subtitle, 
  icon, 
  value, 
  options, 
  onValueChange,
}: SettingsSelectorProps) {
  const { isDarkColorScheme } = useColorScheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <View className="py-1">
      <Pressable 
        onPress={() => setIsOpen(!isOpen)}
        className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          {icon && (
            <View className="mr-3 w-8 h-8 items-center justify-center rounded-full bg-muted">
              <Ionicons 
                name={icon as any} 
                size={18} 
                color={isDarkColorScheme ? '#9ca3af' : '#6b7280'} 
              />
            </View>
          )}
          <View className="flex-1">
            <Text className="text-base font-medium text-foreground">{title}</Text>
            {subtitle && <Text className="text-sm text-muted-foreground mt-1">{subtitle}</Text>}
            <Text className="text-sm text-primary mt-1 font-medium">{selectedOption?.label || value}</Text>
          </View>
        </View>
        <ChevronRight size={20} color={isDarkColorScheme ? '#9ca3af' : '#6b7280'} />
      </Pressable>

      {isOpen && (
        <View className="mt-2 ml-11 space-y-2">
          {options.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => {
                onValueChange(option.value);
                setIsOpen(false);
              }}
              className={`p-3 rounded-lg border ${
                option.value === value ? 'border-primary bg-primary/10' : 'border-border bg-card'
              }`}
            >
              <Text className={`text-sm font-medium ${option.value === value ? 'text-primary' : 'text-foreground'}`}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

// Generic row component
interface SettingsRowProps {
  title: string;
  subtitle?: string;
  icon?: string;
  onPress?: () => void;
  showChevron?: boolean;
}

export function SettingsRow({ 
  title, 
  subtitle, 
  icon, 
  onPress, 
  showChevron = false,
}: SettingsRowProps) {
  const { isDarkColorScheme } = useColorScheme();

  const content = (
    <View className="flex-row items-center justify-between py-1">
      <View className="flex-row items-center flex-1">
        {icon && (
          <View className="mr-3 w-8 h-8 items-center justify-center rounded-full bg-muted">
            <Ionicons 
              name={icon as any} 
              size={18} 
              color={isDarkColorScheme ? '#9ca3af' : '#6b7280'} 
            />
          </View>
        )}
        <View className="flex-1">
          <Text className="text-base font-medium text-foreground">{title}</Text>
          {subtitle && <Text className="text-sm text-muted-foreground mt-1">{subtitle}</Text>}
        </View>
      </View>
      {showChevron && <ChevronRight size={20} color={isDarkColorScheme ? '#9ca3af' : '#6b7280'} />}
    </View>
  );

  return onPress ? (
      <Pressable onPress={onPress} className="active:opacity-70">
        {content}
      </Pressable>
  ) : (
    content
    );
}
