import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Input } from "../../src/components/ui";
import { spacing, typography } from "../../src/constants/theme";
import { useAuth } from "../../src/context";
import { useGoogleAuth, useLogin } from "../../src/hooks/useAuthHooks";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { refreshUser } = useAuth();
  const mutation = useLogin();
  const googleMutation = useGoogleAuth();

  const [_request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  });

  React.useEffect(() => {
    if (response?.type === "success" && response.authentication?.idToken) {
      const idToken = response.authentication.idToken;
      (async () => {
        try {
          await googleMutation.mutateAsync({ idToken });
          await refreshUser();
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : "Google sign-in failed";
          Alert.alert("Google Sign-In Error", msg);
        }
      })();
    }
  }, [response, googleMutation, refreshUser]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password.trim()) e.password = "Password is required";
    else if (password.length < 6) e.password = "Minimum 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    try {
      await mutation.mutateAsync({ email, password });
      await refreshUser();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Login failed";
      Alert.alert("Login Error", msg);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── HEADER (scrolls with content) ── */}
          <View
            style={[styles.topSection, { paddingTop: insets.top + spacing.md }]}
          >
            <View style={styles.blobTopRight} />
            <View style={styles.blobBottomLeft} />

            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
            >
              {/* <Text style={styles.backText}>← Back</Text> */}
            </TouchableOpacity>

            <View>
              <Text style={styles.logoEmoji}>🩸</Text>
            </View>

            <Text style={styles.heading}>
              Welcome back<Text style={styles.headingAccent}>.</Text>
            </Text>
            <Text style={styles.subheading}>Sign in to SangRoot</Text>
          </View>

          {/* ── FORM ── */}
          <View style={styles.formContent}>
            <Input
              label="Email Address"
              icon="mail-outline"
              placeholder="name@hospital.com"
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                if (errors.email)
                  setErrors((p) => ({ ...p, email: undefined }));
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              error={errors.email}
            />

            <Input
              label="Password"
              icon="lock-closed-outline"
              placeholder="••••••••"
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                if (errors.password)
                  setErrors((p) => ({ ...p, password: undefined }));
              }}
              secureTextEntry
              secureToggle
              error={errors.password}
              rightAction={{
                text: "Forgot?",
                onPress: () =>
                  Alert.alert("Info", "Password reset coming soon"),
              }}
            />

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={mutation.isLoading}
              disabled={mutation.isLoading}
              size="lg"
              style={styles.submitBtn}
            />

            {/* Google Sign-In */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.googleBtn}
              onPress={() => promptAsync()}
              disabled={googleMutation.isLoading}
              activeOpacity={0.8}
            >
              {googleMutation.isLoading ? (
                <ActivityIndicator size="small" color="#4285F4" />
              ) : (
                <Text style={styles.googleIcon}>G</Text>
              )}
              <Text style={styles.googleBtnText}>Continue with Google</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>DON'T HAVE AN ACCOUNT?</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              title="Register Organisation"
              variant="outline"
              icon="business-outline"
              onPress={() => router.push("/(auth)/register")}
            />
            <Button
              title="Accept Doctor Invite"
              variant="ghost"
              icon="mail-open-outline"
              onPress={() => router.push("/(auth)/accept-invite")}
              style={styles.ghostBtn}
            />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const ORANGE = "#F05A28";

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: "#F7F7F8" },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },

  /* ── HEADER ── */
  topSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: spacing["2xl"],
    paddingBottom: spacing["2xl"],
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  blobTopRight: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(240,90,40,0.09)",
  },
  blobBottomLeft: {
    position: "absolute",
    bottom: -30,
    left: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(240,90,40,0.06)",
  },

  backBtn: { marginBottom: spacing.lg },
  backText: {
    fontSize: typography.fontSize.sm,
    color: "#8A8A9A",
    fontWeight: typography.fontWeight.medium,
  },
  logoMark: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  logoEmoji: { fontSize: 20 },
  heading: {
    fontSize: 30,
    fontWeight: "700",
    color: "#1A1A2E",
    letterSpacing: -0.5,
    lineHeight: 34,
    marginBottom: spacing.xs,
  },
  headingAccent: { color: ORANGE },
  subheading: { fontSize: typography.fontSize.sm, color: "#8A8A9A" },

  /* ── FORM ── */
  formContent: {
    padding: spacing["2xl"],
    gap: spacing.lg,
    paddingBottom: spacing["3xl"],
  },
  submitBtn: { marginTop: spacing.sm },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginVertical: spacing.xs,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E8E8F0" },
  dividerText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: "#8A8A9A",
    letterSpacing: 0.8,
  },
  ghostBtn: { marginTop: -spacing.xs },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4285F4",
  },
  googleBtnText: {
    fontSize: typography.fontSize.base,
    fontWeight: "600",
    color: "#3C4043",
  },
});
