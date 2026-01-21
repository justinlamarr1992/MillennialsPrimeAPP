import React, { useState } from "react";
import {
  Text,
  View,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
  TextInput,
  useColorScheme,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import { logger } from "@/utils/logger";
import { validateName, validateZip } from "@/utils/validation";
import ProfilePicture from "@/components/ProfilePicture";
import useAuth from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { userProfileService } from "@/services/userProfileService";
import { useEffect } from "react";

export default function MyInfoScreen() {
  const { user } = useAuth();
  const { profile, refetch } = useUserProfile();
  useAxiosPrivate(); // Set up axios interceptors for authenticated requests

  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  // Use States
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [username] = useState<string>(user?.email || "");
  const [DOB, setDOB] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [zip, setZip] = useState<string>("");
  const [canLike, setCanLike] = useState<string>("");
  const [canDislike, setCanDislike] = useState<string>("");
  const [canComment, setCanComment] = useState<string>("");
  const [canShare, setCanShare] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const [B2B, setB2B] = useState<string>("");
  const [eComm, setEComm] = useState<string>("");
  const [upload, setUpload] = useState<string>("");

  // Populate form fields when profile data is fetched
  useEffect(() => {
    if (profile) {
      if (__DEV__) {
        logger.log('📝 Populating form with profile data:', profile);
      }
      setName(profile.name || "");
      setCountry(profile.location?.country || "");
      setState(profile.location?.state || "");
      setCity(profile.location?.city || "");
      setZip(profile.location?.zip?.toString() || "");

      // Format DOB date for display
      if (profile.DOB) {
        const dobDate = new Date(profile.DOB);
        setDOB(dobDate.toDateString());
      }
    }
  }, [profile]);

  // Pickers
  const [canLikePicker, setCanLikePicker] = useState(false);
  const [canDislikePicker, setCanDislikePicker] = useState(false);
  const [canCommentPicker, setCanCommentPicker] = useState(false);
  const [canSharePicker, setCanSharePicker] = useState(false);
  const [industryPicker, setIndustryPicker] = useState(false);
  const [B2BPicker, setB2BPicker] = useState(false);
  const [eCommPicker, setECommPicker] = useState(false);
  const [uploadPicker, setUploadPicker] = useState(false);

  // Values to the back end
  // const [values, setValues] = useState({
  // name,
  // username: null,
  // email: null,
  // DOB: null,
  // country: null,
  // state: null,
  // city: null,
  // zip: null,
  // canLike: null,
  // canDislike: null,
  // canComment: null,
  // canShare: null,
  // industry: null,
  // B2B: null,
  // eComm: null,
  // upload: null,
  // TEst later
  // profileSettings: {
  //   canLike: null,
  //   canDislike: null,
  //   canComment: null,
  //   canShare: null,
  //   industry: null,
  //   B2B: null,
  //   eComm: null,
  //   upload: null,
  // },
  // });

  const toggleCanLikePicker = () => {
    setCanLikePicker(!canLikePicker);
  };
  const toggleCanDislikePicker = () => {
    setCanDislikePicker(!canDislikePicker);
  };
  const toggleCanCommentPicker = () => {
    setCanCommentPicker(!canCommentPicker);
  };
  const toggleCanSharePicker = () => {
    setCanSharePicker(!canSharePicker);
  };
  const toggleIndustryPicker = () => {
    setIndustryPicker(!industryPicker);
  };
  const toggleB2BPicker = () => {
    setB2BPicker(!B2BPicker);
  };
  const toggleECommPicker = () => {
    setECommPicker(!eCommPicker);
  };
  const toggleUploadPicker = () => {
    setUploadPicker(!uploadPicker);
  };

  const handleSubmit = async () => {
    logger.log('💾 MyInfo submit button pressed');

    // Validate form fields
    const nameError = validateName(name);
    const zipError = validateZip(zip);

    // Collect all errors
    const errors: string[] = [];
    if (nameError) errors.push(nameError);
    if (zipError) errors.push(zipError);

    // Show validation errors if any
    if (errors.length > 0) {
      Alert.alert('Validation Error', errors.join('\n'));
      logger.warn('⚠️ MyInfo validation failed:', errors);
      return;
    }

    try {
      logger.log('📤 MyInfo form submission started');

      if (!user) {
        logger.warn('⚠️ No authenticated user found');
        return;
      }

      // Save profile data to MongoDB server
      await userProfileService.updateMyInfo({
        name,
        country,
        state,
        city,
        zip,
      });

      logger.log('✅ MyInfo settings saved successfully');

      // Refetch profile to get updated data
      await refetch();

      Alert.alert('Success', 'Your profile has been updated!');

      // Navigate to BusinessScreen (next step in settings flow)
      router.push("/(tabs)/(settings)/BusinessScreen");
    } catch (err) {
      logger.error('❌ MyInfo submission error:', err);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    }
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      enabled={true}
      style={globalStyles.flex1}
    >
      <View style={[{ backgroundColor: colors.background }]}>
        <ScrollView
          style={[globalStyles.padding, globalStyles.marginB100, {}]}
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            onPress={() => router.back()}
            style={globalStyles.backButton}
          >
            <Text style={[globalStyles.labelText, { color: colors.priC }]}>
              ← Back
            </Text>
          </Pressable>
          <View style={globalStyles.formTitle}>
            <ProfilePicture
              imageUri={profileImageUri}
              onImageSelected={setProfileImageUri}
              size={120}
              editable={true}
            />
            <Text style={[globalStyles.textTitle, { color: colors.text, marginTop: 16 }]}>
              Basic Information
            </Text>
            <Text style={[globalStyles.labelText, { color: colors.text }]}>
              Edit your Profile information
            </Text>
            {/* {id ? (
              <Text style={{ color: colors.quaC }}>ID is Good</Text>
            ) : (
              <Text style={{ color: colors.triC }}>No ID</Text>
            )} */}
          </View>
          <View style={globalStyles.groupPadding}>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors.text }]}>
                Name
              </Text>
              <TextInput
                style={globalStyles.input}
                placeholderTextColor={colors["plcHoldText"]}
                placeholder="Enter Name"
                value={name}
                onChangeText={(text) => setName(text)}
              />
            </View>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors.text }]}>
                Username
              </Text>
              <TextInput
                style={globalStyles.input}
                placeholderTextColor={colors["plcHoldText"]}
                placeholder="Enter Username"
                editable={false}
                value={username}
              ></TextInput>
            </View>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors.text }]}>
                Email
              </Text>
              <TextInput
                style={globalStyles.input}
                placeholderTextColor={colors["plcHoldText"]}
                placeholder="Enter Email"
                editable={false}
                value={username}
              ></TextInput>
            </View>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors.text }]}>
                Birthday
              </Text>
              <TextInput
                style={globalStyles.input}
                placeholderTextColor={colors["plcHoldText"]}
                placeholder="Enter Birthday"
                editable={false}
                value={DOB}
              ></TextInput>
            </View>
          </View>
          <View style={globalStyles.groupPadding}>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors.text }]}>
                Country
              </Text>
              <TextInput
                style={globalStyles.input}
                placeholderTextColor={colors["plcHoldText"]}
                placeholder="Enter Country"
                value={country}
                onChangeText={(text) => setCountry(text)}
              />
            </View>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors.text }]}>
                State
              </Text>
              <TextInput
                style={globalStyles.input}
                placeholderTextColor={colors["plcHoldText"]}
                placeholder="Enter State"
                value={state}
                onChangeText={(text) => setState(text)}
              />
            </View>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors.text }]}>
                City
              </Text>
              <TextInput
                style={globalStyles.input}
                placeholderTextColor={colors["plcHoldText"]}
                placeholder="Enter City"
                value={city}
                onChangeText={(text) => setCity(text)}
              />
            </View>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors.text }]}>
                Zip
              </Text>
              <TextInput
                style={globalStyles.input}
                placeholderTextColor={colors["plcHoldText"]}
                placeholder="Enter Zip"
                keyboardType="number-pad"
                value={zip}
                onChangeText={(text) => setZip(text)}
              />
            </View>
          </View>
          <View style={globalStyles.groupPadding}>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors.text }]}>
                Viewers Can Like
              </Text>
              <Pressable>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Can Users Like your Post?"
                  value={canLike}
                  onChangeText={setCanLike}
                  editable={false}
                  onPressIn={toggleCanLikePicker}
                ></TextInput>
              </Pressable>

              {canLikePicker && (
                <Picker
                  style={{}}
                  selectedValue={canLike}
                  onValueChange={(itemValue) =>
                    setCanLike(itemValue)
                  }
                >
                  <Picker.Item label="Yes" value="yes" />
                  <Picker.Item label="No" value="no" />
                </Picker>
              )}
            </View>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors.text }]}>
                Viewers Can Dislike
              </Text>
              <Pressable>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Can Users Dislike your Post"
                  value={canDislike}
                  onChangeText={setCanDislike}
                  editable={false}
                  onPressIn={toggleCanDislikePicker}
                ></TextInput>
              </Pressable>
              {canDislikePicker && (
                <Picker
                  selectedValue={canDislike}
                  onValueChange={(itemValue) =>
                    setCanDislike(itemValue)
                  }
                >
                  <Picker.Item label="Yes" value="yes" />
                  <Picker.Item label="No" value="no" />
                </Picker>
              )}
            </View>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors.text }]}>
                Viewers Can Comment
              </Text>
              <Pressable>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Can Users Comment on Your Post"
                  value={canComment}
                  onChangeText={setCanComment}
                  editable={false}
                  onPressIn={toggleCanCommentPicker}
                ></TextInput>
              </Pressable>
              {canCommentPicker && (
                <Picker
                  selectedValue={canComment}
                  onValueChange={(itemValue) =>
                    setCanComment(itemValue)
                  }
                >
                  <Picker.Item label="Yes" value="yes" />
                  <Picker.Item label="No" value="no" />
                </Picker>
              )}
            </View>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors.text }]}>
                Viewers Can Share
              </Text>
              <Pressable>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Can Users Share your Post"
                  value={canShare}
                  onChangeText={setCanShare}
                  editable={false}
                  onPressIn={toggleCanSharePicker}
                ></TextInput>
              </Pressable>
              {canSharePicker && (
                <Picker
                  selectedValue={canShare}
                  onValueChange={(itemValue) =>
                    setCanShare(itemValue)
                  }
                >
                  <Picker.Item label="Yes" value="yes" />
                  <Picker.Item label="No" value="no" />
                </Picker>
              )}
            </View>
          </View>
          <View style={globalStyles.groupPadding}>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors.text }]}>
                Your Industry
              </Text>
              <Pressable>
                <TextInput
                  style={globalStyles.input}
                  placeholder="What is the Industry you Operate in"
                  value={industry}
                  onChangeText={setIndustry}
                  editable={false}
                  onPressIn={toggleIndustryPicker}
                ></TextInput>
              </Pressable>
              {industryPicker && (
                <Picker
                  selectedValue={industry}
                  onValueChange={(itemValue) =>
                    setIndustry(itemValue)
                  }
                >
                  <Picker.Item label="Architecture" value="architecture" />
                  <Picker.Item label="Education" value="education" />
                  <Picker.Item label="Engineering" value="engineer" />
                  <Picker.Item
                    label="Financial Services & Insurance"
                    value="financial"
                  />
                  <Picker.Item label="Government" value="government" />
                  <Picker.Item
                    label="Healthcare & Pharmaceutical"
                    value="healthcare"
                  />
                  <Picker.Item label="Hospitality" value="hospitality" />
                  <Picker.Item
                    label="Manufacturing/ Industrial"
                    value="manufacturing"
                  />
                  <Picker.Item label="Marketing" value="marketing" />
                  <Picker.Item label="Media & Entertainment" value="media" />
                  <Picker.Item label="Non-Profit" value="nonprofit" />
                  <Picker.Item
                    label="Professional Services"
                    value="professional"
                  />
                  <Picker.Item
                    label="Retail & Consumer Products"
                    value="retail"
                  />
                  <Picker.Item label="Sports" value="sports" />
                  <Picker.Item label="Tech" value="tech" />
                  <Picker.Item
                    label="Telecommunications"
                    value="telecommunications"
                  />
                  <Picker.Item label="Transportation" value="transportation" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
              )}
            </View>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors.text }]}>
                Looking for B2B Relationships
              </Text>
              <Pressable>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Business to Business?"
                  value={B2B}
                  onChangeText={setB2B}
                  editable={false}
                  onPressIn={toggleB2BPicker}
                ></TextInput>
              </Pressable>
              {B2BPicker && (
                <Picker
                  selectedValue={B2B}
                  onValueChange={(itemValue) => setB2B(itemValue)}
                >
                  <Picker.Item label="Yes" value="yes" />
                  <Picker.Item label="No" value="no" />
                </Picker>
              )}
            </View>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors.text }]}>
                E-Commerce
              </Text>
              <Pressable>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Would you like to Sell Items"
                  value={eComm}
                  onChangeText={setEComm}
                  editable={false}
                  onPressIn={toggleECommPicker}
                ></TextInput>
              </Pressable>
              {eCommPicker && (
                <Picker
                  selectedValue={eComm}
                  onValueChange={(itemValue) => setEComm(itemValue)}
                >
                  <Picker.Item label="Yes" value="yes" />
                  <Picker.Item label="No" value="no" />
                </Picker>
              )}
            </View>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors.text }]}>
                Upload Content
              </Text>
              <Pressable>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Do you have Content to Upload"
                  value={upload}
                  onChangeText={setUpload}
                  editable={false}
                  onPressIn={toggleUploadPicker}
                ></TextInput>
              </Pressable>
              {uploadPicker && (
                <Picker
                  selectedValue={upload}
                  onValueChange={(itemValue) => setUpload(itemValue)}
                >
                  <Picker.Item label="Yes" value="yes" />
                  <Picker.Item label="No" value="no" />
                </Picker>
              )}
            </View>
          </View>
          <View style={globalStyles.groupPadding}>
            <Pressable
              style={[
                globalStyles.button,
                { backgroundColor: colors.triC, marginBottom: 25 },
              ]}
            >
              <Text style={globalStyles.buttonText} onPress={handleSubmit}>
                Save Changes
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
