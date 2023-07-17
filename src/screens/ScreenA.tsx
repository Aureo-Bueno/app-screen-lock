import { Button, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export function ScreenA() {
  const { navigate } = useNavigation();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title='IR PARA TELA A' onPress={() => navigate('screenA')} />
    </View>
  );
}
