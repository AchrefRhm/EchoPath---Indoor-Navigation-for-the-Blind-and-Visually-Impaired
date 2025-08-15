import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Vibration,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';

interface VoiceCommand {
  id: string;
  phrase: string;
  description: string;
  action: () => void;
  category: 'navigation' | 'detection' | 'settings' | 'emergency';
}

export default function VoiceScreen() {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [lastCommand, setLastCommand] = useState<string>('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const speakText = (text: string) => {
    if (voiceEnabled) {
      Speech.speak(text, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.8,
      });
    }
  };

  const voiceCommands: VoiceCommand[] = [
    {
      id: 'start-detection',
      phrase: 'Start detection',
      description: 'Begin object detection',
      category: 'detection',
      action: () => {
        speakText('Starting object detection');
        setLastCommand('Object detection started');
      },
    },
    {
      id: 'stop-detection',
      phrase: 'Stop detection',
      description: 'Stop object detection',
      category: 'detection',
      action: () => {
        speakText('Stopping object detection');
        setLastCommand('Object detection stopped');
      },
    },
    {
      id: 'navigate-forward',
      phrase: 'Navigate forward',
      description: 'Get directions ahead',
      category: 'navigation',
      action: () => {
        speakText('Path is clear ahead. Continue straight.');
        setLastCommand('Navigation: Continue straight');
      },
    },
    {
      id: 'navigate-left',
      phrase: 'Turn left',
      description: 'Navigate left',
      category: 'navigation',
      action: () => {
        speakText('Turn left. Door detected on your left in 3 meters.');
        Vibration.vibrate([100, 50, 100]);
        setLastCommand('Navigation: Turn left');
      },
    },
    {
      id: 'navigate-right',
      phrase: 'Turn right',
      description: 'Navigate right',
      category: 'navigation',
      action: () => {
        speakText('Turn right. Stairs detected ahead on your right.');
        Vibration.vibrate([100, 50, 100, 50, 100]);
        setLastCommand('Navigation: Turn right');
      },
    },
    {
      id: 'describe-environment',
      phrase: 'Describe environment',
      description: 'Get environment description',
      category: 'detection',
      action: () => {
        speakText('You are in a corridor. Door on the left, exit sign ahead, person walking towards you.');
        setLastCommand('Environment described');
      },
    },
    {
      id: 'read-signs',
      phrase: 'Read signs',
      description: 'Read nearby text and signs',
      category: 'detection',
      action: () => {
        speakText('Exit sign detected. Text reads: Emergency Exit, Keep Clear.');
        setLastCommand('Signs read aloud');
      },
    },
    {
      id: 'emergency-help',
      phrase: 'Emergency help',
      description: 'Activate emergency assistance',
      category: 'emergency',
      action: () => {
        Vibration.vibrate([200, 100, 200, 100, 200]);
        speakText('Emergency mode activated. Stay calm. Vibration alerts enabled.');
        setLastCommand('Emergency mode activated');
      },
    },
    {
      id: 'increase-volume',
      phrase: 'Increase volume',
      description: 'Make voice louder',
      category: 'settings',
      action: () => {
        speakText('Voice volume increased');
        setLastCommand('Volume increased');
      },
    },
    {
      id: 'decrease-volume',
      phrase: 'Decrease volume',
      description: 'Make voice quieter',
      category: 'settings',
      action: () => {
        speakText('Voice volume decreased');
        setLastCommand('Volume decreased');
      },
    },
  ];

  const startListening = () => {
    setIsListening(true);
    speakText('Listening for voice commands');
    Vibration.vibrate(50);
    
    // Simulate voice recognition (in real app, would use actual STT)
    setTimeout(() => {
      const randomCommand = voiceCommands[Math.floor(Math.random() * voiceCommands.length)];
      setRecognizedText(randomCommand.phrase);
      executeCommand(randomCommand.phrase);
      setIsListening(false);
    }, 3000);
  };

  const stopListening = () => {
    setIsListening(false);
    speakText('Stopped listening');
    Vibration.vibrate(100);
  };

  const executeCommand = (phrase: string) => {
    const command = voiceCommands.find(cmd => 
      cmd.phrase.toLowerCase() === phrase.toLowerCase()
    );
    
    if (command) {
      command.action();
    } else {
      speakText('Command not recognized. Please try again.');
      setLastCommand('Command not recognized');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'navigation': return 'navigation';
      case 'detection': return 'camera';
      case 'settings': return 'settings';
      case 'emergency': return 'alert-circle';
      default: return 'mic';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'navigation': return '#1E40AF';
      case 'detection': return '#059669';
      case 'settings': return '#7C3AED';
      case 'emergency': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const CommandCard = ({ command }: { command: VoiceCommand }) => (
    <TouchableOpacity
      style={styles.commandCard}
      onPress={() => executeCommand(command.phrase)}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Voice command: ${command.phrase}. ${command.description}`}
      accessibilityHint="Double tap to execute this command"
    >
      <View style={[
        styles.commandIcon, 
        { backgroundColor: getCategoryColor(command.category) + '20' }
      ]}>
        <Feather 
          name={getCategoryIcon(command.category) as keyof typeof Feather.glyphMap} 
          size={20} 
          color={getCategoryColor(command.category)} 
        />
      </View>
      <View style={styles.commandContent}>
        <Text style={styles.commandPhrase}>"{command.phrase}"</Text>
        <Text style={styles.commandDescription}>{command.description}</Text>
      </View>
      <View style={[
        styles.categoryBadge,
        { backgroundColor: getCategoryColor(command.category) }
      ]}>
        <Text style={styles.categoryText}>
          {command.category.charAt(0).toUpperCase() + command.category.slice(1)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    speakText('Voice commands ready. Tap the microphone to start listening.');
  }, []);

  return (
    <LinearGradient
      colors={['#7C3AED', '#A855F7', '#C084FC']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Voice Commands</Text>
          <Text style={styles.headerSubtitle}>
            Speak naturally or tap any command below
          </Text>
        </View>

        {/* Voice Control Panel */}
        <View style={styles.controlPanel}>
          <TouchableOpacity
            style={[
              styles.micButton,
              { backgroundColor: isListening ? '#DC2626' : '#FFFFFF' }
            ]}
            onPress={isListening ? stopListening : startListening}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={isListening ? 'Stop listening' : 'Start listening'}
            accessibilityHint="Voice command microphone"
          >
            <Feather 
              name={isListening ? "mic-off" : "mic"} 
              size={32} 
              color={isListening ? '#FFFFFF' : '#7C3AED'} 
            />
          </TouchableOpacity>
          
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusDot, 
              { backgroundColor: isListening ? '#10B981' : '#6B7280' }
            ]} />
            <Text style={styles.statusText}>
              {isListening ? 'Listening...' : 'Tap microphone to speak'}
            </Text>
          </View>

          {recognizedText ? (
            <View style={styles.recognitionBox}>
              <Text style={styles.recognitionLabel}>Recognized:</Text>
              <Text style={styles.recognitionText}>"{recognizedText}"</Text>
            </View>
          ) : null}

          {lastCommand ? (
            <View style={styles.lastCommandBox}>
              <Text style={styles.lastCommandLabel}>Last Action:</Text>
              <Text style={styles.lastCommandText}>{lastCommand}</Text>
            </View>
          ) : null}
        </View>

        {/* Available Commands */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Commands</Text>
          <Text style={styles.sectionSubtitle}>
            Say any of these phrases or tap to execute
          </Text>
          
          {voiceCommands.map((command) => (
            <CommandCard key={command.id} command={command} />
          ))}
        </View>

        {/* Voice Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsTitle}>Voice Settings</Text>
          
          <TouchableOpacity
            style={styles.settingToggle}
            onPress={() => {
              setVoiceEnabled(!voiceEnabled);
              speakText(voiceEnabled ? 'Voice feedback disabled' : 'Voice feedback enabled');
            }}
            accessible={true}
            accessibilityRole="switch"
            accessibilityState={{ checked: voiceEnabled }}
            accessibilityLabel="Voice feedback toggle"
          >
            <Feather 
              name={voiceEnabled ? "volume-2" : "volume-x"} 
              size={20} 
              color="#7C3AED" 
            />
            <Text style={styles.settingText}>
              Voice Feedback {voiceEnabled ? 'Enabled' : 'Disabled'}
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E0E7FF',
    textAlign: 'center',
  },
  controlPanel: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  recognitionBox: {
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    width: '100%',
  },
  recognitionLabel: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    marginBottom: 4,
  },
  recognitionText: {
    fontSize: 16,
    color: '#1F2937',
    fontStyle: 'italic',
  },
  lastCommandBox: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    width: '100%',
  },
  lastCommandLabel: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '600',
    marginBottom: 4,
  },
  lastCommandText: {
    fontSize: 14,
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
  commandCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  commandIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  commandContent: {
    flex: 1,
  },
  commandPhrase: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  commandDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  settingsSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  settingToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
});