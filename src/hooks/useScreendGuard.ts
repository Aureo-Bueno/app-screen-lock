import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

export interface ScreenGuardOptions {
  required?: boolean;
  timeout?: number;
}

export function useScreenGuard(screenName: string, options?: ScreenGuardOptions) {
  const { lock, resetSession, isLocked, config, updateConfig } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (options?.required) {
        lock();
      }

      resetSession();

      if (options?.timeout && options.timeout !== config.maxSessionTime) {
        updateConfig({ maxSessionTime: options.timeout });
      }
    });

    return unsubscribe;
  }, [navigation, lock, resetSession, options?.timeout, options?.required, config.maxSessionTime, updateConfig]);

  return { isLocked };
}
