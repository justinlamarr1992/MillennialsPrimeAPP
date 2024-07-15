import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "expo-router";
import {
  useColorScheme,
  Text,
  View,
  Platform,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Pressable,
  TextInput,
} from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { globalStyles } from "@/constants/global";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../../context/AuthContext";
// import UserInfo from "./PostItems/UserInfo";
import { COLORS } from "@/constants/Colors";

import axios from "axios";

const USER_REGEX = /^[a-z0-9.]{1,64}@[a-z0-9.]{1,64}$/i;
// const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function RegisterScreen() {
  const { register, auth } = useContext(AuthContext);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  const [modalOpen, setModalOpen] = useState(false);

  const ref = useRef(null);
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [dateOfBirth, setDateOfBirth] = useState("");
  const [date, setDate] = useState(new Date());
  const [DOB, setDOB] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(password));
    setValidMatch(password === matchPassword);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [user, password, matchPassword]);

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };
  const onChange = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setDate(currentDate);

      if (Platform.OS === "android") {
        toggleDatePicker();
        // setDateOfBirth(currentDate.toDateString());
        setDOB(currentDate.toDateString());
      }
    } else {
      toggleDatePicker();
    }
  };

  const confirmIOSDate = () => {
    // setDateOfBirth(date.toDateString());
    setDOB(date.toDateString());
    toggleDatePicker();
  };

  const handleSubmit = async (e) => {
    const v1 = USER_REGEX.test(user);
    const v2 = PASSWORD_REGEX.test(password);

    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }

    try {
      register(user, password, firstName, lastName, DOB);
      console.log(
        "User: ",
        user,
        " Password: ",
        password,
        " First Name: ",
        firstName,
        " Last Name: ",
        lastName,
        " DOB: ",
        DOB
      );
    } catch (err) {
      console.log("ERROR ==>", err);
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
      //   errRef.current.focus();
    } finally {
      // TODO: Check if good infor then go to settings page if not need errors to kick in
      navigation.navigate("SignInScreen");
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
            globalStyles.loginButtonBox,
            globalStyles.padding,
            globalStyles.centerItem,
          ]}
        >
          <Pressable
            style={[globalStyles.button, { backgroundColor: colors["hexC"] }]}
            // onPress={() => navigation.navigate("Sign In")}
          >
            <Link replace href="/(auth)/SignInScreen" asChild>
              <Text style={globalStyles.buttonText}>Login</Text>
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
            globalStyles.registerForm,
            globalStyles.bottomPadding,
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
                Create an Account
              </Text>
              <Text style={(globalStyles.labelText, { color: colors["text"] })}>
                Sign Up to Continue
              </Text>
            </View>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors["text"] }]}>
                First Name
              </Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Enter First Name"
                placeholderTextColor={colors["plcHoldText"]}
                onChangeText={(text) => {
                  setFirstName(text);
                }}
              ></TextInput>
            </View>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors["text"] }]}>
                Last Name
              </Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Enter Last Name"
                placeholderTextColor={colors["plcHoldText"]}
                onChangeText={(text) => {
                  setLastName(text);
                }}
              ></TextInput>
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
                onChangeText={(text) => {
                  setUser(text);
                  console.log("User is ", user);
                }}
              ></TextInput>
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
                //   autoCorrect={false}
                onChangeText={(text) => {
                  setPassword(text);
                  console.log("password is ", password);
                }}
              ></TextInput>
            </View>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors["text"] }]}>
                Confirm Password
              </Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Confirm Password"
                placeholderTextColor={colors["plcHoldText"]}
                secureTextEntry={true}
                onChangeText={(text) => {
                  setMatchPassword(text);
                  console.log("Matched is", matchPassword);
                }}
              ></TextInput>
            </View>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors["text"] }]}>
                When were you Born
              </Text>
              {showPicker && (
                <DateTimePicker
                  style={globalStyles.datePicker}
                  mode="date"
                  display="spinner"
                  value={date}
                  onChange={onChange}
                  placeholderTextColor={colors["plcHoldText"]}
                  maximumDate={new Date("1997-1-1")}
                  minimumDate={new Date("1981-1-1")}
                />
              )}
              {/* IMPORTANT THE DATEPICKER TEXT COLOR IS OFF OF THE PHONE DAYTIME/NIGT PREF */}
              {showPicker && Platform.OS === "ios" && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <TouchableOpacity
                    style={[globalStyles.button, globalStyles.cancelButton]}
                    onPress={toggleDatePicker}
                  >
                    <Text
                      style={[
                        globalStyles.buttonText,
                        globalStyles.cancelButtonText,
                      ]}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[globalStyles.button, globalStyles.confirmButton]}
                    onPress={confirmIOSDate}
                  >
                    <Text
                      style={[
                        globalStyles.buttonText,
                        globalStyles.confirmButtonText,
                      ]}
                    >
                      Confirm
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {!showPicker && (
                <Pressable onPress={toggleDatePicker}>
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Birthday"
                    placeholderTextColor={colors["plcHoldText"]}
                    value={DOB}
                    onChangeText={setDOB}
                    editable={false}
                    onPressIn={toggleDatePicker}
                  />
                </Pressable>
              )}
            </View>
            <Pressable
              style={[
                globalStyles.button,
                globalStyles.marginVertical,
                { backgroundColor: colors["triC"] },
              ]}
            >
              <Text style={globalStyles.buttonText} onPress={handleSubmit}>
                Create an Account
              </Text>
            </Pressable>
            <Text style={[globalStyles.errorText, { color: colors["secC"] }]}>
              {errMsg}
            </Text>
            {/* <Text>Connect with Socials</Text> */}
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
