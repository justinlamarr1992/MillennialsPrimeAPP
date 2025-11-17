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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { logger } from "@/utils/logger";

export default function ArtScreen() {
  const router = useRouter();
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

  const handleSubmit = async () => {
    logger.log('Art settings submit button pressed');
    try {
      logger.log('Art settings submission started');
      // TODO: Add backend API call to save art settings
      // await axiosPrivate.patch(`/users/${userId}/art-settings`, { ... });

      router.push("/(tabs)/(home)/HomePage");
      logger.log('Art settings submitted successfully');
    } catch (err) {
      logger.error('Art settings submission error:', err);
      // Optionally show error message to user
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
              <Text style={globalStyles.labelText}>Are you an Artist</Text>
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
              {artist == "Yes" && (
                <View>
                  <View style={globalStyles.groupPadding}>
                    <View style={globalStyles.labelInput}>
                      <Text style={globalStyles.labelText}>
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
                      <Text style={globalStyles.labelText}>
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
                      <Text style={globalStyles.labelText}>
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
                      <Text style={globalStyles.labelText}>
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
                      <Text style={globalStyles.labelText}>
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
                      <Text style={globalStyles.labelText}>
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
                      <Text style={globalStyles.labelText}>
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
                      <Text style={globalStyles.labelText}>
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
                      <Text style={globalStyles.labelText}>
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
                    {network == "Yes" && (
                      <View style={globalStyles.labelInput}>
                        <Text style={globalStyles.labelText}>
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
                      <Text style={globalStyles.labelText}>
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
                    {specificIntegral == "Yes" && (
                      <View style={globalStyles.labelInput}>
                        <Text style={globalStyles.labelText}>What is it?</Text>
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
