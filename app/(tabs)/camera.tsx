import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Vibration,
  Dimensions,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Feather } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

const { width, height } = Dimensions.get('window');

interface DetectedObject {
  id: string;
  type: 'door' | 'stairs' | 'obstacle' | 'person' | 'sign';
  confidence: number;
  position: { x: number; y: number };
  distance: 'near' | 'medium' | 'far';
}

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const [lastAnnouncement, setLastAnnouncement] = useState<string>('');
  
  const cameraRef = useRef<CameraView>(null);
  const detectionInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
    };
  }, []);

  const speakText = (text: string) => {
    if (text !== lastAnnouncement) {
      Speech.speak(text, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.9,
      });
      setLastAnnouncement(text);
    }
  };

  const generateHapticFeedback = (objectType: string, distance: string) => {
    switch (distance) {
      case 'near':
        Vibration.vibrate([100, 50, 100, 50, 100]);
        break;
      case 'medium':
        Vibration.vibrate([200, 100, 200]);
        break;
      case 'far':
        Vibration.vibrate([300]);
        break;
    }
  };

  // Simulate object detection (in real implementation, this would use TensorFlow Lite)
  const simulateDetection = () => {
    const objectTypes: DetectedObject['type'][] = ['door', 'stairs', 'obstacle', 'person', 'sign'];
    const distances: DetectedObject['distance'][] = ['near', 'medium', 'far'];
    
    const randomObjects: DetectedObject[] = Math.random() > 0.3 ? [
      {
        id: Math.random().toString(),
        type: objectTypes[Math.floor(Math.random() * objectTypes.length)],
        confidence: 0.7 + Math.random() * 0.3,
        position: { 
          x: Math.random() * width, 
          y: Math.random() * height 
        },
        distance: distances[Math.floor(Math.random() * distances.length)],
      }
    ] : [];

    setDetectedObjects(randomObjects);

    // Announce detected objects
    if (randomObjects.length > 0) {
      const obj = randomObjects[0];
      const announcement = `${obj.type} detected ${obj.distance === 'near' ? 'very close' : obj.distance} ahead`;
      speakText(announcement);
      generateHapticFeedback(obj.type, obj.distance);
    }
  };

  const startDetection = () => {
    setIsDetecting(true);
    speakText('Object detection started');
    
    detectionInterval.current = setInterval(() => {
      simulateDetection();
    }, 2000);
  };

  const stopDetection = () => {
    setIsDetecting(false);
    speakText('Object detection stopped');
    
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
    }
    setDetectedObjects([]);
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
    speakText(`Switched to ${facing === 'back' ? 'front' : 'back'} camera`);
    Vibration.vibrate(100);
  };

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          EchoPath needs camera access to detect objects and provide navigation assistance.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
          accessible={true}
          accessibilityLabel="Grant camera permission"
          accessibilityRole="button"
        >
          <Feather name="camera" size={20} color="#FFFFFF" />
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing={facing}
        ref={cameraRef}
      >
        {/* Object Detection Overlay */}
        {detectedObjects.map((obj) => (
          <View
            key={obj.id}
            style={[
              styles.detectionBox,
              {
                left: obj.position.x - 50,
                top: obj.position.y - 25,
                borderColor: obj.distance === 'near' ? '#DC2626' : 
                           obj.distance === 'medium' ? '#D97706' : '#059669',
              }
            ]}
          >
            <Text style={styles.detectionLabel}>
              {obj.type.toUpperCase()}
            </Text>
            <Text style={styles.distanceLabel}>
              {obj.distance.toUpperCase()}
            </Text>
          </View>
        ))}

        {/* Top Status Bar */}
        <View style={styles.statusBar}>
          <View style={styles.statusIndicator}>
            <View style={[
              styles.statusDot, 
              { backgroundColor: isDetecting ? '#10B981' : '#6B7280' }
            ]} />
            <Text style={styles.statusText}>
              {isDetecting ? 'Detecting' : 'Standby'}
            </Text>
          </View>
        </View>

        {/* Control Panel */}
        <View style={styles.controlPanel}>
          {/* Detection Toggle */}
          <TouchableOpacity
            style={[
              styles.controlButton,
              styles.detectionButton,
              { backgroundColor: isDetecting ? '#DC2626' : '#059669' }
            ]}
            onPress={isDetecting ? stopDetection : startDetection}
            accessible={true}
            accessibilityLabel={isDetecting ? 'Stop object detection' : 'Start object detection'}
            accessibilityRole="button"
          >
            <Feather 
              name={isDetecting ? "stop-circle" : "play-circle"} 
              size={24} 
              color="#FFFFFF" 
            />
            <Text style={styles.controlButtonText}>
              {isDetecting ? 'Stop' : 'Start'}
            </Text>
          </TouchableOpacity>

          {/* Camera Flip */}
          <TouchableOpacity
            style={[styles.controlButton, styles.secondaryButton]}
            onPress={toggleCameraFacing}
            accessible={true}
            accessibilityLabel="Switch camera"
            accessibilityRole="button"
          >
            <Feather name="rotate-cw" size={24} color="#1E40AF" />
            <Text style={styles.secondaryButtonText}>Flip</Text>
          </TouchableOpacity>

          {/* Voice Description */}
          <TouchableOpacity
            style={[styles.controlButton, styles.secondaryButton]}
            onPress={() => {
              const description = detectedObjects.length > 0 
                ? `Currently detecting ${detectedObjects.length} objects in view`
                : 'No objects currently detected';
              speakText(description);
            }}
            accessible={true}
            accessibilityLabel="Describe current view"
            accessibilityRole="button"
          >
            <Feather name="volume-2" size={24} color="#1E40AF" />
            <Text style={styles.secondaryButtonText}>Describe</Text>
          </TouchableOpacity>
        </View>

        {/* Detection Info Panel */}
        {detectedObjects.length > 0 && (
          <View style={styles.infoPanel}>
            <Text style={styles.infoPanelTitle}>Objects Detected</Text>
            {detectedObjects.map((obj) => (
              <View key={obj.id} style={styles.infoItem}>
                <Text style={styles.infoItemText}>
                  {obj.type.charAt(0).toUpperCase() + obj.type.slice(1)} - {obj.distance}
                </Text>
                <Text style={styles.confidenceText}>
                  {Math.round(obj.confidence * 100)}% confident
                </Text>
              </View>
            ))}
          </View>
        )}
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F3F4F6',
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  permissionText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#1E40AF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  statusBar: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  statusIndicator: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
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
  detectionBox: {
    position: 'absolute',
    width: 100,
    height: 50,
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detectionLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  distanceLabel: {
    color: '#FFFFFF',
    fontSize: 8,
  },
  controlPanel: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  detectionButton: {
    backgroundColor: '#059669',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  secondaryButtonText: {
    color: '#1E40AF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  infoPanel: {
    position: 'absolute',
    bottom: 140,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    padding: 16,
  },
  infoPanelTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoItem: {
    marginBottom: 8,
  },
  infoItemText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  confidenceText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
});