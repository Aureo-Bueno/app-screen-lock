import { Text, View } from 'react-native';
import { useScreenGuard } from '../hooks/useScreendGuard';

export function Dashboard() {
  useScreenGuard('Dashboard', { required: true, timeout: 10 });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f23' }}>
      <Text style={{ fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 24 }}>Dashboard</Text>
      <Text style={{ fontSize: 14, color: '#aaa' }}>Tela sensível - requer autenticação</Text>
      <Text style={{ fontSize: 12, color: '#666', marginTop: 8 }}>Tranca após 10s de inatividade</Text>
    </View>
  );
}
