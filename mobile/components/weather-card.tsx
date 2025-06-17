import React from 'react'
import { View } from 'react-native'
import { Card } from './ui/card'
import { Large, Muted } from './ui/typography'

interface WeatherCardProps {
  icon: React.ReactNode
  title: string
  value: string
  subtitle?: string
  color?: string
}

export function WeatherCard({ icon, title, value, subtitle, color }: WeatherCardProps) {
  return (
    <Card className="flex-1 p-4">
      <View className="items-center space-y-2">
        {icon}
        <Muted className="text-center text-xs">{title}</Muted>
        <Large className="text-center font-bold" style={color ? { color } : {}}>
          {value}
        </Large>
        {subtitle && <Muted className="text-center text-xs">{subtitle}</Muted>}
      </View>
    </Card>
  )
} 