import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from '@/context/AppContext';
import '@/hooks/useI18n';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              contentStyle: { backgroundColor: '#FFFFFF' },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="welcome" options={{ animation: 'fade' }} />
            <Stack.Screen name="landing" options={{ animation: 'fade' }} />
            <Stack.Screen name="login" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="otp" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="skills" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="skill-quiz" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
            <Stack.Screen name="edit-profile" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="saved-jobs" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="my-applications" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="settings" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="help" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="about" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="post-job" options={{ animation: 'slide_from_bottom' }} />
            <Stack.Screen name="job-detail" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="chat" options={{ animation: 'slide_from_right' }} />
          </Stack>
          <StatusBar style="light" />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
