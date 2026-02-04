import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
  TextInput,
  Switch,
  useColorScheme,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import { logger } from "@/utils/logger";
import { validateName, validateBio, validateInterests } from "@/utils/validation";
import ProfilePicture from "@/components/ProfilePicture";
import TagInput from "@/components/TagInput";
import useAuth from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useProfilePictureUpload } from "@/hooks/useProfilePictureUpload";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { userProfileService } from "@/services/userProfileService";

export default function EditProfileScreen() {
  const { user } = useAuth();
  const { profile, refetch } = useUserProfile();
  const { profileImageUri, handleImageSelected, isUploading } = useProfilePictureUpload();
  useAxiosPrivate();

  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  // Form state
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [b2bOpportunities, setB2bOpportunities] = useState(false);

  // Character count for bio (matches validateBio, which uses trim().length)
  const bioCharCount = bio.trim().length;
  const bioMaxChars = 200;

  // Populate form fields when profile data is fetched
  useEffect(() => {
    if (profile) {
      if (__DEV__) {
        logger.log("📝 Populating Edit Profile form with profile data:", profile);
      }
      setName(profile.name || "");
      setBio(profile.bio || "");
      setCity(profile.location?.city || "");
      setState(profile.location?.state || "");
      setCountry(profile.location?.country || "");
      setInterests(profile.interests || []);
      setB2bOpportunities(profile.b2bOpportunities || false);
    }
  }, [profile]);

  const handleSubmit = async () => {
    logger.log("💾 Edit Profile submit button pressed");

    // Validate form fields
    const nameError = validateName(name);
    const bioError = validateBio(bio);
    const interestsError = validateInterests(interests);

    // Collect all errors
    const errors: string[] = [];
    if (nameError) errors.push(nameError);
    if (bioError) errors.push(bioError);
    if (interestsError) errors.push(interestsError);

    // Show validation errors if any
    if (errors.length > 0) {
      Alert.alert("Validation Error", errors.join("\n"));
      logger.warn("⚠️ Edit Profile validation failed:", errors);
      return;
    }

    try {
      logger.log("📤 Edit Profile form submission started");

      if (!user) {
        logger.warn("⚠️ No authenticated user found");
        return;
      }

      // Save profile data to MongoDB server
      await userProfileService.updateEditProfile({
        name,
        bio,
        city,
        state,
        country,
        interests,
        b2bOpportunities,
      });

      logger.log("✅ Edit Profile settings saved successfully");

      // Refetch profile to get updated data
      await refetch();

      Alert.alert("Success", "Your profile has been updated!");

      // Navigate back to profile
      router.back();
    } catch (err) {
      logger.error("❌ Edit Profile submission error:", err);
      Alert.alert("Error", "Failed to save profile. Please try again.");
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
          style={[globalStyles.padding, globalStyles.marginB100]}
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
              onImageSelected={handleImageSelected}
              size={120}
              editable={true}
              isUploading={isUploading}
            />
            <Text style={[globalStyles.textTitle, { color: colors.text, marginTop: 16 }]}>
              Edit Profile
            </Text>
            <Text style={[globalStyles.labelText, { color: colors.text }]}>
              Update your profile information
            </Text>
          </View>

          {/* Basic Information */}
          <View style={globalStyles.groupPadding}>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors.text }]}>
                Name
              </Text>
              <TextInput
                style={globalStyles.input}
                placeholderTextColor={colors.plcHoldText}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors.text }]}>
                Bio
              </Text>
              <TextInput
                style={[globalStyles.input, { height: 100, textAlignVertical: "top" }]}
                placeholderTextColor={colors.plcHoldText}
                placeholder="Tell us about yourself..."
                value={bio}
                onChangeText={setBio}
                multiline={true}
                maxLength={bioMaxChars}
              />
              <Text
                style={[
                  globalStyles.labelText,
                  {
                    color: colors.text,
                    fontSize: 12,
                    marginTop: 4,
                  },
                ]}
              >
                {bioCharCount}/{bioMaxChars} characters
              </Text>
            </View>
          </View>

          {/* Location */}
          <View style={globalStyles.groupPadding}>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors.text }]}>
                City
              </Text>
              <TextInput
                style={globalStyles.input}
                placeholderTextColor={colors.plcHoldText}
                placeholder="Enter city"
                value={city}
                onChangeText={setCity}
              />
            </View>

            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors.text }]}>
                State
              </Text>
              <TextInput
                style={globalStyles.input}
                placeholderTextColor={colors.plcHoldText}
                placeholder="Enter state"
                value={state}
                onChangeText={setState}
              />
            </View>

            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors.text }]}>
                Country
              </Text>
              <TextInput
                style={globalStyles.input}
                placeholderTextColor={colors.plcHoldText}
                placeholder="Enter country"
                value={country}
                onChangeText={setCountry}
              />
            </View>
          </View>

          {/* Interests */}
          <View style={globalStyles.groupPadding}>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors.text }]}>
                Interests
              </Text>
              <Text
                style={[
                  globalStyles.labelText,
                  { color: colors.text, fontSize: 12, marginBottom: 8 },
                ]}
              >
                Add topics you're interested in (max 10)
              </Text>
              <TagInput
                tags={interests}
                onTagsChange={setInterests}
                placeholder="Add interest"
              />
            </View>
          </View>

          {/* B2B Opportunities */}
          <View style={globalStyles.groupPadding}>
            <View style={globalStyles.labelInput}>
              <View
                style={[
                  globalStyles.flexRow,
                  globalStyles.flexJustifyContentSpaceBetween,
                  globalStyles.flexAlignItemsCenter,
                ]}
              >
                <View style={globalStyles.flex1}>
                  <Text style={[globalStyles.labelText, { color: colors.text }]}>
                    B2B Opportunities
                  </Text>
                  <Text
                    style={[
                      globalStyles.labelText,
                      { color: colors.text, fontSize: 12, marginTop: 4 },
                    ]}
                  >
                    Open to business collaborations
                  </Text>
                </View>
                <Switch
                  value={b2bOpportunities}
                  onValueChange={setB2bOpportunities}
                  trackColor={{ false: colors.secC, true: colors.priC }}
                  thumbColor={b2bOpportunities ? colors.quaC : colors.text}
                  accessibilityLabel="Toggle B2B opportunities"
                  accessibilityRole="switch"
                  accessibilityHint="Enable or disable business collaboration opportunities on your profile"
                />
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <View style={globalStyles.groupPadding}>
            <Pressable
              style={[
                globalStyles.button,
                { backgroundColor: colors.triC, marginBottom: 25 },
              ]}
              onPress={handleSubmit}
            >
              <Text style={globalStyles.buttonText}>Save Changes</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
