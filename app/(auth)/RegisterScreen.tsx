import React, { useState, useEffect, useCallback, useMemo } from "react";
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
import auth from "@react-native-firebase/auth";
import { logger } from "@/utils/logger";
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateRequired
} from "@/utils/validation";
import { handleAuthError } from "@/utils/errorHandler";
import { serverAuth } from "@/services/serverAuth";

// DateTimePicker event interface for type safety
interface DatePickerEvent {
  type: string;
}

// Form validation errors interface - declared at module level per React best practices
interface ValidationErrors {
  email: string | null;
  password: string | null;
  confirmPassword: string | null;
  firstName: string | null;
  lastName: string | null;
  dob: string | null;
  hasErrors: boolean;
}

// Birth year range constants - targeting Millennials generation
// Born between 1981 and 1997 (age 28-44 in 2025)
const MIN_BIRTH_YEAR = 1981;
const MAX_BIRTH_YEAR = 1997;
const MIN_BIRTH_DATE = new Date(`${MIN_BIRTH_YEAR}-1-1`);
const MAX_BIRTH_DATE = new Date(`${MAX_BIRTH_YEAR}-1-1`);

export default function RegisterScreen() {
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
  const [dobError] = useState<string | null>(null);

  const [errMsg, setErrMsg] = useState("");

  // Centralized form validation function
  // Returns an object with all validation errors and a hasErrors flag
  // Always calls validators to ensure proper 'required' validation
  // Wrapped in useCallback for performance optimization
  const validateForm = useCallback((): ValidationErrors => {
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const confirmPasswordValidation = validatePasswordMatch(password, matchPassword);
    const firstNameValidation = validateRequired(firstName, "First name");
    const lastNameValidation = validateRequired(lastName, "Last name");
    const dobValidation = validateRequired(DOB, "Date of birth");

    const hasErrors = !!(
      emailValidation ||
      passwordValidation ||
      confirmPasswordValidation ||
      firstNameValidation ||
      lastNameValidation ||
      dobValidation
    );

    return {
      email: emailValidation,
      password: passwordValidation,
      confirmPassword: confirmPasswordValidation,
      firstName: firstNameValidation,
      lastName: lastNameValidation,
      dob: dobValidation,
      hasErrors
    };
  }, [email, password, matchPassword, firstName, lastName, DOB]);

  // Real-time field validation helpers - validate individual fields on blur
  // Always call validators to show required errors when fields are empty
  // Wrapped in useCallback to maintain referential stability and prevent unnecessary re-renders
  const validateEmailField = useCallback(() => {
    setEmailError(validateEmail(email));
  }, [email]);

  const validatePasswordField = useCallback(() => {
    setPasswordError(validatePassword(password));
  }, [password]);

  const validateConfirmPasswordField = useCallback(() => {
    setConfirmPasswordError(validatePasswordMatch(password, matchPassword));
  }, [password, matchPassword]);

  const validateFirstNameField = useCallback(() => {
    setFirstNameError(validateRequired(firstName, "First name"));
  }, [firstName]);

  const validateLastNameField = useCallback(() => {
    setLastNameError(validateRequired(lastName, "Last name"));
  }, [lastName]);

  // Clear general error message when user makes changes
  useEffect(() => {
    setErrMsg("");
  }, [email, password, matchPassword, firstName, lastName, DOB]);

  // Single source of truth for form validity
  // Uses the same validateForm() function to ensure consistency
  const isFormValid = useMemo(() => {
    const errors = validateForm();
    return !errors.hasErrors;
  }, [email, password, matchPassword, firstName, lastName, DOB]);

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
    // Safety: Always validate before submitting, even if button is visually disabled
    // The disabled prop doesn't prevent onPress in all scenarios (rapid taps, accessibility tools)
    if (!isFormValid) return;

    setErrMsg("");
    setLoading(true);

    try {
      // Step 1: Register with Firebase
      if (__DEV__) {
        logger.log('🔐 Registering with Firebase...');
      }
      await auth().createUserWithEmailAndPassword(email, password);
      if (__DEV__) {
        logger.log('✅ Firebase registration successful');
      }

      // Step 2: Register with MongoDB server
      if (__DEV__) {
        logger.log('🔐 Registering with MongoDB server...');
      }
      try {
        await serverAuth.registerOnServer({
          email,
          password,
          firstName,
          lastName,
          DOB
        });
        if (__DEV__) {
          logger.log('✅ MongoDB registration successful');
        }
      } catch (mongoError: unknown) {
        logger.error('❌ MongoDB registration failed:', mongoError);
        // Cleanup: delete Firebase user to avoid orphaned accounts
        try {
          const currentUser = auth().currentUser;
          if (currentUser) {
            // Delete user first (this automatically signs them out)
            await currentUser.delete();
            if (__DEV__) {
              logger.log('🧹 Firebase user deleted after MongoDB registration failure');
            }
          } else {
            if (__DEV__) {
              logger.log('ℹ️ No Firebase user found to delete after MongoDB failure');
            }
          }
        } catch (cleanupError: unknown) {
          logger.error('⚠️ Failed to sign out/delete Firebase user after MongoDB failure:', cleanupError);
        }
        setErrMsg('Registration failed on the server. Your account was not created. Please try again.');
        return;
      }

      // Signed up successfully
      // TODO [UX Priority]: Replace alert() with non-blocking toast notification for better mobile UX
      // Native alert() is blocking and provides poor user experience on mobile
      // Consider: react-native-toast-notifications or expo-notifications
      alert("You are registered");
      router.replace("/(auth)/SignInScreen");
    } catch (error) {
      const firebaseError = error as { code: string; message: string };
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
                onBlur={validateFirstNameField}
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
                onBlur={validateLastNameField}
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
                onBlur={validateEmailField} // Validate on blur
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
                onBlur={validatePasswordField} // Validate on blur
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
                onBlur={validateConfirmPasswordField} // Validate on blur
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
                    onPressIn={toggleDatePicker}
                    testID="birthday-input"
                    showSoftInputOnFocus={false}
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
                testID="register-submit-button"
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
