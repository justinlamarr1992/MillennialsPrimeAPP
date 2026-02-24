import React, { useState, useEffect, useCallback } from "react";
import { Link } from "expo-router";
import {
  useColorScheme,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  Image,
} from "react-native";
import Constants from "expo-constants";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import auth from "@react-native-firebase/auth";
import { validateEmail } from "@/utils/validation";
import { handleAuthError } from "@/utils/errorHandler";
import { logger } from "@/utils/logger";
import { serverAuth } from "@/services/serverAuth";
import { userProfileService } from "@/services/userProfileService";
import { setWelcomeUser } from "@/utils/loginFlag";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  useEffect(() => {
    if (email.length > 0) {
      setEmailError(validateEmail(email));
    } else {
      setEmailError(null);
    }
  }, [email]);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const isFormValid = email.trim().length > 0 && password.trim().length > 0 && !emailError;

  const loginToServerWithSync = useCallback(async (): Promise<void> => {
    logger.log("🔐 Authenticating with MongoDB server...");
    try {
      await serverAuth.loginToServer(email, password);
      logger.log("✅ MongoDB authentication successful");
    } catch (mongoError: unknown) {
      const status = (mongoError as { response?: { status?: number } })?.response?.status;
      if (status !== 401) {
        logger.error("❌ MongoDB authentication failed:", mongoError);
        setErrMsg("Warning: Could not connect to server. Some features may be limited.");
        return;
      }
      logger.log("🔄 MongoDB 401 detected — attempting password sync...");
      const currentUser = auth().currentUser;
      if (!currentUser) {
        setErrMsg(
          "Your password was recently reset. Please sign out and back in, or contact support."
        );
        return;
      }
      const idToken = await currentUser.getIdToken();

      try {
        await serverAuth.syncPassword(idToken, password);
      } catch (syncError: unknown) {
        logger.error("❌ Password sync failed:", syncError);
        setErrMsg(
          "Your password was recently reset. Please sign out and back in, or contact support."
        );
        return;
      }

      logger.log("✅ Password sync complete, retrying server login...");
      try {
        await serverAuth.loginToServer(email, password);
        logger.log("✅ MongoDB authentication successful after sync");
      } catch (retryError: unknown) {
        logger.error("❌ MongoDB login failed after successful sync:", retryError);
        setErrMsg("Password sync completed but server connection failed. Please try again.");
      }
    }
  }, [email, password]);

  const handleSubmit = async () => {
    if (emailError || email.trim().length === 0 || password.trim().length === 0) {
      setErrMsg("Please enter a valid email and password");
      return;
    }

    setLoading(true);
    setErrMsg("");

    try {
      logger.log("🔐 Signing in with Firebase...");
      await auth().signInWithEmailAndPassword(email, password);
      logger.log("✅ Firebase sign-in successful");

      await loginToServerWithSync();

      try {
        const profile = await userProfileService.fetchProfile();
        setWelcomeUser(profile.firstName ?? email.split("@")[0]);
      } catch (err: unknown) {
        logger.error("Failed to fetch user profile after sign-in:", err);
        setWelcomeUser(email.split("@")[0]);
      }

      // Navigation handled automatically by root layout auth listener
    } catch (error) {
      const firebaseError = error as { code: string; message: string };
      const errorMessage = handleAuthError(firebaseError);
      setErrMsg(errorMessage);
      logger.error("❌ Sign in error:", firebaseError.code, firebaseError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      enabled={true}
      style={globalStyles.flex1}
    >
      <ScrollView
        contentContainerStyle={[
          globalStyles.container,
          globalStyles.padding,
          globalStyles.flexColumn,
          globalStyles.flexAlignItemsCenter,
          globalStyles.flexJustifyContentSpaceEvenly,
          { backgroundColor: colors["background"] },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require("@/assets/images/MillennialsPrimeLogoNB.png")}
          style={globalStyles.imageLoading}
        />
        <Text style={[globalStyles.textLoading, { color: colors["loadingTextOppo"] }]}>
          Welcome to Millennial's Prime
        </Text>

        <View style={[globalStyles.signInForm, globalStyles.padding, { width: "100%" }]}>
          <View style={globalStyles.labelInput}>
            <Text style={[globalStyles.labelText, { color: colors["text"] }]}>Email</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Enter Email"
              placeholderTextColor={colors["plcHoldText"]}
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => setEmail(text)}
              autoCapitalize="none"
              testID="signin-email-input"
            />
            {emailError && (
              <Text
                style={[
                  globalStyles.errorText,
                  { color: colors["secC"], fontSize: 12, marginTop: 4 },
                ]}
              >
                {emailError}
              </Text>
            )}
          </View>

          <View style={globalStyles.labelInput}>
            <Text style={[globalStyles.labelText, { color: colors["text"] }]}>Password</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Enter Password"
              placeholderTextColor={colors["plcHoldText"]}
              secureTextEntry={true}
              textContentType="none"
              autoComplete="off"
              autoCapitalize="none"
              value={password}
              onChangeText={(text) => setPassword(text)}
              testID="signin-password-input"
            />
          </View>

          {loading ? (
            <ActivityIndicator size="small" style={{ margin: 28 }} />
          ) : (
            <Pressable
              style={[
                globalStyles.button,
                globalStyles.marginVertical,
                {
                  backgroundColor: !isFormValid ? colors["disabledButton"] : colors["triC"],
                },
              ]}
              disabled={!isFormValid}
              onPress={handleSubmit}
            >
              <Text style={globalStyles.buttonText}>Login</Text>
            </Pressable>
          )}

          <Text style={[globalStyles.errorText, { color: colors["secC"] }]}>{errMsg}</Text>

          <Link href="/(auth)/PasswordRecoveryScreen" asChild>
            <Pressable
              style={globalStyles.vertPadding}
              accessibilityRole="link"
              accessibilityLabel="Forgot Password?"
            >
              <Text style={{ color: colors["linkC"] }}>Forgot Password?</Text>
            </Pressable>
          </Link>

          <Link href="/(auth)/RegisterScreen" asChild>
            <Pressable
              style={globalStyles.vertPadding}
              accessibilityRole="link"
              accessibilityLabel="Sign Up"
            >
              <Text style={{ color: colors["linkC"] }}>Sign Up</Text>
            </Pressable>
          </Link>
        </View>

        <View>
          <Text style={[globalStyles.textCenter, { color: colors["loadingTextOppo"] }]}>
            Made by JustAPPin' LLC
          </Text>
          <Image
            source={require("@/assets/images/JustAppin'.png")}
            style={[globalStyles.imageLoadingSmall, globalStyles.flexAlignSelfCenter]}
          />
          <Text style={[globalStyles.textCenter, { color: colors["loadingTextOppo"] }]}>
            Version: {Constants.expoConfig?.version}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
