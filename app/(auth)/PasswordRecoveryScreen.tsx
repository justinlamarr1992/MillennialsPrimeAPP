import React, { useState, useRef } from "react";
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
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const PasswordRecoveryScreen = () => {
  const errRef = useRef();
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  const [errMsg, setErrMsg] = useState(null);

  const handleSubmit = () => {
    setLoading(true);
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Check Your Email");
        setLoading(false);
        router.navigate("/SignInScreen");
        // Password reset email sent!
        // ..
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrMsg(errorMessage);
        setLoading(false);
        // ..
      });
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
