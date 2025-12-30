import React, { useCallback } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useSignIn, useOAuth } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const SignInScreen = ({ navigation }) => {
  const { isLoaded } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onSignInWithGoogle = useCallback(async () => {
    if (!isLoaded) return;

    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        // Navigation handled by useAuth() in Navigation.js
      }
    } catch (err) {
      console.error("Sign in error:", JSON.stringify(err, null, 2));
    }
  }, [isLoaded, startOAuthFlow]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SnapMap</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <TouchableOpacity style={styles.button} onPress={onSignInWithGoogle}>
        <Text style={styles.buttonText}>Sign In with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate("SignUpScreen")}
      >
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#4285F4",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkButton: {
    marginTop: 10,
  },
  linkText: {
    color: "#4285F4",
    fontSize: 14,
  },
});

export default SignInScreen;
