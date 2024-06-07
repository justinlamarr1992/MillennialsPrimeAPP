import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Button,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Alert,
  Modal,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";

import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { globalStyles } from "@/constants/global";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
// import UserInfo from "./PostItems/UserInfo";

import axios from "axios";

export default function ArtScreen() {
  const navigation = useNavigation();
  const colors = useTheme().colors;
  const [modalOpen, setModalOpen] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [artist, setArtist] = useState(null);
  const [artistPicker, setArtistPicker] = useState(null);
  const [professional, setProfessional] = useState(null);
  const [professionalPicker, setProfessionalPicker] = useState(null);
  const [purpose, setPurpose] = useState(null);
  const [affectIssues, setAffectIssues] = useState(null);
  const [navigateIndustry, setNavigateIndustry] = useState(null);
  const [inspirationOfWork, setInspirationOfWork] = useState(null);
  const [styleChanged, setStyleChanged] = useState(null);
  const [favsOrNoneFavs, setFavsOrNoneFavs] = useState(null);
  const [network, setNetwork] = useState(null);
  const [networkPicker, setNetworkPicker] = useState(null);
  const [support, setSupport] = useState(null);
  const [critics, setCritics] = useState(null);
  const [specificIntegral, setSpecificIntegral] = useState(null);
  const [specificIntegralPicker, setSpecificIntegralPicker] = useState(null);
  const [whatSpecfic, setWhatSpecfic] = useState(null);

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
    // Text Input for the Picker
    // <Pressable>
    //   <TextInput
    //     style={globalStyles.input}
    //     placeholder=""
    //     value={}
    //     onChangeText={}
    //     editable={false}
    //     onPressIn={toggle_Picker}
    //   ></TextInput>
    // </Pressable>;

    // Conditional to open Picker
    // {_Picker && ()}
  };
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

  const onChange = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setDate(currentDate);

      if (Platform.OS === "android") {
        toggleDatePicker();
        setDateOfBirth(currentDate.toDateString());
      }
    } else {
      toggleDatePicker();
    }
  };

  const confirmIOSDate = () => {
    setDateOfBirth(date.toDateString());
    toggleDatePicker();
  };

  const handleSubmit = async (e) => {
    try {
      console.log("Started the try to submit Art Stuff");
    } catch (err) {
      console.log("ERR", err);
    } finally {
      console.log("It worked!!!");
      // navigation.jumpTo("Business");
      navigation.navigate("Home");
    }
    console.log("Handle Submit pressed");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      enabled={true}
      style={globalStyles.flex1}
    >
      <View>
        <ScrollView
          style={[globalStyles.padding, globalStyles.marginB100, {}]}
          showsVerticalScrollIndicator={false}
        >
          <View style={globalStyles.formTitle}>
            <Text style={globalStyles.titleText}>Art Information</Text>
            <Text style={globalStyles.labelText}>
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
                  onValueChange={(itemValue, itemIndex) => setArtist(itemValue)}
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
                          onValueChange={(itemValue, itemIndex) =>
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
                          onValueChange={(itemValue, itemIndex) =>
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
                        Anything specific intgral to your work?
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
                          onValueChange={(itemValue, itemIndex) =>
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
                globalStyles.vertMargin,
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
