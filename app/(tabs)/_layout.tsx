import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // Hides the bar completely
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Truth or Dare' }} />
    </Tabs>
  );
}
