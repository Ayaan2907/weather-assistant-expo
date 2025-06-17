import React, { useEffect, useState, useRef } from 'react'
import { 
  View, 
  Text, 
  ScrollView, 
  Animated, 
  Dimensions, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useCurrentLocationWeather, useLocation } from '../lib/useWeatherData'
import Constants from 'expo-constants'
import { useRouter } from 'expo-router'
import { 
  getWeatherDescription, 
  getWeatherEmoji, 
  formatTemperature,
  formatTime,
  formatWindSpeed,
  formatPressure 
} from '../lib/weather-utils'
import { cn } from '../lib/utils'

const { width, height } = Dimensions.get('window')

interface ChatMessage {
  id: string
  text: string
  isAssistant: boolean
  timestamp: Date
  isLoading?: boolean
}

// Weather Animation Component
const WeatherAnimation = ({ weatherCode }: { weatherCode: number }) => {
  const animatedValue = new Animated.Value(0)

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start()
  }, [])

  const getAnimationStyle = () => {
    const translateY = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -20],
    })

    return {
      transform: [{ translateY }],
    }
  }

  const getBackgroundGradient = (): string[] => {
    // Clear sky or sunny
    if (weatherCode === 0 || weatherCode === 1) {
      return ['#87CEEB', '#87CEFA', '#FFE4B5']
    }
    // Partly cloudy
    if (weatherCode === 2 || weatherCode === 3) {
      return ['#B0C4DE', '#D3D3D3', '#F0F8FF']
    }
    // Rain
    if (weatherCode >= 51 && weatherCode <= 67) {
      return ['#708090', '#2F4F4F', '#1C1C1C']
    }
    // Snow
    if (weatherCode >= 71 && weatherCode <= 86) {
      return ['#F0F8FF', '#E6E6FA', '#D3D3D3']
    }
    // Thunderstorm
    if (weatherCode >= 95) {
      return ['#2F2F2F', '#1C1C1C', '#000000']
    }
    // Default
    return ['#87CEEB', '#87CEFA', '#FFE4B5']
  }

  return (
    <LinearGradient
      colors={getBackgroundGradient() as any}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Animated.View style={getAnimationStyle()}>
          <Text style={{ fontSize: 80, textAlign: 'center' }}>
            {getWeatherEmoji(weatherCode)}
          </Text>
        </Animated.View>
      </View>
    </LinearGradient>
  )
}

// Simplified Chat Message Component
const ChatMessageBubble = ({ message }: { message: ChatMessage }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        marginVertical: 6,
        paddingHorizontal: 16,
        justifyContent: message.isAssistant ? 'flex-start' : 'flex-end',
      }}
    >
      <View
        style={{
          maxWidth: '85%',
          backgroundColor: message.isAssistant 
            ? 'rgba(255, 255, 255, 0.95)' 
            : 'rgba(59, 130, 246, 0.9)',
          borderRadius: 20,
          paddingHorizontal: 16,
          paddingVertical: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
          elevation: 4,
        }}
      >
        {message.isAssistant && (
          <Text style={{ fontSize: 11, color: '#666', marginBottom: 4, fontWeight: '600' }}>
            Weather Assistant 🤖
          </Text>
        )}
        {message.isLoading ? (
          <Text style={{ fontSize: 14, color: '#666' }}>Thinking...</Text>
        ) : (
          <Text
            style={{
              fontSize: 14,
              color: message.isAssistant ? '#333' : '#fff',
              lineHeight: 20,
            }}
          >
            {message.text}
          </Text>
        )}
        <Text
          style={{
            fontSize: 10,
            color: message.isAssistant ? '#999' : 'rgba(255, 255, 255, 0.7)',
            marginTop: 4,
            textAlign: 'right',
          }}
        >
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  )
}

