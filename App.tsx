import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import { enableScreens } from "react-native-screens";

enableScreens(true);
export default function App() {
  return (
    <React.StrictMode>
      <React.Suspense>
        <PaperProvider>
          <NavigationContainer>
            <View style={styles.container}>
              <Text>Open up App.tsx to start working on your app!</Text>
              <StatusBar style="auto" />
            </View>
          </NavigationContainer>
        </PaperProvider>
      </React.Suspense>
    </React.StrictMode>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
