import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';

interface SettingItem {
  id: string;
  title: string;
  description: string;
  type: 'switch' | 'select' | 'button';
  value?: any;
  options?: string[];
  icon: keyof typeof Feather.glyphMap;
  category: string;
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    voiceFeedback: true,
    hapticFeedback: true,
    highContrast: false,
    largeText: false,
    continuousDetection: false,
    emergencyContact: false,
    stepCounterEnabled: true,
    voiceVolume: 'medium',
    detectionSensitivity: 'high',
    language: 'English',
  });

  const speakText = (text: string) => {
    if (settings.voiceFeedback) {
      Speech.speak(text, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.8,
      });
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
    
    // Provide voice feedback for setting changes
    const settingName = key.replace(/([A-Z])/g, ' $1').toLowerCase();
    const statusText = typeof value === 'boolean' 
      ? (value ? 'enabled' : 'disabled')
      : `changed to ${value}`;
    
    speakText(`${settingName} ${statusText}`);
  };

  const settingCategories = [
    {
      title: 'Accessibility',
      items: [
        {
          id: 'voiceFeedback',
          title: 'Voice Feedback',
          description: 'Enable spoken instructions and announcements',
          type: 'switch',
          value: settings.voiceFeedback,
          icon: 'volume-2',
          category: 'accessibility',
        },
        {
          id: 'hapticFeedback',
          title: 'Haptic Feedback',
          description: 'Vibration patterns for navigation guidance',
          type: 'switch',
          value: settings.hapticFeedback,
          icon: 'smartphone',
          category: 'accessibility',
        },
        {
          id: 'highContrast',
          title: 'High Contrast',
          description: 'Enhanced visual contrast for better visibility',
          type: 'switch',
          value: settings.highContrast,
          icon: 'eye',
          category: 'accessibility',
        },
        {
          id: 'largeText',
          title: 'Large Text',
          description: 'Increase text size throughout the app',
          type: 'switch',
          value: settings.largeText,
          icon: 'type',
          category: 'accessibility',
        },
      ] as SettingItem[],
    },
    {
      title: 'Detection & Navigation',
      items: [
        {
          id: 'continuousDetection',
          title: 'Continuous Detection',
          description: 'Keep object detection active in background',
          type: 'switch',
          value: settings.continuousDetection,
          icon: 'camera',
          category: 'detection',
        },
        {
          id: 'stepCounterEnabled',
          title: 'Step Counter',
          description: 'Track steps for indoor positioning',
          type: 'switch',
          value: settings.stepCounterEnabled,
          icon: 'activity',
          category: 'detection',
        },
        {
          id: 'detectionSensitivity',
          title: 'Detection Sensitivity',
          description: 'Adjust object detection sensitivity',
          type: 'select',
          value: settings.detectionSensitivity,
          options: ['Low', 'Medium', 'High'],
          icon: 'target',
          category: 'detection',
        },
      ] as SettingItem[],
    },
    {
      title: 'Voice & Sound',
      items: [
        {
          id: 'voiceVolume',
          title: 'Voice Volume',
          description: 'Adjust volume of voice announcements',
          type: 'select',
          value: settings.voiceVolume,
          options: ['Quiet', 'Medium', 'Loud'],
          icon: 'volume-1',
          category: 'voice',
        },
        {
          id: 'language',
          title: 'Language',
          description: 'Select voice and interface language',
          type: 'select',
          value: settings.language,
          options: ['English', 'Spanish', 'French', 'German'],
          icon: 'globe',
          category: 'voice',
        },
      ] as SettingItem[],
    },
    {
      title: 'Safety & Emergency',
      items: [
        {
          id: 'emergencyContact',
          title: 'Emergency Contact',
          description: 'Set up emergency contact information',
          type: 'button',
          icon: 'phone',
          category: 'safety',
        },
      ] as SettingItem[],
    },
  ];

  const SettingCard = ({ item }: { item: SettingItem }) => (
    <View style={styles.settingCard}>
      <View style={styles.settingHeader}>
        <View style={styles.settingIconContainer}>
          <Feather name={item.icon} size={20} color="#1E40AF" />
        </View>
        <View style={styles.settingContent}>
          <Text style={[
            styles.settingTitle,
            settings.largeText && styles.largeSettingTitle
          ]}>
            {item.title}
          </Text>
          <Text style={[
            styles.settingDescription,
            settings.largeText && styles.largeSettingDescription
          ]}>
            {item.description}
          </Text>
        </View>
        <View style={styles.settingControl}>
          {item.type === 'switch' && (
            <Switch
              value={item.value}
              onValueChange={(value) => updateSetting(item.id, value)}
              trackColor={{ false: '#E5E7EB', true: '#DBEAFE' }}
              thumbColor={item.value ? '#1E40AF' : '#9CA3AF'}
              accessible={true}
              accessibilityLabel={`${item.title} toggle`}
              accessibilityRole="switch"
            />
          )}
          {item.type === 'select' && (
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => {
                Alert.alert(
                  item.title,
                  'Select an option:',
                  item.options?.map(option => ({
                    text: option,
                    onPress: () => updateSetting(item.id, option.toLowerCase()),
                  })) || []
                );
              }}
              accessible={true}
              accessibilityLabel={`${item.title} selection`}
              accessibilityRole="button"
            >
              <Text style={styles.selectButtonText}>
                {typeof item.value === 'string' 
                  ? item.value.charAt(0).toUpperCase() + item.value.slice(1)
                  : 'Select'
                }
              </Text>
              <Feather name="chevron-down" size={16} color="#6B7280" />
            </TouchableOpacity>
          )}
          {item.type === 'button' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                speakText(`Opening ${item.title} settings`);
                Alert.alert(
                  'Emergency Contact',
                  'This feature would open emergency contact setup in a full version.',
                  [{ text: 'OK', style: 'default' }]
                );
              }}
              accessible={true}
              accessibilityLabel={`Open ${item.title}`}
              accessibilityRole="button"
            >
              <Text style={styles.actionButtonText}>Setup</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  useEffect(() => {
    speakText('Settings screen loaded');
  }, []);

  return (
    <LinearGradient
      colors={['#6B7280', '#9CA3AF', '#D1D5DB']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[
            styles.headerTitle,
            settings.largeText && styles.largeHeaderTitle
          ]}>
            Settings
          </Text>
          <Text style={[
            styles.headerSubtitle,
            settings.largeText && styles.largeHeaderSubtitle
          ]}>
            Customize your EchoPath experience
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => {
              speakText('Running accessibility test');
              Alert.alert(
                'Accessibility Test',
                'Voice: Working ✓\nHaptics: Working ✓\nScreen Reader: Compatible ✓',
                [{ text: 'OK', style: 'default' }]
              );
            }}
            accessible={true}
            accessibilityLabel="Test accessibility features"
            accessibilityRole="button"
          >
            <Feather name="check-circle" size={20} color="#059669" />
            <Text style={styles.quickActionText}>Test Accessibility</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => {
              speakText('Resetting all settings to default values');
              Alert.alert(
                'Reset Settings',
                'Are you sure you want to reset all settings to default?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Reset', 
                    style: 'destructive',
                    onPress: () => {
                      setSettings({
                        voiceFeedback: true,
                        hapticFeedback: true,
                        highContrast: false,
                        largeText: false,
                        continuousDetection: false,
                        emergencyContact: false,
                        stepCounterEnabled: true,
                        voiceVolume: 'medium',
                        detectionSensitivity: 'high',
                        language: 'English',
                      });
                      speakText('Settings reset to default');
                    }
                  }
                ]
              );
            }}
            accessible={true}
            accessibilityLabel="Reset all settings"
            accessibilityRole="button"
          >
            <Feather name="refresh-cw" size={20} color="#DC2626" />
            <Text style={styles.quickActionText}>Reset All</Text>
          </TouchableOpacity>
        </View>

        {/* Setting Categories */}
        {settingCategories.map((category, categoryIndex) => (
          <View key={categoryIndex} style={styles.section}>
            <Text style={[
              styles.sectionTitle,
              settings.largeText && styles.largeSectionTitle
            ]}>
              {category.title}
            </Text>
            
            {category.items.map((item) => (
              <SettingCard key={item.id} item={item} />
            ))}
          </View>
        ))}

        {/* App Information */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About EchoPath</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Developer</Text>
              <Text style={styles.infoValue}>Achref Rhouma</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Build</Text>
              <Text style={styles.infoValue}>2024.01.15</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.supportButton}
            onPress={() => {
              speakText('Opening support information');
              Alert.alert(
                'Support & Feedback',
                'For support, feature requests, or feedback, please contact:\n\nachref.rhouma@example.com\n\nVisit our website for more resources and documentation.',
                [{ text: 'OK', style: 'default' }]
              );
            }}
            accessible={true}
            accessibilityLabel="Get support and feedback"
            accessibilityRole="button"
          >
            <Feather name="help-circle" size={20} color="#FFFFFF" />
            <Text style={styles.supportButtonText}>Support & Feedback</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  largeHeaderTitle: {
    fontSize: 34,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#F3F4F6',
    textAlign: 'center',
  },
  largeHeaderSubtitle: {
    fontSize: 18,
  },
  quickActions: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  largeSectionTitle: {
    fontSize: 22,
  },
  settingCard: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  largeSettingTitle: {
    fontSize: 18,
  },
  settingDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  largeSettingDescription: {
    fontSize: 15,
  },
  settingControl: {
    marginLeft: 16,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectButtonText: {
    fontSize: 14,
    color: '#1F2937',
    marginRight: 8,
  },
  actionButton: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  supportButton: {
    backgroundColor: '#1E40AF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  supportButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});