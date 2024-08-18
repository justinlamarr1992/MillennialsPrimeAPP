import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, router } from "expo-router";
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
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { globalStyles } from "@/constants/global";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../../provider/AuthProvider";
// import UserInfo from "./PostItems/UserInfo";
import { COLORS } from "@/constants/Colors";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import axios from "axios";

const USER_REGEX = /^[a-z0-9.]{1,64}@[a-z0-9.]{1,64}$/i;
// const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function RegisterScreen() {
  console.log(auth);
  // const { register, auth } = useContext(AuthContext);
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  const [modalOpen, setModalOpen] = useState(false);

  const ref = useRef(null);
  const userRef = useRef();
  const errRef = useRef();

  const auth = getAuth();
  const [loading, setLoading] = useState(false);

  // const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
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
    setValidName(USER_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(password));
    setValidMatch(password === matchPassword);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [email, password, matchPassword]);

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
    setErrMsg(null);
    setLoading(true);
    const v1 = USER_REGEX.test(email);
    const v2 = PASSWORD_REGEX.test(password);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log("Success: user ", user);
        // add the Mongo information or how to get the datahere
        // register(user, password, firstName, lastName, DOB);
        router.replace("/SignInScreen");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        setErrMsg(errorMessage);
      });
    setLoading(false);
    // console.log(
    //   "User: ",
    //   email,
    //   " Password: ",
    //   password,
    //   " First Name: ",
    //   firstName,
    //   " Last Name: ",
    //   lastName,
    //   " DOB: ",
    //   DOB
    // );
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
                placeholderTextColor={colors["plcHoldText"]}
                placeholder="Enter First Name"
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
                  setEmail(text);
                  console.log("User is ", email);
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
            {loading ? (
              <ActivityIndicator size={"small"} style={{ margin: 28 }} />
            ) : (
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
            )}

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
