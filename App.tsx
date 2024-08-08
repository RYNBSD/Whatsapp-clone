import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { MD3LightTheme, PaperProvider } from "react-native-paper";
import { enableScreens } from "react-native-screens";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  AuthProvider,
  MediaLibraryProvider,
  AudioProvider,
  CameraProvider,
} from "./src/context";
import Screen from "./src/screen";

enableScreens(true);
export default function App() {
  return (
    <React.Suspense>
      <StatusBar />
      <SafeAreaProvider>
        <PaperProvider theme={MD3LightTheme}>
          <NavigationContainer>
            <AuthProvider>
              <MediaLibraryProvider>
                <AudioProvider>
                  <CameraProvider>
                    <Screen />
                  </CameraProvider>
                </AudioProvider>
              </MediaLibraryProvider>
            </AuthProvider>
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </React.Suspense>
  );
}
