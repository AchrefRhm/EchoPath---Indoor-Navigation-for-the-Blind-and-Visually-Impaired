import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Vibration,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';

interface NavigationStep {
  id: string;
  instruction: string;
  distance: number;
  direction: 'straight' | 'left' | 'right' | 'up' | 'down';
  landmark?: string;
  warning?: string;
}

interface Position {
  x: number;
  y: number;
  floor: number;
}

export default function NavigationScreen() {
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0, floor: 1 });
  const [stepCount, setStepCount] = useState(0);
  const [destination, setDestination] = useState<string>('');

  const navigationSteps: NavigationStep[] = [
    {
      id: '1',
      instruction: 'Head straight down the corridor',
      distance: 10,
      direction: 'straight',
      landmark: 'Water fountain on your right',
    },
    {
      id: '2',
      instruction: 'Turn left at the intersection',
      distance: 15,
      direction: 'left',
      landmark: 'Information desk ahead',
      warning: 'Caution: Wet floor area'
    },
    {
      id: '3',
      instruction: 'Continue straight past the elevator',
      distance: 8,
      direction: 'straight',
      landmark: 'Elevator doors on your left',
    },
    {
      id: '4',
      instruction: 'Turn right towards the exit',
      distance: 12,
      direction: 'right',
      landmark: 'Exit sign visible ahead',
    },
    {
      id: '5',
      instruction: 'You have arrived at your destination',
      distance: 0,
      direction: 'straight',
      landmark: 'Main entrance doors',
    },
  ];

  const speakText = (text: string) => {
    Speech.speak(text, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.8,
    });
  };

  const generateHapticPattern = (direction: string) => {
    switch (direction) {
      case 'left':
        Vibration.vibrate([100, 100, 100, 100, 300]); // Short-short-short-LONG
        break;
      case 'right':
        Vibration.vibrate([300, 100, 100, 100, 100]); // LONG-short-short-short
        break;
      case 'straight':
        Vibration.vibrate([200, 100, 200]); // MEDIUM-pause-MEDIUM
        break;
      case 'up':
        Vibration.vibrate([100, 50, 100, 50, 100, 50, 300]); // Ascending pattern
        break;
      case 'down':
        Vibration.vibrate([300, 50, 100, 50, 100, 50, 100]); // Descending pattern
        break;
    }
  };

  const startNavigation = (dest: string) => {
    setDestination(dest);
    setIsNavigating(true);
    setCurrentStep(0);
    setStepCount(0);
    
    const firstStep = navigationSteps[0];
    speakText(`Navigation started to ${dest}. ${firstStep.instruction}. Distance: ${firstStep.distance} meters.`);
    
    if (firstStep.landmark) {
      setTimeout(() => speakText(firstStep.landmark!), 2000);
    }
    
    generateHapticPattern(firstStep.direction);
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    setCurrentStep(0);
    setDestination('');
    speakText('Navigation stopped');
    Vibration.vibrate(200);
  };

  const nextStep = () => {
    if (currentStep < navigationSteps.length - 1) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);
      
      const step = navigationSteps[nextStepIndex];
      speakText(`${step.instruction}. Distance: ${step.distance} meters.`);
      
      if (step.warning) {
        setTimeout(() => speakText(`Warning: ${step.warning}`), 1500);
      }
      
      if (step.landmark) {
        setTimeout(() => speakText(step.landmark!), 3000);
      }
      
      generateHapticPattern(step.direction);
      
      // Simulate step counting
      setStepCount(prev => prev + Math.floor(step.distance * 1.3));
    } else {
      setIsNavigating(false);
      speakText('You have arrived at your destination. Navigation complete.');
      Vibration.vibrate([100, 100, 100, 100, 100]);
    }
  };

  const repeatCurrentInstruction = () => {
    if (isNavigating && currentStep < navigationSteps.length) {
      const step = navigationSteps[currentStep];
      speakText(`Current instruction: ${step.instruction}. Distance: ${step.distance} meters.`);
      generateHapticPattern(step.direction);
    } else {
      speakText('No active navigation');
    }
  };

  const quickDestinations = [
    { id: 'exit', name: 'Main Exit', icon: 'log-out' },
    { id: 'restroom', name: 'Restroom', icon: 'home' },
    { id: 'elevator', name: 'Elevator', icon: 'arrow-up' },
    { id: 'stairs', name: 'Stairs', icon: 'arrow-up-circle' },
    { id: 'information', name: 'Information Desk', icon: 'info' },
    { id: 'emergency', name: 'Emergency Exit', icon: 'alert-triangle' },
  ];

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'left': return 'arrow-left';
      case 'right': return 'arrow-right';
      case 'straight': return 'arrow-up';
      case 'up': return 'arrow-up-circle';
      case 'down': return 'arrow-down-circle';
      default: return 'navigation';
    }
  };

  return (
    <LinearGradient
      colors={['#DC2626', '#EF4444', '#F87171']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Indoor Navigation</Text>
          <Text style={styles.headerSubtitle}>
            {isNavigating 
              ? `Navigating to ${destination}` 
              : 'Choose your destination below'
            }
          </Text>
        </View>

        {/* Navigation Status */}
        {isNavigating && (
          <View style={styles.navigationPanel}>
            <View style={styles.currentStepCard}>
              <View style={styles.stepHeader}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{currentStep + 1}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepInstruction}>
                    {navigationSteps[currentStep].instruction}
                  </Text>
                  <Text style={styles.stepDistance}>
                    Distance: {navigationSteps[currentStep].distance}m
                  </Text>
                </View>
                <Feather 
                  name={getDirectionIcon(navigationSteps[currentStep].direction) as keyof typeof Feather.glyphMap}
                  size={32} 
                  color="#DC2626" 
                />
              </View>
              
              {navigationSteps[currentStep].landmark && (
                <View style={styles.landmarkContainer}>
                  <Feather name="map-pin" size={16} color="#059669" />
                  <Text style={styles.landmarkText}>
                    {navigationSteps[currentStep].landmark}
                  </Text>
                </View>
              )}
              
              {navigationSteps[currentStep].warning && (
                <View style={styles.warningContainer}>
                  <Feather name="alert-triangle" size={16} color="#D97706" />
                  <Text style={styles.warningText}>
                    {navigationSteps[currentStep].warning}
                  </Text>
                </View>
              )}
            </View>

            {/* Navigation Controls */}
            <View style={styles.controlsContainer}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={repeatCurrentInstruction}
                accessible={true}
                accessibilityLabel="Repeat current instruction"
                accessibilityRole="button"
              >
                <Feather name="repeat" size={20} color="#FFFFFF" />
                <Text style={styles.controlButtonText}>Repeat</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.controlButton, styles.primaryButton]}
                onPress={nextStep}
                accessible={true}
                accessibilityLabel="Next step"
                accessibilityRole="button"
              >
                <Feather name="arrow-right" size={20} color="#FFFFFF" />
                <Text style={styles.controlButtonText}>Next</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.controlButton, styles.dangerButton]}
                onPress={stopNavigation}
                accessible={true}
                accessibilityLabel="Stop navigation"
                accessibilityRole="button"
              >
                <Feather name="x" size={20} color="#FFFFFF" />
                <Text style={styles.controlButtonText}>Stop</Text>
              </TouchableOpacity>
            </View>

            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>
                Step {currentStep + 1} of {navigationSteps.length}
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${((currentStep + 1) / navigationSteps.length) * 100}%` }
                  ]} 
                />
              </View>
            </View>
          </View>
        )}

        {/* Quick Destinations */}
        {!isNavigating && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Destinations</Text>
            <Text style={styles.sectionSubtitle}>
              Select where you want to go
            </Text>
            
            <View style={styles.destinationGrid}>
              {quickDestinations.map((dest) => (
                <TouchableOpacity
                  key={dest.id}
                  style={styles.destinationCard}
                  onPress={() => startNavigation(dest.name)}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={`Navigate to ${dest.name}`}
                  accessibilityHint="Double tap to start navigation"
                >
                  <View style={styles.destinationIcon}>
                    <Feather 
                      name={dest.icon as keyof typeof Feather.glyphMap} 
                      size={24} 
                      color="#DC2626" 
                    />
                  </View>
                  <Text style={styles.destinationName}>{dest.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Position Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Current Position</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Feather name="map-pin" size={16} color="#6B7280" />
              <Text style={styles.infoText}>Floor {position.floor}</Text>
            </View>
            <View style={styles.infoItem}>
              <Feather name="activity" size={16} color="#6B7280" />
              <Text style={styles.infoText}>{stepCount} steps</Text>
            </View>
            <View style={styles.infoItem}>
              <Feather name="compass" size={16} color="#6B7280" />
              <Text style={styles.infoText}>Facing North</Text>
            </View>
          </View>
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
  headerSubtitle: {
    fontSize: 16,
    color: '#FEF2F2',
    textAlign: 'center',
  },
  navigationPanel: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  currentStepCard: {
    marginBottom: 20,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepInstruction: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  stepDistance: {
    fontSize: 14,
    color: '#6B7280',
  },
  landmarkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  landmarkText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#059669',
    flex: 1,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 8,
  },
  warningText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#D97706',
    flex: 1,
    fontWeight: '500',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  controlButton: {
    flex: 1,
    backgroundColor: '#6B7280',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  primaryButton: {
    backgroundColor: '#059669',
  },
  dangerButton: {
    backgroundColor: '#DC2626',
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#DC2626',
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
  destinationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  destinationCard: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  destinationIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  destinationName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
});