// Floating Chat Input Component
const FloatingChatInput = ({ 
  onSendMessage, 
  disabled 
}: { 
  onSendMessage: (message: string) => void
  disabled: boolean 
}) => {
  const [inputText, setInputText] = useState('')
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    const keyboardDidShow = (event: any) => setKeyboardHeight(event.endCoordinates.height)
    const keyboardDidHide = () => setKeyboardHeight(0)

    const showSubscription = Keyboard.addListener('keyboardDidShow', keyboardDidShow)
    const hideSubscription = Keyboard.addListener('keyboardDidHide', keyboardDidHide)

    return () => {
      showSubscription?.remove()
      hideSubscription?.remove()
    }
  }, [])

  const handleSend = () => {
    if (inputText.trim() && !disabled) {
      onSendMessage(inputText.trim())
      setInputText('')
    }
  }

  return (
    <View
      style={{
        position: 'absolute',
        bottom: keyboardHeight + 20,
        left: 16,
        right: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
      }}
    >
      <TextInput
        style={{
          flex: 1,
          fontSize: 16,
          color: '#333',
          paddingVertical: 8,
          paddingHorizontal: 12,
        }}
        placeholder="Ask about the weather..."
        placeholderTextColor="rgba(0, 0, 0, 0.5)"
        value={inputText}
        onChangeText={setInputText}
        multiline
        maxLength={200}
        editable={!disabled}
      />
      <TouchableOpacity
        style={{
          backgroundColor: inputText.trim() && !disabled ? '#3b82f6' : 'rgba(0, 0, 0, 0.3)',
          borderRadius: 20,
          paddingHorizontal: 16,
          paddingVertical: 10,
          marginLeft: 8,
        }}
        onPress={handleSend}
        disabled={!inputText.trim() || disabled}
      >
        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>Send</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function WeatherAssistantPage() {
  const router = useRouter()
  const scrollViewRef = useRef<ScrollView>(null)
  const { data: weather, loading, error, cityName } = useCurrentLocationWeather({
    enableAutoRefresh: true,
  })
  
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  // Get initial weather tip when weather loads
  useEffect(() => {
    if (weather?.current && messages.length === 0) {
      const { weatherCode, temperature2m } = weather.current
      const description = getWeatherDescription(weatherCode)
      
      getInitialWeatherTip(weatherCode, temperature2m, description)
    }
  }, [weather, messages.length])

  // Simplified API call for initial weather tip
  const getInitialWeatherTip = async (weatherCode: number, temperature: number, description: string) => {
    setIsProcessing(true)
    
    try {
      const WEATHER_API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000'
      const response = await fetch(`${WEATHER_API_BASE_URL}/api/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weatherCode,
          temperature,
          description,
          mode: 'initial'
        }),
      })

      if (response.ok) {
        const aiResponse = await response.json()
        const content = aiResponse.content || 'Hello! I\'m your weather assistant.'
        
        // Add initial message as single response
        const initialMessage: ChatMessage = {
          id: `initial-${Date.now()}`,
          text: content,
          isAssistant: true,
          timestamp: new Date(),
        }
        
        setMessages([initialMessage])
        
        if (aiResponse.cached) {
          console.log('✅ Used cached weather tip')
        }
      }
    } catch (error) {
      console.error('Failed to get initial weather tip:', error)
      // Fallback message
      const fallbackMessage: ChatMessage = {
        id: `fallback-${Date.now()}`,
        text: "Hi! I'm your weather assistant. I can see the current conditions and I'm here to help with any weather questions!",
        isAssistant: true,
        timestamp: new Date(),
      }
      setMessages([fallbackMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle user chat messages
  const handleSendMessage = async (userText: string) => {
    if (!weather?.current) return

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: userText,
      isAssistant: false,
      timestamp: new Date(),
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsProcessing(true)

    // Add loading message
    const loadingMessage: ChatMessage = {
      id: `loading-${Date.now()}`,
      text: '',
      isAssistant: true,
      timestamp: new Date(),
      isLoading: true,
    }
    
    setMessages(prev => [...prev, loadingMessage])

    try {
      const { weatherCode, temperature2m } = weather.current
      const description = getWeatherDescription(weatherCode)
      
      const WEATHER_API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000'
      const response = await fetch(`${WEATHER_API_BASE_URL}/api/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weatherCode,
          temperature: temperature2m,
          description,
          mode: 'chat',
          userMessage: userText,
          chatHistory: messages.slice(-6), // Send last 6 messages for context
          location: cityName
        }),
      })

      // Remove loading message
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id))

      if (response.ok) {
        const aiResponse = await response.json()
        const content = aiResponse.content || 'I\'m here to help with weather questions!'
        
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          text: content,
          isAssistant: true,
          timestamp: new Date(),
        }
        
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error('Failed to get response')
      }
    } catch (error) {
      console.error('Chat error:', error)
      // Remove loading message and add error message
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id))
      
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        text: "Sorry, I'm having trouble right now. Please try again!",
        isAssistant: true,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 100)
    }
  }, [messages])

  if (loading) {
    return (
      <LinearGradient
        colors={['#87CEEB', '#87CEFA', '#FFE4B5']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Text style={{ fontSize: 18, color: '#fff', textAlign: 'center' }}>
          Getting your weather...
        </Text>
      </LinearGradient>
    )
  }

  if (error || !weather) {
    return (
      <LinearGradient
        colors={['#FF6B6B', '#FF8E8E', '#FFA8A8']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}
      >
        <Text style={{ fontSize: 18, color: '#fff', textAlign: 'center', marginBottom: 16 }}>
          Unable to get weather data
        </Text>
        <Text style={{ fontSize: 14, color: '#fff', textAlign: 'center', opacity: 0.8 }}>
          {error || 'Please check your location settings'}
        </Text>
      </LinearGradient>
    )
  }

  const { current } = weather
  const weatherCode = current.weatherCode
  const currentTime = new Date()

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <WeatherAnimation weatherCode={weatherCode} />
      
      <ScrollView 
        ref={scrollViewRef}
        style={{ flex: 1 }} 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Compact Header Section */}
        <View style={{ paddingTop: 60, paddingHorizontal: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.9)', textAlign: 'center' }}>
            {cityName || 'Current Location'}
          </Text>
          <Text style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.7)', marginTop: 4 }}>
            {formatTime(currentTime)}
          </Text>
        </View>

        {/* Compact Weather Display */}
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={{ fontSize: 48, fontWeight: '200', color: '#fff', textAlign: 'center' }}>
            {formatTemperature(current.temperature2m)}
          </Text>
          <Text style={{ 
            fontSize: 16, 
            color: 'rgba(255, 255, 255, 0.9)', 
            textAlign: 'center',
            marginTop: 4,
            textTransform: 'capitalize'
          }}>
            {getWeatherDescription(weatherCode)}
          </Text>
        </View>

        {/* Floating Chat Messages Section */}
        <View style={{
          marginTop: 40,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          paddingTop: 20,
          minHeight: height * 0.5,
          paddingBottom: 20,
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            marginBottom: 20,
          }}>
            Weather Assistant
          </Text>

          {/* Chat Messages */}
          <View style={{ flex: 1 }}>
            {messages.map((message) => (
              <ChatMessageBubble key={message.id} message={message} />
            ))}
            
            {messages.length === 0 && !isProcessing && (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, textAlign: 'center' }}>
                  Loading weather insights...
                </Text>
              </View>
            )}
          </View>

          {/* Navigation Button */}
          <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
            <TouchableOpacity
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: 25,
                paddingVertical: 12,
                paddingHorizontal: 20,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.2)',
              }}
              onPress={() => router.push('/(tabs)')}
            >
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 14, fontWeight: '500' }}>
                View Detailed Weather →
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Floating Chat Input */}
      <FloatingChatInput 
        onSendMessage={handleSendMessage}
        disabled={isProcessing}
      />
    </KeyboardAvoidingView>
  )
}
