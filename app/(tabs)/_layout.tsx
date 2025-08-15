import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1E40AF',
          borderTopColor: '#3B82F6',
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 25 : 8,
        },
        tabBarActiveTintColor: '#FEF3C7',
        tabBarInactiveTintColor: '#93C5FD',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarAccessibilityLabel: 'Main navigation',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Feather name="home" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: 'Home tab',
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Detection',
          tabBarIcon: ({ size, color }) => (
            <Feather name="camera" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: 'Object detection camera',
        }}
      />
      <Tabs.Screen
        name="voice"
        options={{
          title: 'Voice',
          tabBarIcon: ({ size, color }) => (
            <Feather name="mic" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: 'Voice commands',
        }}
      />
      <Tabs.Screen
        name="navigation"
        options={{
          title: 'Navigate',
          tabBarIcon: ({ size, color }) => (
            <Feather name="navigation" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: 'Indoor navigation',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Feather name="settings" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: 'App settings',
        }}
      />
    </Tabs>
  );
}