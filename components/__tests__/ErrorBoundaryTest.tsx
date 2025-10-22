import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * Test component to verify ErrorBoundary functionality
 *
 * IMPORTANT: This is for testing purposes only. Remove or disable in production!
 *
 * Usage:
 * 1. Import this component in a screen
 * 2. Add <ErrorBoundaryTest /> to the render
 * 3. Click the buttons to trigger errors
 * 4. Verify ErrorBoundary catches and displays error UI
 */

// Component that throws on render
const CrashingComponent: React.FC<{ shouldCrash: boolean }> = ({ shouldCrash }) => {
  if (shouldCrash) {
    throw new Error('Test Error: Component intentionally crashed!');
  }
  return <Text style={styles.successText}>Component rendered successfully</Text>;
};

// Component that throws on async operation
const AsyncCrashingComponent: React.FC = () => {
  const [error, setError] = useState(false);

  const triggerAsyncError = async () => {
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 100));
    setError(true);
  };

  if (error) {
    throw new Error('Test Error: Async operation failed!');
  }

  return (
    <TouchableOpacity style={styles.asyncButton} onPress={triggerAsyncError}>
      <Text style={styles.buttonText}>Trigger Async Error</Text>
    </TouchableOpacity>
  );
};

const ErrorBoundaryTest: React.FC = () => {
  const [shouldCrash, setShouldCrash] = useState(false);
  const [showAsyncCrasher, setShowAsyncCrasher] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ErrorBoundary Test Component</Text>
      <Text style={styles.subtitle}>
        Use these buttons to test error handling (DEV ONLY)
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.dangerButton]}
          onPress={() => setShouldCrash(true)}
        >
          <Text style={styles.buttonText}>Trigger Render Error</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.warningButton]}
          onPress={() => setShowAsyncCrasher(true)}
        >
          <Text style={styles.buttonText}>Show Async Crasher</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.infoButton]}
          onPress={() => {
            setShouldCrash(false);
            setShowAsyncCrasher(false);
          }}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.testArea}>
        {showAsyncCrasher ? (
          <AsyncCrashingComponent />
        ) : (
          <CrashingComponent shouldCrash={shouldCrash} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'column',
    marginBottom: 20,
  },
  button: {
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
  },
  dangerButton: {
    backgroundColor: '#d32f2f',
  },
  warningButton: {
    backgroundColor: '#f57c00',
  },
  infoButton: {
    backgroundColor: '#0288d1',
  },
  asyncButton: {
    backgroundColor: '#f57c00',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  testArea: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ErrorBoundaryTest;
