import React, { useState, useEffect } from 'react'
import { View, Alert, Platform } from 'react-native'
import * as Notifications from 'expo-notifications'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import { useNotifications } from '~/lib/useNotifications'
import { useCurrentLocationWeather } from '~/lib/useWeatherData'
import { getWeatherDescription } from '~/lib/weather-utils'
import { useWeatherPredictions } from '~/lib/useWeatherPredictions'

export function NotificationTest() {
  const [scheduledCount, setScheduledCount] = useState(0)
  const { 
    permissionStatus, 
    hasPermission, 
    requestPermissions,
    sendWeatherNotification,
    sendAIWeatherNotification,
    scheduleDailyBriefing,
    cancelAllNotifications,
    getScheduledNotificationsCount
  } = useNotifications()
  
  const { 
    scheduleAIPredictionNotifications,
    getPredictions 
  } = useWeatherPredictions()
  
  const { data: weather, cityName } = useCurrentLocationWeather()

  useEffect(() => {
    updateScheduledCount()
  }, [])

  const updateScheduledCount = async () => {
    const count = await getScheduledNotificationsCount()
    setScheduledCount(count)
  }

  const handleRequestPermissions = async () => {
    const granted = await requestPermissions()
    if (granted) {
      Alert.alert('Success', 'Notification permissions granted!')
    } else {
      Alert.alert('Denied', 'Notification permissions were denied')
    }
  }

  const handleSimpleWeatherNotification = async () => {
    if (!weather?.current) {
      Alert.alert('No Weather Data', 'Please wait for weather data to load')
      return
    }

         const success = await sendWeatherNotification({
       weatherCode: weather.current.weatherCode,
       temperature: Math.round(weather.current.temperature2m),
       description: getWeatherDescription(weather.current.weatherCode),
       location: cityName || undefined
     })

    if (success) {
      Alert.alert('Scheduled', 'Weather notification sent!')
      updateScheduledCount()
    } else {
      Alert.alert('Failed', 'Could not send notification')
    }
  }

  const handleAIWeatherNotification = async () => {
    if (!weather?.current) {
      Alert.alert('No Weather Data', 'Please wait for weather data to load')
      return
    }

         const success = await sendAIWeatherNotification({
       weatherCode: weather.current.weatherCode,
       temperature: Math.round(weather.current.temperature2m),
       description: getWeatherDescription(weather.current.weatherCode),
       location: cityName || undefined
     })

    if (success) {
      Alert.alert('Scheduled', 'AI weather notification sent!')
      updateScheduledCount()
    } else {
      Alert.alert('Failed', 'Could not send AI notification')
    }
  }

  const handleScheduleDailyBriefing = async () => {
    const success = await scheduleDailyBriefing()
    if (success) {
      Alert.alert('Scheduled', 'Daily morning briefing set up!')
      updateScheduledCount()
    } else {
      Alert.alert('Failed', 'Could not schedule daily briefing')
    }
  }

  const handleCancelAll = async () => {
    const success = await cancelAllNotifications()
    if (success) {
      Alert.alert('Cancelled', 'All notifications cancelled')
      updateScheduledCount()
    }
  }

  const handleSchedulePredictions = async () => {
    const result = await scheduleAIPredictionNotifications()
    if (result.success) {
      Alert.alert('Success', result.message)
      updateScheduledCount()
    } else {
      Alert.alert('Failed', result.message)
    }
  }

  const handleShowPredictions = async () => {
    const predictions = getPredictions()
    if (predictions.length === 0) {
      Alert.alert('No Predictions', 'No significant weather changes predicted in the next 24 hours')
    } else {
      const summary = predictions.map(p => 
        `${p.priority.toUpperCase()}: ${p.type.replace('_', ' ')} at ${p.scheduledFor.toLocaleTimeString()}`
      ).join('\n\n')
      Alert.alert('Weather Predictions', summary)
    }
  }

  const getStatusColor = () => {
    switch (permissionStatus) {
      case 'granted': return 'text-green-600'
      case 'denied': return 'text-red-600'
      case 'unknown': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <View className="p-4 space-y-4 bg-card rounded-lg border border-border">
      <Text className="text-lg font-semibold">🔔 Weather Notifications</Text>
      
      <View className="space-y-2">
        <Text className="text-sm text-muted-foreground">
          Permission Status: <Text className={getStatusColor()}>{permissionStatus}</Text>
        </Text>
        <Text className="text-xs text-muted-foreground">
          Platform: {Platform.OS} • Scheduled: {scheduledCount}
        </Text>
      </View>

      <View className="space-y-2">
        <Button
          onPress={handleRequestPermissions}
          variant={hasPermission ? 'secondary' : 'default'}
        >
          <Text>{hasPermission ? 'Permissions Granted ✓' : 'Request Permissions'}</Text>
        </Button>

        <Button
          onPress={handleSimpleWeatherNotification}
          disabled={!hasPermission}
          variant="outline"
        >
          <Text>🌤️ Send Weather Update</Text>
        </Button>

        <Button
          onPress={handleAIWeatherNotification}
          disabled={!hasPermission}
          variant="outline"
        >
          <Text>🤖 Send AI Weather Tip</Text>
        </Button>

        <Button
          onPress={handleScheduleDailyBriefing}
          disabled={!hasPermission}
          variant="outline"
        >
          <Text>🌅 Schedule Daily Briefing</Text>
        </Button>

        <Button
          onPress={handleSchedulePredictions}
          disabled={!hasPermission}
          variant="outline"
        >
          <Text>🔮 Schedule Smart Predictions</Text>
        </Button>

        <Button
          onPress={handleShowPredictions}
          variant="ghost"
          size="sm"
        >
          <Text>👁️ View Predictions</Text>
        </Button>

        <Button onPress={handleCancelAll} variant="ghost" size="sm">
          <Text>Cancel All Notifications</Text>
        </Button>
      </View>
    </View>
  )
} 