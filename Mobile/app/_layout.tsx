import { Stack } from "expo-router";
import './global.css';
import { StatusBar } from "react-native";
import { PlayerProvider } from './Context/PlayerContext';
export default function RootLayout() {
  return (
    <>
      <PlayerProvider>
        <StatusBar hidden={true} />
        <Stack >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="movies/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="auth/LoginPage" options={{ headerShown: false }} />
          <Stack.Screen name="auth/SignUpPage" options={{ headerShown: false }} />
          <Stack.Screen name="music/index" options={{ headerShown: false }} />
          <Stack.Screen name="music/search" options={{ headerShown: false }} />
          <Stack.Screen name="music/playPage/[id]" options={{ headerShown: false }} />
        </Stack>
      </PlayerProvider>
    </>
  )
}
