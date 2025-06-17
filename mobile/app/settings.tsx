import React from 'react';
import { View, ScrollView, Pressable, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';

import { useSettingsStore } from '~/lib/settings-store';
import { useColorScheme } from '~/lib/useColorScheme';
import { H2, Muted } from '~/components/ui/typography';

import {
  ThemeSelector,
  UnitsSection,
  LocationDataSection,
  NotificationsSection,
  SettingsSection,
  SettingsLoading,
  SettingsRow,
} from '~/components/settings';
import { NotificationTest } from '~/components/NotificationTest';

export default function SettingsScreen() {
  const { isDarkColorScheme } = useColorScheme();
  const { isHydrated, resetToDefaults } = useSettingsStore();

  // Show loading while hydrating
  if (!isHydrated) {
    return <SettingsLoading />;
  }

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to their default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetToDefaults();
            Alert.alert('Success', 'Settings have been reset to defaults.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <Stack.Screen
        options={{
          title: '🔧 Settings',
          headerShown: true,
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              className="mr-4 rounded-full p-2 active:bg-muted">
              <ArrowLeft size={24} color={isDarkColorScheme ? '#f9fafb' : '#111827'} />
            </Pressable>
          ),
          headerStyle: {
            backgroundColor: isDarkColorScheme ? '#111827' : '#f9fafb',
          },
          headerTintColor: isDarkColorScheme ? '#f9fafb' : '#111827',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 80,
        }}
        showsVerticalScrollIndicator={false}
        bounces={true}>

        {/* Theme Section */}
          <ThemeSelector />

        {/* Units Section */}
        <SettingsSection>
          <UnitsSection />
        </SettingsSection>

        {/* Location & Data Section */}
        <SettingsSection>
          <LocationDataSection />
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection>
          <NotificationsSection />
        </SettingsSection>

        {/* Notification Test Section */}
        <NotificationTest />

        {/* Reset Section */}
        <SettingsSection className="mb-0">
          <SettingsRow
            title="Reset to Defaults"
            subtitle="Restore all settings to their default values"
            icon="refresh-cw"
            onPress={handleResetSettings}
            showChevron
          />
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
}
