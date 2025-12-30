import React, { useCallback } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useSignUp, useOAuth } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const SignUpScreen = ({ navigation }) => {
  const { isLoaded } = useSignUp();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onSignUpWithGoogle = useCallback(async () => {
    if (!isLoaded) return;

    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        // Navigation handled by useAuth() in Navigation.js
      }
    } catch (err) {
      console.error("Sign up error:", JSON.stringify(err, null, 2));
    }
  }, [isLoaded, startOAuthFlow]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join SnapMap today</Text>

      <TouchableOpacity style={styles.button} onPress={onSignUpWithGoogle}>
        <Text style={styles.buttonText}>Sign Up with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate("SignInScreen")}
      >
        <Text style={styles.linkText}>Already have an account? Sign In</Text>
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

export default SignUpScreen;
