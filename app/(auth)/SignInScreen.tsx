import React, { useState, useEffect } from "react";
import { Link, router } from "expo-router";
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
} from "react-native";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import auth from "@react-native-firebase/auth";
import { validateEmail } from "@/utils/validation";
import { handleAuthError } from "@/utils/errorHandler";
import { logger } from "@/utils/logger";
import { serverAuth } from "@/services/serverAuth";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  // Field-level error messages for real-time validation feedback
  const [emailError, setEmailError] = useState<string | null>(null);

  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  // Real-time email validation
  useEffect(() => {
    if (email.length > 0) {
      setEmailError(validateEmail(email));
    } else {
      setEmailError(null);
    }
  }, [email]);

  // Clear general error message when user makes changes
  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  // Check if form is valid for submission
  const isFormValid = email.trim().length > 0 && password.trim().length > 0 && !emailError;

  const handleSubmit = async () => {
    // Validate before submission
    if (emailError || email.trim().length === 0 || password.trim().length === 0) {
      setErrMsg("Please enter a valid email and password");
      return;
    }

    setLoading(true);
    setErrMsg("");

    try {
      // Step 1: Authenticate with Firebase
      logger.log('🔐 Signing in with Firebase...');
      await auth().signInWithEmailAndPassword(email, password);
      logger.log('✅ Firebase sign-in successful');

      // Step 2: Authenticate with MongoDB server
      logger.log('🔐 Authenticating with MongoDB server...');
      try {
        await serverAuth.loginToServer(email, password);
        logger.log('✅ MongoDB authentication successful');
      } catch (mongoError) {
        logger.error('❌ MongoDB authentication failed:', mongoError);
        // Don't block the user from accessing the app if MongoDB auth fails
        // They're still authenticated with Firebase
        setErrMsg('Warning: Could not connect to server. Some features may be limited.');
      }

      // Navigate to home page
      router.replace("/(tabs)/(home)/HomePage");
    } catch (error) {
      const firebaseError = error as { code: string; message: string };
      const errorMessage = handleAuthError(firebaseError);
      setErrMsg(errorMessage);
      logger.error('❌ Sign in error:', firebaseError.code, firebaseError.message);
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
      <View style={[globalStyles.signInScreen]}>
        <View
          style={[
            globalStyles.registerButtonBox,
            globalStyles.padding,
            globalStyles.centerItem,
          ]}
        >
          <Pressable
            style={[globalStyles.button, { backgroundColor: colors["hexC"] }]}
            // onPress={() => navigation.navigate("Register")}
          >
            <Link replace href="/(auth)/RegisterScreen" asChild>
              <Text style={globalStyles.buttonText}>Create an Account</Text>
            </Link>
          </Pressable>
          <Text style={[globalStyles.errorText, { color: colors.secC }]}>
            {errMsg}
          </Text>
        </View>
        <View
          style={[
            globalStyles.signInForm,
            globalStyles.padding,
            globalStyles.loginForm,
            {
              backgroundColor: colors["background"],
              borderColor: colors["quiC"],
            },
          ]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={globalStyles.scrollView}
          >
            <View style={globalStyles.formTitle}>
              <Text style={[globalStyles.textTitle, { color: colors["text"] }]}>
                Welcome Back
              </Text>
              <Text style={[globalStyles.labelText, { color: colors["text"] }]}>
                Sign in to Continue
              </Text>
            </View>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors["text"] }]}>
                Email
              </Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Enter Email"
                placeholderTextColor={colors["plcHoldText"]}
                keyboardType="email-address"
                value={email}
                onChangeText={(text) => setEmail(text)}
                autoCapitalize="none"
              />
              {emailError && (
                <Text style={[globalStyles.errorText, { color: colors["secC"], fontSize: 12, marginTop: 4 }]}>
                  {emailError}
                </Text>
              )}
            </View>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors["text"] }]}>
                Password
              </Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Enter Password"
                placeholderTextColor={colors["plcHoldText"]}
                secureTextEntry={true}
                autoCapitalize="none"
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
            </View>
            {loading ? (
              <ActivityIndicator size={"small"} style={{ margin: 28 }} />
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
            <Text style={[globalStyles.errorText, { color: colors["secC"] }]}>
              {errMsg}
            </Text>
            <Link href="/(auth)/PasswordRecoveryScreen" asChild>
              <Text
                style={[globalStyles.vertPadding, { color: colors["linkC"] }]}
                // onPress={() => navigation.navigate("PasswordRecoveryScreen")}
              >
                Forgot Password Link
              </Text>
            </Link>

            {/* <Text>Connect with Socials</Text> */}
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
