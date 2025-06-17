import { useCallback } from 'react'
import * as Notifications from 'expo-notifications'
import { getCachedHourlyWeatherForNotifications } from './useWeatherData'
import { getWeatherDescription, getWeatherEmoji } from './weather-utils'
import { useSettingsStore } from './settings-store'
import Constants from 'expo-constants'

export interface WeatherPrediction {
  type: 'rain_starting' | 'rain_stopping' | 'temp_drop' | 'temp_rise' | 'weather_change' | 'morning_brief'
  scheduledFor: Date
  currentConditions: {
    temperature: number
    weatherCode: number
    description: string
  }
  futureConditions: {
    temperature: number
    weatherCode: number
    description: string
    precipitationProbability?: number
  }
  message: string
  priority: 'low' | 'medium' | 'high'
}

export function useWeatherPredictions() {
  const { notifications } = useSettingsStore()

  // Analyze hourly data and find prediction opportunities
  const analyzeHourlyData = useCallback(() => {
    const hourlyData = getCachedHourlyWeatherForNotifications()
    if (!hourlyData?.hourly) {
      console.log('No hourly data available for predictions')
      return []
    }

    const predictions: WeatherPrediction[] = []
    const now = new Date()
    const { hourly } = hourlyData

    // Look at next 24 hours
    for (let i = 0; i < Math.min(24, hourly.time.length - 1); i++) {
      const currentTime = new Date(hourly.time[i])
      const nextTime = new Date(hourly.time[i + 1])
      
      // Skip past hours
      if (currentTime <= now) continue

      const current = {
        time: currentTime,
        temperature: Math.round(hourly.temperature2m[i]),
        weatherCode: hourly.weatherCode[i],
        precipitation: hourly.precipitation[i],
        precipitationProbability: hourly.precipitationProbability[i]
      }

      const next = {
        time: nextTime,
        temperature: Math.round(hourly.temperature2m[i + 1]),
        weatherCode: hourly.weatherCode[i + 1],
        precipitation: hourly.precipitation[i + 1],
        precipitationProbability: hourly.precipitationProbability[i + 1]
      }

      // 1. RAIN STARTING (High Priority)
      if (current.precipitationProbability < 30 && next.precipitationProbability >= 60) {
        const minutesUntilRain = Math.round((currentTime.getTime() - now.getTime()) / (1000 * 60))
        if (minutesUntilRain > 30 && minutesUntilRain < 180) { // 30min to 3hr notice
          predictions.push({
            type: 'rain_starting',
            scheduledFor: new Date(now.getTime() + (minutesUntilRain - 30) * 60 * 1000), // 30min before
            currentConditions: {
              temperature: current.temperature,
              weatherCode: current.weatherCode,
              description: getWeatherDescription(current.weatherCode)
            },
            futureConditions: {
              temperature: next.temperature,
              weatherCode: next.weatherCode,
              description: getWeatherDescription(next.weatherCode),
              precipitationProbability: next.precipitationProbability
            },
            message: `☔ Rain expected in ${Math.round(minutesUntilRain)}min (${next.precipitationProbability}% chance) - grab an umbrella!`,
            priority: 'high'
          })
        }
      }

      // 2. RAIN STOPPING (Medium Priority)
      if (current.precipitationProbability >= 60 && next.precipitationProbability < 30) {
        const minutesUntilClear = Math.round((currentTime.getTime() - now.getTime()) / (1000 * 60))
        if (minutesUntilClear > 30 && minutesUntilClear < 180) {
          predictions.push({
            type: 'rain_stopping',
            scheduledFor: new Date(now.getTime() + (minutesUntilClear - 15) * 60 * 1000), // 15min before
            currentConditions: {
              temperature: current.temperature,
              weatherCode: current.weatherCode,
              description: getWeatherDescription(current.weatherCode)
            },
            futureConditions: {
              temperature: next.temperature,
              weatherCode: next.weatherCode,
              description: getWeatherDescription(next.weatherCode)
            },
            message: `🌤️ Rain clearing up in ${Math.round(minutesUntilClear)}min - great time for a walk!`,
            priority: 'medium'
          })
        }
      }

      // 3. SIGNIFICANT TEMPERATURE DROP (High Priority)
      const tempDrop = current.temperature - next.temperature
      if (tempDrop >= 8) { // 8°C+ drop
        const minutesUntilDrop = Math.round((currentTime.getTime() - now.getTime()) / (1000 * 60))
        if (minutesUntilDrop > 60 && minutesUntilDrop < 240) { // 1-4hr notice
          predictions.push({
            type: 'temp_drop',
            scheduledFor: new Date(now.getTime() + (minutesUntilDrop - 60) * 60 * 1000), // 1hr before
            currentConditions: {
              temperature: current.temperature,
              weatherCode: current.weatherCode,
              description: getWeatherDescription(current.weatherCode)
            },
            futureConditions: {
              temperature: next.temperature,
              weatherCode: next.weatherCode,
              description: getWeatherDescription(next.weatherCode)
            },
            message: `🥶 Temperature dropping from ${current.temperature}°C to ${next.temperature}°C - dress warmly!`,
            priority: 'high'
          })
        }
      }

      // 4. SIGNIFICANT TEMPERATURE RISE (Medium Priority)
      const tempRise = next.temperature - current.temperature
      if (tempRise >= 8) { // 8°C+ rise
        const minutesUntilRise = Math.round((currentTime.getTime() - now.getTime()) / (1000 * 60))
        if (minutesUntilRise > 60 && minutesUntilRise < 240) {
          predictions.push({
            type: 'temp_rise',
            scheduledFor: new Date(now.getTime() + (minutesUntilRise - 60) * 60 * 1000),
            currentConditions: {
              temperature: current.temperature,
              weatherCode: current.weatherCode,
              description: getWeatherDescription(current.weatherCode)
            },
            futureConditions: {
              temperature: next.temperature,
              weatherCode: next.weatherCode,
              description: getWeatherDescription(next.weatherCode)
            },
            message: `🌡️ Warming up from ${current.temperature}°C to ${next.temperature}°C - perfect day ahead!`,
            priority: 'medium'
          })
        }
      }

      // 5. MAJOR WEATHER CHANGE (Medium Priority)
      if (current.weatherCode !== next.weatherCode) {
        const currentDesc = getWeatherDescription(current.weatherCode)
        const nextDesc = getWeatherDescription(next.weatherCode)
        
        // Only notify for significant changes (not minor cloud variations)
        const isSignificantChange = Math.abs(current.weatherCode - next.weatherCode) > 10
        if (isSignificantChange) {
          const minutesUntilChange = Math.round((currentTime.getTime() - now.getTime()) / (1000 * 60))
          if (minutesUntilChange > 30 && minutesUntilChange < 180) {
            predictions.push({
              type: 'weather_change',
              scheduledFor: new Date(now.getTime() + (minutesUntilChange - 30) * 60 * 1000),
              currentConditions: {
                temperature: current.temperature,
                weatherCode: current.weatherCode,
                description: currentDesc
              },
              futureConditions: {
                temperature: next.temperature,
                weatherCode: next.weatherCode,
                description: nextDesc
              },
              message: `${getWeatherEmoji(next.weatherCode)} Weather changing from ${currentDesc} to ${nextDesc}`,
              priority: 'medium'
            })
          }
        }
      }
    }

    return predictions
  }, [])

  // Schedule AI-enhanced notifications for predictions
  const scheduleAIPredictionNotifications = useCallback(async () => {
    if (!notifications.enabled) {
      return { success: false, message: 'Notifications disabled' }
    }

    try {
      const predictions = analyzeHourlyData()
      
      if (predictions.length === 0) {
        return { success: true, message: 'No significant weather changes predicted' }
      }

      // Cancel existing prediction notifications
      await Notifications.cancelAllScheduledNotificationsAsync()

      let scheduledCount = 0

      for (const prediction of predictions) {
        // Skip if scheduled time is in the past or too far in future
        const now = new Date()
        const timeUntilNotification = prediction.scheduledFor.getTime() - now.getTime()
        
        if (timeUntilNotification < 0 || timeUntilNotification > 24 * 60 * 60 * 1000) {
          continue
        }

        try {
          // Generate AI-enhanced notification content
          const WEATHER_API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000'
          const response = await fetch(`${WEATHER_API_BASE_URL}/api/ai`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              weatherCode: prediction.futureConditions.weatherCode,
              temperature: prediction.futureConditions.temperature,
              description: prediction.futureConditions.description,
              mode: 'prediction',
              predictionType: prediction.type,
              currentWeatherCode: prediction.currentConditions.weatherCode,
              currentTemperature: prediction.currentConditions.temperature,
              precipitationProbability: prediction.futureConditions.precipitationProbability
            }),
          })

          let notificationBody = prediction.message
          if (response.ok) {
            const aiResponse = await response.json()
            notificationBody = aiResponse.content || prediction.message
          }

          // Schedule the notification
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `${getWeatherEmoji(prediction.futureConditions.weatherCode)} Weather Alert`,
              body: notificationBody,
              data: { 
                type: 'weather_prediction',
                predictionType: prediction.type,
                priority: prediction.priority
              },
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: prediction.scheduledFor,
            },
          })

          scheduledCount++
        } catch (error) {
          console.error('Error scheduling prediction notification:', error)
          
          // Fallback to simple notification
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `${getWeatherEmoji(prediction.futureConditions.weatherCode)} Weather Alert`,
              body: prediction.message,
              data: { 
                type: 'weather_prediction',
                predictionType: prediction.type,
                priority: prediction.priority
              },
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: prediction.scheduledFor,
            },
          })
          scheduledCount++
        }
      }

      return { 
        success: true, 
        message: `Scheduled ${scheduledCount} weather predictions`,
        predictions: predictions.length,
        scheduled: scheduledCount
      }
    } catch (error) {
      console.error('Error scheduling prediction notifications:', error)
      return { success: false, message: 'Failed to schedule predictions' }
    }
  }, [notifications.enabled, analyzeHourlyData])

  // Get current predictions without scheduling
  const getPredictions = useCallback(() => {
    return analyzeHourlyData()
  }, [analyzeHourlyData])

  return {
    scheduleAIPredictionNotifications,
    getPredictions,
    analyzeHourlyData
  }
} 