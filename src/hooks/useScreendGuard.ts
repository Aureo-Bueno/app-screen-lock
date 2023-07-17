import { useEffect, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { useNavigationState } from '@react-navigation/native';

export function useScreenGuard(screenName: string) {
  const navigationState = useNavigationState(state => state);
  const [sessionTime, setSessionTime] = useState<number>(0);

  async function handleAuthentication() {
    const auth = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Sessão Expirada'
    });

    if(auth.success) {
        setSessionTime(0);
    }else {
      handleAuthentication();
    }
  }

  useEffect(() => {
    if(sessionTime < 10) {
      const timer = setTimeout(() => {
        setSessionTime(prevState => prevState + 1);
      }, 1000);

      return () => clearTimeout(timer);
    }else {
      if(navigationState.routes) {
        const currentScreen = navigationState.routes[navigationState.index];

        if(currentScreen.name === screenName) {
          handleAuthentication();
        }
      }
    }
  }, [sessionTime]);
}
