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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { validateEmail } from "@/utils/validation";
import { handleAuthError } from "@/utils/errorHandler";
import { logger } from "@/utils/logger";

export default function SignInScreen() {
  const auth = getAuth();
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
      await signInWithEmailAndPassword(auth, email, password);
      // Signed in successfully
      // add the Mongo information or how to get the data here
      router.replace("/(tabs)/(home)/HomePage");
    } catch (error) {
      const firebaseError = error as FirebaseError;
      const errorMessage = handleAuthError(firebaseError);
      setErrMsg(errorMessage);
      logger.error('Sign in error:', firebaseError.code, firebaseError.message);
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
