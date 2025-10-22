import React, { useState } from "react";
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

const PasswordRecoveryScreen = () => {
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      setErrMsg("Please enter your email address");
      return;
    }

    setLoading(true);
    setErrMsg("");

    try {
      await sendPasswordResetEmail(auth, email);
      // TODO: Replace alert() with a proper notification component (toast/snackbar) for better UX
      alert("Check Your Email");
      router.replace("/(auth)/SignInScreen");
    } catch (error) {
      const firebaseError = error as FirebaseError;
      const errorMessage = firebaseError.message || "An error occurred sending password reset email";
      setErrMsg(errorMessage);
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
                placeholderTextColor="#BABBBD"
                keyboardType="email-address"
                value={email}
                onChangeText={(text) => setEmail(text)}
              ></TextInput>
            </View>
            {loading ? (
              <ActivityIndicator size={"small"} style={{ margin: 28 }} />
            ) : (
              <Pressable
                style={[
                  globalStyles.button,
                  globalStyles.marginVertical,
                  { backgroundColor: colors["triC"] },
                ]}
                onPressIn={handleSubmit}
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
