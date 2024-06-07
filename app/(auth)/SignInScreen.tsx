import React, { useState, useEffect, useContext } from "react";
import { Link } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import { globalStyles } from "@/constants/global";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../../context/AuthContext";
// import UserInfo from "./PostItems/UserInfo";

import axios from "axios";
import useAuth from "../../hooks/useAuth";
// import colors from "../../styles/colors";
import Colors from "@/constants/colors";

export default function SignInScreen() {
  // const { auth, setAuth } = useAuth();
  const { login, logout, auth } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState(null);

  const navigation = useNavigation();
  const [modalOpen, setModalOpen] = useState(false);
  const colors = useTheme().colors;
  const Colors = useTheme().Colors;

  console.log(auth);

  const handleSubmit = async (e) => {
    try {
      login(user, password);
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
          <Link
            href="/auth/RegisterScreen"
            asChild
            // style={[globalStyles.button, { backgroundColor: colors.hexC }]}
          >
            <Pressable
              style={[globalStyles.button, { backgroundColor: Colors.hexC }]}
              // onPress={() => navigation.navigate("Register")}
            >
              <Text style={globalStyles.buttonText}>Create an Account</Text>
            </Pressable>
          </Link>
        </View>
        <View
          style={[
            globalStyles.signInForm,
            globalStyles.padding,
            globalStyles.loginForm,
            {
              backgroundColor: colors.background,
              borderColor: colors.borderColor,
            },
          ]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={globalStyles.scrollView}
          >
            <View style={globalStyles.formTitle}>
              <Text style={[globalStyles.titleText, { color: colors.text }]}>
                Welcome Back
              </Text>
              <Text style={globalStyles.labelText}>Sign in to Continue</Text>
            </View>
            <View style={globalStyles.labelInput}>
              <Text style={globalStyles.labelText}>Email</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Enter Email"
                value={user}
                onChangeText={(text) => setUser(text)}
              ></TextInput>
            </View>
            <View style={globalStyles.labelInput}>
              <Text style={globalStyles.labelText}>Password</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Enter Password"
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}

                // secureTextEntry={true}
              ></TextInput>
            </View>
            <Pressable
              style={[
                globalStyles.button,
                globalStyles.vertMargin,
                { backgroundColor: colors.triC },
              ]}
              onPressIn={handleSubmit}
            >
              <Text style={globalStyles.buttonText}>Login</Text>
            </Pressable>
            <Text
              style={[globalStyles.vertPadding, { color: Colors.linkC }]}
              // onPress={() => navigation.navigate("Password Recovery")}
            >
              Forgot Password Link
            </Text>
            {/* <Text>Connect with Socials</Text> */}
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
