import React, { useState, useEffect } from "react";
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
import { COLORS } from "@/constants/Colors";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { logger } from "@/utils/logger";
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateRequired
} from "@/utils/validation";
import { handleAuthError } from "@/utils/errorHandler";

// DateTimePicker event interface for type safety
interface DatePickerEvent {
  type: string;
}

// Birth year range constants - targeting Millennials generation
// Born between 1981 and 1997 (age 28-44 in 2025)
const MIN_BIRTH_YEAR = 1981;
const MAX_BIRTH_YEAR = 1997;
const MIN_BIRTH_DATE = new Date(`${MIN_BIRTH_YEAR}-1-1`);
const MAX_BIRTH_DATE = new Date(`${MAX_BIRTH_YEAR}-1-1`);

export default function RegisterScreen() {
  const auth = getAuth();
  // const { register, auth } = useContext(AuthContext);
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [matchPassword, setMatchPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [date, setDate] = useState(new Date());
  const [DOB, setDOB] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  // Field-level error messages for real-time validation feedback
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [dobError, setDobError] = useState<string | null>(null);

  const [errMsg, setErrMsg] = useState("");

  // Real-time email validation - runs on blur or when explicitly triggered
  const validateEmailField = (value: string) => {
    if (value.length > 0) {
      setEmailError(validateEmail(value));
    } else {
      setEmailError(null);
    }
  };

  // Real-time password validation - runs on blur or when explicitly triggered
  const validatePasswordField = (value: string) => {
    if (value.length > 0) {
      setPasswordError(validatePassword(value));
    } else {
      setPasswordError(null);
    }
  };

  // Real-time password match validation - runs on blur or when explicitly triggered
  const validateConfirmPasswordField = (pwd: string, confirmPwd: string) => {
    if (confirmPwd.length > 0) {
      setConfirmPasswordError(validatePasswordMatch(pwd, confirmPwd));
    } else {
      setConfirmPasswordError(null);
    }
  };

  // Clear general error message when user makes changes
  useEffect(() => {
    setErrMsg("");
  }, [email, password, matchPassword, firstName, lastName, DOB]);

  // Check if form is valid for submission
  const isFormValid =
    email.length > 0 &&
    password.length > 0 &&
    matchPassword.length > 0 &&
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    DOB.length > 0 &&
    !emailError &&
    !passwordError &&
    !confirmPasswordError;

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };
  const onChange = (event: DatePickerEvent, selectedDate?: Date) => {
    if (event.type === "set" && selectedDate) {
      const currentDate = selectedDate;
      setDate(currentDate);

      if (Platform.OS === "android") {
        toggleDatePicker();
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

  const handleSubmit = async () => {
    // Validate all fields before submission (including re-validation for safety)
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const confirmPasswordValidation = validatePasswordMatch(password, matchPassword);
    const firstNameValidation = validateRequired(firstName, "First name");
    const lastNameValidation = validateRequired(lastName, "Last name");
    const dobValidation = validateRequired(DOB, "Date of birth");

    // Update all error states
    setEmailError(emailValidation);
    setPasswordError(passwordValidation);
    setConfirmPasswordError(confirmPasswordValidation);
    setFirstNameError(firstNameValidation);
    setLastNameError(lastNameValidation);
    setDobError(dobValidation);

    // If any validation fails, show error and stop
    if (
      emailValidation ||
      passwordValidation ||
      confirmPasswordValidation ||
      firstNameValidation ||
      lastNameValidation ||
      dobValidation
    ) {
      setErrMsg("Please fix all errors before submitting");
      return;
    }

    setErrMsg("");
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Signed up successfully
      // TODO [UX Priority]: Replace alert() with non-blocking toast notification for better mobile UX
      // Native alert() is blocking and provides poor user experience on mobile
      // Consider: react-native-toast-notifications or expo-notifications
      alert("You are registered");
      // add the Mongo information or how to get the data here
      // register(user, password, firstName, lastName, DOB);
      router.replace("/(auth)/SignInScreen");
    } catch (error) {
      const firebaseError = error as FirebaseError;
      const errorMessage = handleAuthError(firebaseError);
      setErrMsg(errorMessage);
      logger.error('Registration error:', firebaseError.code, firebaseError.message);
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
                value={firstName}
                onChangeText={(text) => {
                  setFirstName(text);
                  if (firstNameError) setFirstNameError(null);
                }}
              />
              {firstNameError && (
                <Text style={[globalStyles.errorText, { color: colors["secC"], fontSize: 12, marginTop: 4 }]}>
                  {firstNameError}
                </Text>
              )}
            </View>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors["text"] }]}>
                Last Name
              </Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Enter Last Name"
                placeholderTextColor={colors["plcHoldText"]}
                value={lastName}
                onChangeText={(text) => {
                  setLastName(text);
                  if (lastNameError) setLastNameError(null);
                }}
              />
              {lastNameError && (
                <Text style={[globalStyles.errorText, { color: colors["secC"], fontSize: 12, marginTop: 4 }]}>
                  {lastNameError}
                </Text>
              )}
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
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError(null); // Clear error while typing
                  logger.log("User email updated. Length:", text.length);
                }}
                onBlur={() => validateEmailField(email)} // Validate on blur
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
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError(null); // Clear error while typing
                  // Password length logging removed per security best practices
                }}
                onBlur={() => validatePasswordField(password)} // Validate on blur
              />
              {passwordError && (
                <Text style={[globalStyles.errorText, { color: colors["secC"], fontSize: 12, marginTop: 4 }]}>
                  {passwordError}
                </Text>
              )}
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
                autoCapitalize="none"
                value={matchPassword}
                onChangeText={(text) => {
                  setMatchPassword(text);
                  if (confirmPasswordError) setConfirmPasswordError(null); // Clear error while typing
                  // Password match logging removed per security best practices
                }}
                onBlur={() => validateConfirmPasswordField(password, matchPassword)} // Validate on blur
              />
              {confirmPasswordError && (
                <Text style={[globalStyles.errorText, { color: colors["secC"], fontSize: 12, marginTop: 4 }]}>
                  {confirmPasswordError}
                </Text>
              )}
            </View>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors["text"] }]}>
                When were you Born
              </Text>
              {showPicker && (
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={date}
                  onChange={onChange}
                  maximumDate={MAX_BIRTH_DATE}
                  minimumDate={MIN_BIRTH_DATE}
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
              {dobError && (
                <Text style={[globalStyles.errorText, { color: colors["secC"], fontSize: 12, marginTop: 4 }]}>
                  {dobError}
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
                <Text style={globalStyles.buttonText}>
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
