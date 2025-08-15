import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  Vibration,
  AccessibilityInfo 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
  onPress: () => void;
}

export default function HomeScreen() {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [detectionStatus, setDetectionStatus] = useState('Ready');

  useEffect(() => {
    // Welcome message for screen readers and voice
    const welcomeMessage = 'Welcome to EchoPath. Your indoor navigation assistant is ready.';
    if (isVoiceEnabled) {
      setTimeout(() => {
        Speech.speak(welcomeMessage, {
          language: 'en-US',
          pitch: 1.0,
          rate: 0.8,
        });
      }, 1000);
    }
  }, []);

  const speakText = (text: string) => {
    if (isVoiceEnabled) {
      Speech.speak(text, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.8,
      });
    }
  };

  const vibrate = () => {
    Vibration.vibrate([100, 50, 100]);
  };

  const quickActions: Feature[] = [
    {
      id: 'detect',
      title: 'Object Detection',
      description: 'Identify obstacles, doors, and stairs',
      icon: 'camera',
      color: '#059669',
      onPress: () => {
        vibrate();
        speakText('Starting object detection');
        // Navigation would be handled by tab navigation
      },
    },
    {
      id: 'voice',
      title: 'Voice Commands',
      description: 'Control the app with your voice',
      icon: 'mic',
      color: '#7C3AED',
      onPress: () => {
        vibrate();
        speakText('Voice command mode activated');
      },
    },
    {
      id: 'navigate',
      title: 'Indoor Navigation',
      description: 'Step-by-step indoor guidance',
      icon: 'navigation',
      color: '#DC2626',
      onPress: () => {
        vibrate();
        speakText('Starting indoor navigation');
      },
    },
    {
      id: 'read',
      title: 'Text Reader',
      description: 'Read signs and text aloud',
      icon: 'book-open',
      color: '#D97706',
      onPress: () => {
        vibrate();
        speakText('Text reader ready');
      },
    },
  ];

  const FeatureCard = ({ feature }: { feature: Feature }) => (
    <TouchableOpacity
      style={[styles.featureCard, { borderLeftColor: feature.color }]}
      onPress={feature.onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${feature.title}. ${feature.description}`}
      accessibilityHint="Double tap to activate this feature"
    >
      <View style={styles.featureIconContainer}>
        <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
          <Feather name={feature.icon} size={28} color={feature.color} />
        </View>
      </View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{feature.title}</Text>
        <Text style={styles.featureDescription}>{feature.description}</Text>
      </View>
      <Feather name="chevron-right" size={20} color="#6B7280" />
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#1E40AF', '#3B82F6', '#60A5FA']}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        accessible={true}
        accessibilityLabel="EchoPath main screen"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle} accessibilityRole="header">
            EchoPath
          </Text>
          <Text style={styles.headerSubtitle}>
            Your Independent Navigation Assistant
          </Text>
          
          {/* Status Indicator */}
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.statusText}>System Ready</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            Quick Actions
          </Text>
          <Text style={styles.sectionSubtitle}>
            Tap any option below or use voice commands
          </Text>
          
          {quickActions.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </View>

        {/* Emergency Controls */}
        <View style={styles.emergencySection}>
          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => {
              Vibration.vibrate([200, 100, 200, 100, 200]);
              speakText('Emergency mode activated. Stay calm. Help is available.');
              Alert.alert(
                'Emergency Mode',
                'Emergency assistance features activated',
                [{ text: 'OK', style: 'default' }]
              );
            }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Emergency assistance"
            accessibilityHint="Activates emergency features and alerts"
          >
            <Feather name="alert-circle" size={24} color="#FFFFFF" />
            <Text style={styles.emergencyButtonText}>Emergency Help</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Toggle */}
        <View style={styles.settingsQuick}>
          <TouchableOpacity
            style={styles.toggleContainer}
            onPress={() => {
              setIsVoiceEnabled(!isVoiceEnabled);
              vibrate();
              speakText(isVoiceEnabled ? 'Voice feedback disabled' : 'Voice feedback enabled');
            }}
            accessible={true}
            accessibilityRole="switch"
            accessibilityState={{ checked: isVoiceEnabled }}
            accessibilityLabel="Voice feedback toggle"
          >
            <Feather 
              name={isVoiceEnabled ? "volume-2" : "volume-x"} 
              size={20} 
              color="#1E40AF" 
            />
            <Text style={styles.toggleText}>
              Voice Feedback {isVoiceEnabled ? 'On' : 'Off'}
            </Text>
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E0E7FF',
    textAlign: 'center',
    marginBottom: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIconContainer: {
    marginRight: 16,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  emergencySection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  emergencyButton: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  settingsQuick: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#1E40AF',
    fontWeight: '500',
  },
});