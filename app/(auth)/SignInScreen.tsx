import React, { useState, useEffect, useContext } from "react";
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
} from "react-native";
import { globalStyles } from "@/constants/global";
import { AuthContext } from "../../context/AuthContext";
import { COLORS } from "@/constants/colors";
import axios from "axios";
import useAuth from "../../hooks/useAuth";

export default function SignInScreen() {
  // const { auth, setAuth } = useAuth();
  // TODO: FIGUGRE OUT WHY THERES NO LOADING NOW
  const { login, logout, auth, setIsLoading } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState(null);
  const [errMsg, setErrMsg] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  console.log(auth);

  const handleSubmit = async (e) => {
    try {
      setIsLoading(true);
      login(user, password);
      router.push("/");
    } catch (err) {
      console.log("ERROR===> ", err);
      if (!err?.originalStatus) {
        // isLoading: true until timeout occurs
        setErrMsg("No Server Response");
      } else if (err.originalStatus === 400) {
        setErrMsg("Missing Info");
      } else if (err.originalStatus === 401) {
        setErrMsg("Unauthorized but its here");
      } else if (err.originalStatus === 409) {
        setErrMsg("Username Taken");
      } else {
        setErrMsg("Login Failed");
      }
    }
    setIsLoading(false);
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
                value={user}
                onChangeText={(text) => setUser(text)}
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
