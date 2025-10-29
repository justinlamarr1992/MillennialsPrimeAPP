import React, { useState, useEffect } from "react";
import { router } from "expo-router";
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
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { validateEmail } from "@/utils/validation";
import { handleAuthError } from "@/utils/errorHandler";
import { logger } from "@/utils/logger";

const PasswordRecoveryScreen = () => {
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  const [errMsg, setErrMsg] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  // Real-time email validation
  useEffect(() => {
    if (email.length > 0) {
      setEmailError(validateEmail(email));
    } else {
      setEmailError(null);
    }
  }, [email]);

  // Clear error when user types
  useEffect(() => {
    setErrMsg("");
  }, [email]);

  const isFormValid = email.length > 0 && !emailError;

  const handleSubmit = async () => {
    // Validate email before submission
    if (!email || emailError) {
      setErrMsg("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setErrMsg("");

    try {
      await sendPasswordResetEmail(auth, email);
      // TODO: Replace alert() with a proper notification component (toast/snackbar) for better UX
      alert("Password reset email sent! Check your inbox.");
      router.replace("/(auth)/SignInScreen");
    } catch (error) {
      const firebaseError = error as FirebaseError;
      const errorMessage = handleAuthError(firebaseError);
      setErrMsg(errorMessage);
      logger.error('Password reset error:', firebaseError.code, firebaseError.message);
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
            globalStyles.passwordRecoveryBox,
            globalStyles.padding,
            globalStyles.centerItem,
          ]}
        >
          <Text style={[globalStyles.errorText, { color: colors.secC }]}>
            {errMsg}
          </Text>
        </View>
        <View
          style={[
            globalStyles.recoveryForm,
            globalStyles.padding,

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
                Password Recovery
              </Text>
              <Text style={[globalStyles.labelText, { color: colors["text"] }]}>
                Enter your email to recovery your Password!
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
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
              {emailError && (
                <Text style={[globalStyles.errorText, { color: colors["secC"], fontSize: 12, marginTop: 4 }]}>
                  {emailError}
                </Text>
              )}
            </View>
            {loading ? (
              <ActivityIndicator size={"small"} style={{ margin: 28 }} />
            ) : (
              <Pressable
                style={[
                  globalStyles.button,
                  globalStyles.marginVertical,
                  {
                    backgroundColor: !isFormValid ? colors["quiC"] : colors["triC"],
                    opacity: !isFormValid ? 0.5 : 1
                  },
                ]}
                disabled={!isFormValid}
                onPress={handleSubmit}
              >
                <Text style={globalStyles.buttonText}>Send Email</Text>
              </Pressable>
            )}

            <Text style={[globalStyles.errorText, { color: colors["secC"] }]}>
              {errMsg}
            </Text>
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
export default PasswordRecoveryScreen;
// <View
//     style={[
//       globalStyles.container,
//       {
//         backgroundColor: colors.background,
//       },
//     ]}
//   >
{
  /* <Text style={(color: colors.primCarT)}>Password Recovery</Text> */
}
{
  /* <Text style={[globalStyles.textTitle, { color: colors["priT"] }]}>
          Recover Password
        </Text>
      </View> */
}
