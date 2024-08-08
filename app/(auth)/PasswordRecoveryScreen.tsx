import React, { useState } from "react";
import {
  useColorScheme,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { globalStyles } from "@/constants/global";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "@/constants/Colors";

const PasswordRecoveryScreen = () => {
  const [email, setEmail] = useState(null);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  const handleSubmit = () => {};

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
        ></View>
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
