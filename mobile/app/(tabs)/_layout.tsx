import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useColorScheme } from 'nativewind'

export default function TabLayout() {
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDark ? '#60a5fa' : '#3b82f6',
        tabBarInactiveTintColor: isDark ? '#6b7280' : '#9ca3af',
        tabBarStyle: {
          backgroundColor: isDark ? '#1f2937' : '#ffffff',
          borderTopColor: isDark ? '#374151' : '#e5e7eb',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="forecast" 
        options={{ 
          title: 'Forecast',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="partly-sunny" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="alerts" 
        options={{ 
          title: 'Alerts',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="warning" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="settings" 
        options={{ 
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }} 
      />
    </Tabs>
  )
} 