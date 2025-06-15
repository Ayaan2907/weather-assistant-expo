import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/lib/theme-context'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return 'sunny'
      case 'dark':
        return 'moon'
      case 'system':
        return 'phone-portrait'
      default:
        return 'sunny'
    }
  }

  const getNextTheme = () => {
    switch (theme) {
      case 'light':
        return 'dark'
      case 'dark':
        return 'system'
      case 'system':
        return 'light'
      default:
        return 'light'
    }
  }

    const handlePress = () => {
      console.log('handlePress')
    setTheme(getNextTheme())
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="flex-row items-center justify-center px-4 py-2 rounded-lg border bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600"
    >
      <Ionicons
        name={getThemeIcon()}
        size={20}
        className="text-gray-700 dark:text-gray-100"
      />
      <Text className="ml-2 font-medium capitalize text-gray-700 dark:text-gray-100">
        {theme}
      </Text>
    </TouchableOpacity>
  )
}

export function SimpleThemeToggle() {
  const { toggleTheme, isDark } = useTheme()

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      className="w-12 h-12 rounded-full items-center justify-center bg-gray-200 dark:bg-gray-800"
    >
      <Ionicons
        name={isDark ? 'sunny' : 'moon'}
        size={24}
        color={isDark ? '#fbbf24' : '#6b7280'}
      />
    </TouchableOpacity>
  )
} 