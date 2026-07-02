import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const PIN_STORAGE_KEY = 'app_screen_lock_pin';

export interface AuthConfig {
  maxSessionTime: number;
}

export interface AuthContextType {
  isLocked: boolean;
  isInitialized: boolean;
  lock: () => void;
  unlock: () => void;
  resetSession: () => void;
  config: AuthConfig;
  updateConfig: (config: Partial<AuthConfig>) => void;
  hasPin: boolean;
  setPin: (pin: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<boolean>;
  authenticate: () => Promise<boolean>;
  isBiometricAvailable: boolean;
}

const defaultConfig: AuthConfig = {
  maxSessionTime: 10,
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLocked, setIsLocked] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [config, setConfig] = useState<AuthConfig>(defaultConfig);
  const [hasPin, setHasPin] = useState(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    (async () => {
      const storedPin = await SecureStore.getItemAsync(PIN_STORAGE_KEY);
      setHasPin(!!storedPin);
      const hasBiometrics = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricAvailable(hasBiometrics && enrolled);
      setIsInitialized(true);
    })();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appStateRef.current.match(/active|inactive/) && nextAppState === 'background') {
        lock();
      }
      appStateRef.current = nextAppState;
    });
    return () => subscription.remove();
  }, []);

  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSessionTime(0);
    intervalRef.current = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isLocked) {
      startTimer();
    } else {
      stopTimer();
    }
  }, [isLocked, startTimer, stopTimer]);

  useEffect(() => {
    if (!isLocked && sessionTime >= config.maxSessionTime) {
      lock();
    }
  }, [sessionTime, config.maxSessionTime, isLocked]);

  const lock = useCallback(() => {
    setIsLocked(true);
  }, []);

  const unlock = useCallback(() => {
    setIsLocked(false);
    setSessionTime(0);
  }, []);

  const resetSession = useCallback(() => {
    setSessionTime(0);
  }, []);

  const updateConfig = useCallback((newConfig: Partial<AuthConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  const setPin = useCallback(async (pin: string) => {
    await SecureStore.setItemAsync(PIN_STORAGE_KEY, pin);
    setHasPin(true);
  }, []);

  const verifyPin = useCallback(async (pin: string): Promise<boolean> => {
    const storedPin = await SecureStore.getItemAsync(PIN_STORAGE_KEY);
    return storedPin === pin;
  }, []);

  const authenticate = useCallback(async (): Promise<boolean> => {
    if (isBiometricAvailable) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Desbloqueie o app',
        cancelLabel: 'Usar PIN',
      });
      if (result.success) return true;
    }
    return false;
  }, [isBiometricAvailable]);

  return (
    <AuthContext.Provider
      value={{
        isLocked,
        isInitialized,
        lock,
        unlock,
        resetSession,
        config,
        updateConfig,
        hasPin,
        setPin,
        verifyPin,
        authenticate,
        isBiometricAvailable,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
