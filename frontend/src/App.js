import React from "react";
import { ClerkProvider } from "@clerk/clerk-expo";
import Navigation from "./navigation/Navigation";

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <Navigation />
    </ClerkProvider>
  );
}
