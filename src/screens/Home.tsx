import { Button, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export function Home() {
  const { navigate } = useNavigation();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f23' }}>
      <Text style={{ fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 24 }}>Home</Text>
      <Text style={{ fontSize: 14, color: '#aaa', marginBottom: 32 }}>Tela pública - sem autenticação</Text>
      <Button title='IR PARA DASHBOARD' onPress={() => navigate('Dashboard')} />
    </View>
  );
}
