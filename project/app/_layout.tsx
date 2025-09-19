import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center' }}>
      <View style={{ flex: 1, width: '100%', maxWidth: 600, backgroundColor: '#111' }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="+not-found" />
        </Stack>
      </View>
      <StatusBar style="light" backgroundColor="#000" />
    </View>
  );
}
