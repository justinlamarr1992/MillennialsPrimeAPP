import React, { useState, useEffect } from "react";
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
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { logger } from "@/utils/logger";
import useAuth from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { userProfileService } from "@/services/userProfileService";

export default function ArtScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, refetch } = useUserProfile();
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  const [artist, setArtist] = useState<string>("");
  const [artistPicker, setArtistPicker] = useState<boolean>(false);
  const [professional, setProfessional] = useState<string>("");
  const [professionalPicker, setProfessionalPicker] = useState<boolean>(false);
  const [purpose, setPurpose] = useState<string>("");
  const [affectIssues, setAffectIssues] = useState<string>("");
  const [navigateIndustry, setNavigateIndustry] = useState<string>("");
  const [inspirationOfWork, setInspirationOfWork] = useState<string>("");
  const [styleChanged, setStyleChanged] = useState<string>("");
  const [favsOrNoneFavs, setFavsOrNoneFavs] = useState<string>("");
  const [network, setNetwork] = useState<string>("");
  const [networkPicker, setNetworkPicker] = useState<boolean>(false);
  const [support, setSupport] = useState<string>("");
  const [critics, setCritics] = useState<string>("");
  const [specificIntegral, setSpecificIntegral] = useState<string>("");
  const [specificIntegralPicker, setSpecificIntegralPicker] = useState<boolean>(false);
  const [whatSpecfic, setWhatSpecfic] = useState<string>("");

  const toggleArtistPicker = () => {
    setArtistPicker(!artistPicker);
  };
  const toggleProfessionalPicker = () => {
    setProfessionalPicker(!professionalPicker);
  };
  const toggleNetworkPicker = () => {
    setNetworkPicker(!networkPicker);
  };
  const toggleSpecificIntegralPicker = () => {
    setSpecificIntegralPicker(!specificIntegralPicker);
  };

  // Populate form fields when profile data is fetched
  useEffect(() => {
    if (profile?.art) {
      if (__DEV__) {
        logger.log('📝 Populating art form with profile data:', profile.art);
      }
      setArtist(profile.art.artist ? "Yes" : "No");
      setProfessional(profile.art.professional ? "Yes" : "No");
      setPurpose(profile.art.purpose || "");
      setFavsOrNoneFavs(profile.art.favsOrNoneFavs || "");
      setAffectIssues(profile.art.affectIssues || "");
      setNavigateIndustry(profile.art.navigateIndustry || "");
      setNetwork(profile.art.network ? "Yes" : "No");
      setSpecificIntegral(profile.art.specificIntegral ? "Yes" : "No");
    }
  }, [profile]);

  const handleSubmit = async () => {
    if (__DEV__) {
      logger.log('💾 Art settings submit button pressed');
    }

    // Validation is optional for art settings since all fields are optional
    // Users can skip this section if they're not artists

    try {
      if (__DEV__) {
        logger.log('📤 Art settings submission started');
      }

      if (!user) {
        if (__DEV__) {
          logger.warn('⚠️ No authenticated user found');
        }
        Alert.alert('Error', 'Please log in to save your art information.');
        return;
      }

      // Save art data to MongoDB server
      await userProfileService.updateArt({
        artist,
        professionalArtist: professional,
        purpose,
        favorites: favsOrNoneFavs,
        issues: affectIssues,
        industryNavigation: navigateIndustry,
        network,
        integral: specificIntegral,
      });

      if (__DEV__) {
        logger.log('✅ Art settings saved successfully');
      }

      // Refetch profile to get updated data
      await refetch();

      Alert.alert('Success', 'Your art information has been updated!');

      router.push("/(tabs)/(home)/HomePage");
    } catch (err) {
      logger.error('❌ Art settings submission error:', err);
      Alert.alert('Error', 'Failed to save art settings. Please try again.');
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
          <View style={globalStyles.formTitle}>
            <Text style={[globalStyles.textTitle, { color: colors.text }]}>
              Art Information
            </Text>
            <Text style={[globalStyles.labelText, { color: colors.text }]}>
              Edit your Artist information
            </Text>
          </View>
          <View style={globalStyles.groupPadding}>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors.text }]}>Are you an Artist</Text>
              <Pressable>
                <TextInput
                  style={globalStyles.settingsInput}
                  placeholder="Select Answer"
                  value={artist}
                  onChangeText={setArtist}
                  editable={false}
                  onPressIn={toggleArtistPicker}
                ></TextInput>
              </Pressable>
              {artistPicker && (
                <Picker
                  selectedValue={artist}
                  onValueChange={(itemValue) => setArtist(itemValue)}
                >
                  <Picker.Item label="Yes" value="Yes" />
                  <Picker.Item label="No" value="No" />
                </Picker>
              )}
              {artist === "Yes" && (
                <View>
                  <View style={globalStyles.groupPadding}>
                    <View style={globalStyles.labelInput}>
                      <Text style={[globalStyles.labelText, { color: colors.text }]}>
                        Have you worked as a professional artist before?
                      </Text>
                      <Pressable>
                        <TextInput
                          style={globalStyles.input}
                          placeholder="Professional?"
                          value={professional}
                          onChangeText={setProfessional}
                          editable={false}
                          onPressIn={toggleProfessionalPicker}
                        ></TextInput>
                      </Pressable>
                      {professionalPicker && (
                        <Picker
                          selectedValue={professional}
                          onValueChange={(itemValue) =>
                            setProfessional(itemValue)
                          }
                        >
                          <Picker.Item label="Yes" value="Yes" />
                          <Picker.Item label="No" value="No" />
                        </Picker>
                      )}
                    </View>

                    <View style={globalStyles.labelInput}>
                      <Text style={[globalStyles.labelText, { color: colors.text }]}>
                        What is the purpose of your work?
                      </Text>
                      <TextInput
                        style={globalStyles.settingsInput}
                        placeholder="Ahh Whats the purpose"
                        value={purpose}
                        onChangeText={setPurpose}
                      ></TextInput>
                    </View>
                    <View style={globalStyles.labelInput}>
                      <Text style={[globalStyles.labelText, { color: colors.text }]}>
                        Favorite and least favorite parts of professional art?
                      </Text>
                      <TextInput
                        style={globalStyles.settingsInput}
                        placeholder="Favs and Least"
                        value={favsOrNoneFavs}
                        onChangeText={setFavsOrNoneFavs}
                      ></TextInput>
                    </View>
                    <View style={globalStyles.labelInput}>
                      <Text style={[globalStyles.labelText, { color: colors.text }]}>
                        How can your work affect societal issues?
                      </Text>
                      <TextInput
                        style={globalStyles.settingsInput}
                        placeholder="Let's Get Deep"
                        value={affectIssues}
                        onChangeText={setAffectIssues}
                      ></TextInput>
                    </View>
                  </View>
                  <View style={globalStyles.groupPadding}>
                    <View style={globalStyles.labelInput}>
                      <Text style={[globalStyles.labelText, { color: colors.text }]}>
                        Which art/music trends inspire your current work?
                      </Text>
                      <TextInput
                        style={globalStyles.settingsInput}
                        placeholder="WHere does it come from"
                        value={inspirationOfWork}
                        onChangeText={setInspirationOfWork}
                      ></TextInput>
                    </View>
                    <View style={globalStyles.labelInput}>
                      <Text style={[globalStyles.labelText, { color: colors.text }]}>
                        How has your style changed over time?
                      </Text>
                      <TextInput
                        style={globalStyles.settingsInput}
                        placeholder="Compare from then to Now"
                        value={styleChanged}
                        onChangeText={setStyleChanged}
                      ></TextInput>
                    </View>
                    <View style={globalStyles.labelInput}>
                      <Text style={[globalStyles.labelText, { color: colors.text }]}>
                        What have critics said about your work?
                      </Text>
                      <TextInput
                        style={globalStyles.settingsInput}
                        placeholder="Those Darn Critics"
                        value={critics}
                        onChangeText={setCritics}
                      ></TextInput>
                    </View>
                    <View style={globalStyles.labelInput}>
                      <Text style={[globalStyles.labelText, { color: colors.text }]}>
                        How do you navigate the professional art industry?
                      </Text>
                      <TextInput
                        style={globalStyles.settingsInput}
                        placeholder="Tell me how"
                        value={navigateIndustry}
                        onChangeText={setNavigateIndustry}
                      ></TextInput>
                    </View>
                  </View>
                  <View style={globalStyles.groupPadding}>
                    <View style={globalStyles.labelInput}>
                      <Text style={[globalStyles.labelText, { color: colors.text }]}>
                        Do you have a network of other Artist
                      </Text>
                      <Pressable>
                        <TextInput
                          style={globalStyles.input}
                          placeholder="Art Friends?"
                          value={network}
                          onChangeText={setNetwork}
                          editable={false}
                          onPressIn={toggleNetworkPicker}
                        ></TextInput>
                      </Pressable>
                      {networkPicker && (
                        <Picker
                          selectedValue={network}
                          onValueChange={(itemValue) =>
                            setNetwork(itemValue)
                          }
                        >
                          <Picker.Item label="Yes" value="Yes" />
                          <Picker.Item label="No" value="No" />
                        </Picker>
                      )}
                    </View>
                    {network === "Yes" && (
                      <View style={globalStyles.labelInput}>
                        <Text style={[globalStyles.labelText, { color: colors.text }]}>
                          How do they Support you?
                        </Text>
                        <TextInput
                          style={globalStyles.settingsInput}
                          placeholder="We need deets"
                          value={support}
                          onChangeText={setSupport}
                        ></TextInput>
                      </View>
                    )}

                    <View style={globalStyles.labelInput}>
                      <Text style={[globalStyles.labelText, { color: colors.text }]}>
                        Anything specific integral to your work?
                      </Text>
                      <Pressable>
                        <TextInput
                          style={globalStyles.input}
                          placeholder="INTEGRAL?!?!??"
                          value={specificIntegral}
                          onChangeText={setSpecificIntegral}
                          editable={false}
                          onPressIn={toggleSpecificIntegralPicker}
                        ></TextInput>
                      </Pressable>
                      {specificIntegralPicker && (
                        <Picker
                          selectedValue={specificIntegral}
                          onValueChange={(itemValue) =>
                            setSpecificIntegral(itemValue)
                          }
                        >
                          <Picker.Item label="Yes" value="Yes" />
                          <Picker.Item label="No" value="No" />
                        </Picker>
                      )}
                    </View>
                    {specificIntegral === "Yes" && (
                      <View style={globalStyles.labelInput}>
                        <Text style={[globalStyles.labelText, { color: colors.text }]}>What is it?</Text>
                        <TextInput
                          style={globalStyles.settingsInput}
                          placeholder="We need deets"
                          value={whatSpecfic}
                          onChangeText={setWhatSpecfic}
                        ></TextInput>
                      </View>
                    )}
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Button */}
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
