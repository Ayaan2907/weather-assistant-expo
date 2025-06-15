import React from 'react'
import { View, Text, TouchableOpacity, Switch } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface SettingsSectionProps {
  title: string
  children: React.ReactNode
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <View className="mb-6">
      <Text className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">
        {title}
      </Text>
      <View className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        {children}
      </View>
    </View>
  )
}

interface SettingsRowProps {
  title: string
  subtitle?: string
  icon?: keyof typeof Ionicons.glyphMap
  children?: React.ReactNode
  onPress?: () => void
  showChevron?: boolean
}

export function SettingsRow({ 
  title, 
  subtitle, 
  icon, 
  children, 
  onPress, 
  showChevron = false 
}: SettingsRowProps) {
  const content = (
    <View className="flex-row items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
      <View className="flex-row items-center flex-1">
        {icon && (
          <Ionicons 
            name={icon} 
            size={20} 
            className="text-gray-600 dark:text-gray-400 mr-3" 
          />
        )}
        <View className="flex-1">
          <Text className="text-base font-medium text-gray-900 dark:text-white">
            {title}
          </Text>
          {subtitle && (
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      
      <View className="flex-row items-center">
        {children}
        {showChevron && (
          <Ionicons 
            name="chevron-forward" 
            size={16} 
            className="text-gray-400 dark:text-gray-500 ml-2" 
          />
        )}
      </View>
    </View>
  )

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    )
  }

  return content
}

interface SettingsSwitchProps {
  title: string
  subtitle?: string
  icon?: keyof typeof Ionicons.glyphMap
  value: boolean
  onValueChange: (value: boolean) => void
}

export function SettingsSwitch({ 
  title, 
  subtitle, 
  icon, 
  value, 
  onValueChange 
}: SettingsSwitchProps) {
  return (
    <SettingsRow
      title={title}
      subtitle={subtitle}
      icon={icon}
    >
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
        thumbColor={value ? '#ffffff' : '#f3f4f6'}
      />
    </SettingsRow>
  )
}

interface SettingsSelectorProps {
  title: string
  subtitle?: string
  icon?: keyof typeof Ionicons.glyphMap
  value: string
  options: { label: string; value: string }[]
  onValueChange: (value: string) => void
}

export function SettingsSelector({ 
  title, 
  subtitle, 
  icon, 
  value, 
  options, 
  onValueChange 
}: SettingsSelectorProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const selectedOption = options.find(option => option.value === value)

  return (
    <View>
      <SettingsRow
        title={title}
        subtitle={subtitle}
        icon={icon}
        onPress={() => setIsExpanded(!isExpanded)}
        showChevron
      >
        <Text className="text-blue-600 dark:text-blue-400 font-medium">
          {selectedOption?.label}
        </Text>
      </SettingsRow>
      
      {isExpanded && (
        <View className="bg-gray-50 dark:bg-gray-700">
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => {
                onValueChange(option.value)
                setIsExpanded(false)
              }}
              className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
            >
              <Text className="text-base text-gray-900 dark:text-white">
                {option.label}
              </Text>
              {value === option.value && (
                <Ionicons 
                  name="checkmark" 
                  size={20} 
                  className="text-blue-600 dark:text-blue-400" 
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  )
} 