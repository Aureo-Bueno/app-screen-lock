import { Text, View } from 'react-native';
import { useScreenGuard } from '../hooks/useScreendGuard';

export function ScreenB() {
  useScreenGuard('screenB'); 
 
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 32 }}>Tela B</Text>
    </View>
  );
}
