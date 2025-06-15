import React, { createContext, useContext, useState } from 'react'
import { useColorScheme } from 'nativewind'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const { colorScheme, setColorScheme } = useColorScheme()

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    if (newTheme === 'system') {
      setColorScheme('system')
    } else {
      setColorScheme(newTheme)
    }
  }

  const toggleTheme = () => {
    const newTheme = colorScheme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }

  const isDark = colorScheme === 'dark'

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        isDark,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 