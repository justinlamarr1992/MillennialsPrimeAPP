import React, { useState, useEffect, useContext, useRef } from "react";
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
// import { AuthContext } from "../../provider/AuthProvider";
import { COLORS } from "@/constants/Colors";
// import auth from "@react-native-firebase/auth";
import axios from "axios";
// import useAuth from "../../hooks/useAuth";
import { FirebaseError } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function SignInScreen() {
  const auth = getAuth();
  // TODO: FIGUGRE OUT WHY THERES NO LOADING NOW
  // const { login, logout, auth, setIsLoading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  // const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  const handleSubmit = async (e: any) => {
    setLoading(true);
    setErrMsg(null);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // console.log("Success: user ", user);
        // add the Mongo information or how to get the datahere
        // login(user, password);
        router.replace("/(tabs)/(home)/HomePage");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // setErrMsg(errorCode);
        setErrMsg(errorMessage);
        // TODO: Create an alert here when something wrong happens then the okay but with reset the button
      });
    setLoading(false);
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
                placeholderTextColor="#BABBBD"
                keyboardType="email-address"
                // value={user}
                value={email}
                // onChangeText={(text) => setUser(text)}
                onChangeText={(text) => setEmail(text)}
                autoCapitalize="none"
              ></TextInput>
            </View>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors["text"] }]}>
                Password
              </Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Enter Password"
                placeholderTextColor="#BABBBD"
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}

                // secureTextEntry={true}
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
