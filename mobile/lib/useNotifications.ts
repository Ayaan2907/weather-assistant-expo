import { useState, useEffect, useCallback } from 'react'
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import { useSettingsStore } from './settings-store'
import { getWeatherDescription, getWeatherEmoji } from './weather-utils'
import Constants from 'expo-constants'

// Configure notification handler globally
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export interface WeatherNotificationData {
  weatherCode: number
  temperature: number
  description: string
  location?: string
}

export function useNotifications() {
  const [permissionStatus, setPermissionStatus] = useState<string>('unknown')
  const [isInitialized, setIsInitialized] = useState(false)
  const { notifications } = useSettingsStore()

  // Initialize permissions check
  useEffect(() => {
    initializeNotifications()
  }, [])

  const initializeNotifications = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync()
      setPermissionStatus(status)
      setIsInitialized(true)
    } catch (error) {
      console.error('Error initializing notifications:', error)
      setPermissionStatus('error')
      setIsInitialized(true)
    }
  }

  const requestPermissions = useCallback(async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      })
      setPermissionStatus(status)
      return status === 'granted'
    } catch (error) {
      console.error('Error requesting permissions:', error)
      return false
    }
  }, [])

  // Simple weather notification
  const sendWeatherNotification = useCallback(async (weatherData: WeatherNotificationData) => {
    if (!notifications.enabled || permissionStatus !== 'granted') {
      return false
    }

    try {
      const emoji = getWeatherEmoji(weatherData.weatherCode)
      const location = weatherData.location ? ` in ${weatherData.location}` : ''
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${emoji} Current Weather`,
          body: `It's ${weatherData.temperature}°C and ${weatherData.description}${location}`,
          data: { 
            type: 'weather_update',
            weatherCode: weatherData.weatherCode,
            temperature: weatherData.temperature 
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 1,
        },
      })
      
      return true
    } catch (error) {
      console.error('Error sending weather notification:', error)
      return false
    }
  }, [notifications.enabled, permissionStatus])

  // AI-enhanced weather notification
  const sendAIWeatherNotification = useCallback(async (weatherData: WeatherNotificationData) => {
    if (!notifications.enabled || permissionStatus !== 'granted') {
      return false
    }

    try {
      // Call your AI API to generate smart notification content
      const WEATHER_API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000'
      const response = await fetch(`${WEATHER_API_BASE_URL}/api/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weatherCode: weatherData.weatherCode,
          temperature: weatherData.temperature,
          description: weatherData.description,
          location: weatherData.location,
          mode: 'notification' // New mode for notifications
        }),
      })

      let notificationBody = `It's ${weatherData.temperature}°C and ${weatherData.description}`
      
      if (response.ok) {
        const aiResponse = await response.json()
        notificationBody = aiResponse.content || notificationBody
      }

      const emoji = getWeatherEmoji(weatherData.weatherCode)
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${emoji} Weather Assistant`,
          body: notificationBody,
          data: { 
            type: 'ai_weather_update',
            weatherCode: weatherData.weatherCode,
            temperature: weatherData.temperature 
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 1,
        },
      })
      
      return true
    } catch (error) {
      console.error('Error sending AI weather notification:', error)
      // Fallback to simple notification
      return sendWeatherNotification(weatherData)
    }
  }, [notifications.enabled, permissionStatus, sendWeatherNotification])

  // Schedule daily morning weather briefing
  const scheduleDailyBriefing = useCallback(async () => {
    if (!notifications.enabled || !notifications.dailyForecast || permissionStatus !== 'granted') {
      return false
    }

    try {
      // Cancel existing daily notifications first
      await Notifications.cancelAllScheduledNotificationsAsync()
      
      const [hour, minute] = notifications.notificationTime.split(':').map(Number)
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🌅 Good Morning!',
          body: 'Check today\'s weather forecast and get ready for the day',
          data: { type: 'daily_briefing' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour,
          minute,
          repeats: true,
        },
      })
      
      return true
    } catch (error) {
      console.error('Error scheduling daily briefing:', error)
      return false
    }
  }, [notifications.enabled, notifications.dailyForecast, notifications.notificationTime, permissionStatus])

  // Cancel all scheduled notifications
  const cancelAllNotifications = useCallback(async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync()
      return true
    } catch (error) {
      console.error('Error canceling notifications:', error)
      return false
    }
  }, [])

  // Get scheduled notifications count
  const getScheduledNotificationsCount = useCallback(async () => {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync()
      return scheduledNotifications.length
    } catch (error) {
      console.error('Error getting scheduled notifications:', error)
      return 0
    }
  }, [])

  return {
    // Status
    permissionStatus,
    isInitialized,
    hasPermission: permissionStatus === 'granted',
    
    // Actions
    requestPermissions,
    sendWeatherNotification,
    sendAIWeatherNotification,
    scheduleDailyBriefing,
    cancelAllNotifications,
    getScheduledNotificationsCount,
  }
} 