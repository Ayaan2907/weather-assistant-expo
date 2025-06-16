import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <View className="mb-6">
      <Text className="mb-3 text-lg font-semibold text-foreground">{title}</Text>
      <View className="overflow-hidden rounded-lg bg-card">{children}</View>
    </View>
  );
}

interface SettingsRowProps {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  children?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
}

export function SettingsRow({
  title,
  subtitle,
  icon,
  children,
  onPress,
  showChevron = false,
}: SettingsRowProps) {
  const content = (
    <View className="flex-row items-center justify-between border-b border-border p-4 last:border-b-0">
      <View className="flex-1 flex-row items-center">
        {icon && <Ionicons name={icon} size={20} color="hsl(240 3.8% 46.1%)" style={{ marginRight: 12 }} />}
        <View className="flex-1">
          <Text className="text-base font-medium text-card-foreground">{title}</Text>
          {subtitle && (
            <Text className="mt-1 text-sm text-muted-foreground">{subtitle}</Text>
          )}
        </View>
      </View>

      <View className="flex-row items-center">
        {children}
        {showChevron && (
          <Ionicons name="chevron-forward" size={16} color="hsl(240 3.8% 46.1%)" style={{ marginLeft: 8 }} />
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

interface SettingsSwitchProps {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
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
  return (
    <SettingsRow title={title} subtitle={subtitle} icon={icon}>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: 'hsl(240 5.9% 90%)', true: 'hsl(240 5.9% 10%)' }}
        thumbColor={value ? 'hsl(0 0% 98%)' : 'hsl(240 4.8% 95.9%)'}
      />
    </SettingsRow>
  );
}

interface SettingsSelectorProps {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
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
  const [isExpanded, setIsExpanded] = React.useState(false);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <View>
      <SettingsRow
        title={title}
        subtitle={subtitle}
        icon={icon}
        onPress={() => setIsExpanded(!isExpanded)}
        showChevron>
        <Text className="font-medium text-primary">
          {selectedOption?.label}
        </Text>
      </SettingsRow>

      {isExpanded && (
        <View className="bg-muted">
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => {
                onValueChange(option.value);
                setIsExpanded(false);
              }}
              className="flex-row items-center justify-between border-b border-border px-4 py-3 last:border-b-0">
              <Text className="text-base text-muted-foreground">{option.label}</Text>
              {value === option.value && <Ionicons name="checkmark" size={20} color="hsl(240 5.9% 10%)" />}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
