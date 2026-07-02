import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const PIN_LENGTH = 6;

export function LockScreen() {
  const { authenticate, verifyPin, unlock, isBiometricAvailable, hasPin, setPin } = useAuth();
  const [pin, setPinState] = useState('');
  const [error, setError] = useState('');
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [newPin, setNewPin] = useState('');

  const handleBiometrics = useCallback(async () => {
    const success = await authenticate();
    if (success) {
      unlock();
    }
  }, [authenticate, unlock]);

  const handlePinSubmit = useCallback(async (enteredPin: string) => {
    if (enteredPin.length !== PIN_LENGTH) return;
    const valid = await verifyPin(enteredPin);
    if (valid) {
      setPinState('');
      setError('');
      unlock();
    } else {
      setPinState('');
      setError('PIN incorreto');
    }
  }, [verifyPin, unlock]);

  const handleNewPinSubmit = useCallback(async (enteredPin: string) => {
    if (enteredPin.length !== PIN_LENGTH) return;
    await setPin(enteredPin);
    setNewPin('');
    setPinState('');
    setIsSettingPin(false);
    unlock();
  }, [setPin, unlock]);

  const onKeyPress = useCallback((digit: string) => {
    if (isSettingPin || !hasPin) {
      const next = newPin + digit;
      if (next.length <= PIN_LENGTH) {
        setNewPin(next);
        if (next.length === PIN_LENGTH) {
          if (!hasPin) {
            setIsSettingPin(true);
          }
          handleNewPinSubmit(next);
        }
      }
    } else {
      const next = pin + digit;
      if (next.length <= PIN_LENGTH) {
        setPinState(next);
        if (next.length === PIN_LENGTH) {
          handlePinSubmit(next);
        }
      }
    }
  }, [isSettingPin, hasPin, newPin, pin, handleNewPinSubmit, handlePinSubmit]);

  const onKeyDelete = useCallback(() => {
    if (isSettingPin || !hasPin) {
      setNewPin((prev: string) => prev.slice(0, -1));
    } else {
      setPinState((prev: string) => prev.slice(0, -1));
    }
  }, [isSettingPin, hasPin]);

  const currentPin = isSettingPin || !hasPin ? newPin : pin;

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{isSettingPin || !hasPin ? '🔐' : '🔒'}</Text>
      <Text style={styles.title}>{isSettingPin || !hasPin ? 'Criar PIN' : 'Tela Bloqueada'}</Text>

      {!hasPin && !isSettingPin && (
        <Text style={styles.hint}>Crie um PIN de {PIN_LENGTH} dígitos</Text>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.dots}>
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <View key={i} style={[styles.dot, currentPin.length > i && styles.dotFilled]} />
        ))}
      </View>

      <KeyPad onPress={onKeyPress} onDelete={onKeyDelete} />

      {hasPin && !isSettingPin && isBiometricAvailable && (
        <TouchableOpacity style={styles.biometricButton} onPress={handleBiometrics}>
          <Text style={styles.biometricText}>Usar biometria</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function KeyPad({ onPress, onDelete }: { onPress: (digit: string) => void; onDelete: () => void }) {
  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', '⌫'],
  ];

  return (
    <View style={styles.keypad}>
      {keys.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map((key) => (
            <TouchableOpacity
              key={key}
              style={styles.key}
              onPress={() => {
                if (key === '⌫') onDelete();
                else if (key) onPress(key);
              }}
              activeOpacity={0.6}
            >
              <Text style={styles.keyText}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 9999,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 24,
  },
  error: {
    fontSize: 14,
    color: '#e74c3c',
    marginBottom: 12,
  },
  dots: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#555',
    backgroundColor: 'transparent',
  },
  dotFilled: {
    backgroundColor: '#4a90d9',
    borderColor: '#4a90d9',
  },
  keypad: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  key: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2d2d4a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontSize: 28,
    color: '#fff',
  },
  biometricButton: {
    marginTop: 32,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#4a90d9',
  },
  biometricText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
