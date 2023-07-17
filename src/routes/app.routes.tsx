import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScreenA } from '../screens/ScreenA';
import { ScreenB } from '../screens/ScreenB';

const { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes() {
  return(
    <Navigator screenOptions={{ headerShown: false }}>
        <Screen name='screenA' component={ScreenA} />
        <Screen name='screenB' component={ScreenB} />
    </Navigator>
  );
}