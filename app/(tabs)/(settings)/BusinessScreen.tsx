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
import { router } from "expo-router";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import { logger } from "@/utils/logger";

export default function BusinessScreen() {
  // const { auth, accessToken, roles, id, logout, userInfo } =
  //   useContext(AuthContext);

  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  const [entrepreneur, setEntrepreneur] = useState<string>("");
  const [entrepreneurPicker, setEntrepreneurPicker] = useState<boolean>(false);
  const [industry, setIndustry] = useState<string>("");
  const [industryPicker, setIndustryPicker] = useState<boolean>(false);
  const [openOnMillPrime, setOpenOnMillPrime] = useState<string>("");
  const [openOnMillPrimePicker, setOpenOnMillPrimePicker] = useState<boolean>(false);
  const [lengthOpen, setLengthOpen] = useState<string>("");
  const [lengthOpenPicker, setLengthOpenPicker] = useState<boolean>(false);
  const [whyBusiness, setWhyBusiness] = useState<string>("");
  const [whyBusinessPicker, setWhyBusinessPicker] = useState<boolean>(false);
  const [firstObjective, setFirstObjective] = useState<string>("");
  const [objectiveNow, setObjectiveNow] = useState<string>("");
  const [howMany, setHowMany] = useState<string>("");
  const [howManyPicker, setHowManyPicker] = useState<boolean>(false);
  const [productsAndServices, setProductsAndServices] = useState<string>("");
  const [primaryPromotion, setPrimaryPromotion] = useState<string>("");
  const [primaryPromotionPicker, setPrimaryPromotionPicker] = useState<boolean>(false);
  const [factorsOfLocation, setFactorsOfLocation] = useState<string>("");
  const [factorsOfLocationPicker, setFactorsOfLocationPicker] = useState<boolean>(false);

  const toggleEntrepreneurPicker = () => {
    setEntrepreneurPicker(!entrepreneurPicker);
  };
  const toggleOpenOnMillPrimePicker = () => {
    setOpenOnMillPrimePicker(!openOnMillPrimePicker);
  };
  const toggleIndustryPicker = () => {
    setIndustryPicker(!industryPicker);
  };
  const toggleLengthOpenPicker = () => {
    setLengthOpenPicker(!lengthOpenPicker);
  };
  const toggleWhyBusinessPicker = () => {
    setWhyBusinessPicker(!whyBusinessPicker);
  };
  const toggleHowManyPicker = () => {
    setHowManyPicker(!howManyPicker);
  };
  const togglePrimaryPromotionPicker = () => {
    setPrimaryPromotionPicker(!primaryPromotionPicker);
  };
  const toggleFactorsOfLocationPicker = () => {
    setFactorsOfLocationPicker(!factorsOfLocationPicker);
  };

  const handleSubmit = async () => {
    try {
      logger.log('Business settings submission started');
      // TODO: Add backend API call to save business settings
      // await axiosPrivate.patch(`/users/${userId}/business-settings`, { ... });
    } catch (err) {
      logger.error('Business settings submission error:', err);
    } finally {
      logger.log('Business settings submitted successfully');
      // Navigate to ArtScreen (next step in settings flow)
      router.push("/(tabs)/(settings)/ArtScreen");
    }
    logger.log('Business settings submit button pressed');
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
              Business Information
            </Text>
            <Text style={[globalStyles.labelText, { color: colors.text }]}>
              Edit your Business information
            </Text>
          </View>
          <View style={globalStyles.groupPadding}>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors.text }]}>
                Do you have a Business
              </Text>
              <Pressable>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Do you have a Business"
                  placeholderTextColor={colors["plcHoldText"]}
                  value={entrepreneur}
                  onChangeText={setEntrepreneur}
                  editable={false}
                  onPressIn={toggleEntrepreneurPicker}
                ></TextInput>
              </Pressable>
              {entrepreneurPicker && (
                <Picker
                  selectedValue={entrepreneur}
                  onValueChange={(itemValue) =>
                    setEntrepreneur(itemValue)
                  }
                  itemStyle={{
                    color: colors.text,
                  }}
                >
                  <Picker.Item
                    label="Select an Answer"
                    value="Select an Answer"
                  />
                  <Picker.Item label="Yes" value="Yes" />
                  <Picker.Item label="No" value="No" />
                </Picker>
              )}
              {entrepreneur == "Yes" && (
                <View>
                  <View style={globalStyles.groupPadding}>
                    {/* Company Logo and Change Logo stuff here */}
                  </View>
                  <View style={globalStyles.groupPadding}>
                    <View style={globalStyles.labelInput}>
                      <Text
                        style={[globalStyles.labelText, { color: colors.text }]}
                      >
                        What is the Name of the Company
                      </Text>
                      <TextInput
                        style={globalStyles.settingsInput}
                        placeholder="Enter Name"
                        placeholderTextColor={colors["plcHoldText"]}
                      ></TextInput>
                    </View>
                    <View style={globalStyles.labelInput}>
                      <Text
                        style={[globalStyles.labelText, { color: colors.text }]}
                      >
                        Are you Open to Business with Users here.
                      </Text>
                      <Pressable>
                        <TextInput
                          style={globalStyles.input}
                          placeholder="Do you have a Business"
                          value={openOnMillPrime}
                          onChangeText={setOpenOnMillPrime}
                          editable={false}
                          onPressIn={toggleOpenOnMillPrimePicker}
                        ></TextInput>
                      </Pressable>
                      {openOnMillPrimePicker && (
                        <Picker
                          selectedValue={openOnMillPrime}
                          onValueChange={(itemValue) =>
                            setOpenOnMillPrime(itemValue)
                          }
                          itemStyle={{
                            color: "pink",
                            backgroundColor: "orange",
                          }}
                        >
                          <Picker.Item label="Yes" value="Yes" />
                          <Picker.Item label="No" value="No" />
                        </Picker>
                      )}
                    </View>
                  </View>
                  <View style={globalStyles.groupPadding}>
                    <View style={globalStyles.labelInput}>
                      <Text style={globalStyles.labelText}>
                        What is the Industry you Operate in
                      </Text>
                      <Pressable>
                        <TextInput
                          style={globalStyles.input}
                          placeholder="Select Industry"
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
                          <Picker.Item
                            label="Architecture"
                            value="architecture"
                          />
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
                          <Picker.Item
                            label="Hospitality"
                            value="hospitality"
                          />
                          <Picker.Item
                            label="Manufacturing/ Industrial"
                            value="manufacturing"
                          />
                          <Picker.Item label="Marketing" value="marketing" />
                          <Picker.Item
                            label="Media & Entertainment"
                            value="media"
                          />
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
                          <Picker.Item
                            label="Transportation"
                            value="transportation"
                          />
                          <Picker.Item label="Other" value="other" />
                        </Picker>
                      )}
                    </View>
                    <View style={globalStyles.labelInput}>
                      <Text style={globalStyles.labelText}>
                        Why start a business in the Industry
                      </Text>
                      <TextInput
                        style={globalStyles.settingsInput}
                        placeholder="Enter Answer Here"
                      ></TextInput>
                    </View>
                    <View style={globalStyles.labelInput}>
                      <Text style={globalStyles.labelText}>
                        How long have you ran your business?
                      </Text>
                      <Pressable>
                        <TextInput
                          style={globalStyles.input}
                          placeholder="Select Industry"
                          value={lengthOpen}
                          onChangeText={setLengthOpen}
                          editable={false}
                          onPressIn={toggleLengthOpenPicker}
                        ></TextInput>
                      </Pressable>
                      {lengthOpenPicker && (
                        <Picker
                          selectedValue={lengthOpen}
                          onValueChange={(itemValue) =>
                            setLengthOpen(itemValue)
                          }
                        >
                          <Picker.Item
                            label="5+ Years (Expert)"
                            value="expert"
                          />
                          <Picker.Item
                            label="2 - 5 Years (Professional)"
                            value="professional"
                          />
                          <Picker.Item
                            label="1 - 2 Years (Experienced)"
                            value="experienced"
                          />
                          <Picker.Item
                            label="0 - 11 Months (New)"
                            value="new"
                          />
                        </Picker>
                      )}
                    </View>
                    <View style={globalStyles.labelInput}>
                      <Text style={globalStyles.labelText}>
                        Why did you decide to start your own business
                      </Text>
                      <Pressable>
                        <TextInput
                          style={globalStyles.input}
                          placeholder="Whats the Inspiriation"
                          value={whyBusiness}
                          onChangeText={setWhyBusiness}
                          editable={false}
                          onPressIn={toggleWhyBusinessPicker}
                        ></TextInput>
                      </Pressable>
                      {whyBusinessPicker && (
                        <Picker
                          selectedValue={whyBusiness}
                          onValueChange={(itemValue) =>
                            setWhyBusiness(itemValue)
                          }
                        >
                          <Picker.Item
                            label="Follow My Passion"
                            value="passion"
                          />
                          <Picker.Item
                            label="Financial Independence"
                            value="financial"
                          />
                          <Picker.Item label="Be The Boss" value="boss" />
                          <Picker.Item
                            label="Start from Scratch"
                            value="start"
                          />
                          <Picker.Item label="Help Others" value="help" />
                          <Picker.Item label="Tax Benefits" value="taxes" />
                          <Picker.Item
                            label="Connect with Others"
                            value="connect"
                          />
                          <Picker.Item
                            label="Learn new Skills"
                            value="skills"
                          />
                          <Picker.Item label="Other" value="other" />
                        </Picker>
                      )}
                    </View>
                  </View>

                  <View style={globalStyles.groupPadding}>
                    <View style={globalStyles.labelInput}>
                      <Text style={globalStyles.labelText}>
                        What were the first objectives for the business?
                      </Text>
                      <TextInput
                        style={globalStyles.input}
                        placeholder="Enter Answer Here"
                        value={firstObjective}
                        onChangeText={setFirstObjective}
                      ></TextInput>
                    </View>
                    <View style={globalStyles.labelInput}>
                      <Text style={globalStyles.labelText}>
                        What are the objectives now?
                      </Text>
                      <TextInput
                        style={globalStyles.settingsInput}
                        placeholder="Enter Answer Here"
                        value={objectiveNow}
                        onChangeText={setObjectiveNow}
                      ></TextInput>
                    </View>
                    <View style={globalStyles.labelInput}>
                      <Text style={globalStyles.labelText}>
                        How many people work for the business?
                      </Text>
                      <Pressable>
                        <TextInput
                          style={globalStyles.input}
                          placeholder="How Many?"
                          value={howMany}
                          onChangeText={setHowMany}
                          editable={false}
                          onPressIn={toggleHowManyPicker}
                        ></TextInput>
                      </Pressable>
                      {howManyPicker && (
                        <Picker
                          selectedValue={howMany}
                          onValueChange={(itemValue) =>
                            setHowMany(itemValue)
                          }
                        >
                          <Picker.Item label="1" value="solo" />
                          <Picker.Item label="2 - 10" value="group" />
                          <Picker.Item label="11 - 40" value="team" />
                          <Picker.Item label="50+" value="enterprise" />
                        </Picker>
                      )}
                    </View>
                  </View>
                  <View style={globalStyles.groupPadding}>
                    <View style={globalStyles.labelInput}>
                      <Text style={globalStyles.labelText}>
                        What products or services do you offer?
                      </Text>
                      <TextInput
                        style={globalStyles.input}
                        placeholder="Enter Answer Here"
                        value={productsAndServices}
                        onChangeText={setProductsAndServices}
                      ></TextInput>
                    </View>
                    <View style={globalStyles.labelInput}>
                      <Text style={globalStyles.labelText}>
                        What Primary Method Promotes the Business?
                      </Text>
                      <Pressable>
                        <TextInput
                          style={globalStyles.settingsInput}
                          placeholder="Promotion?"
                          value={primaryPromotion}
                          onChangeText={setPrimaryPromotion}
                          editable={false}
                          onPressIn={togglePrimaryPromotionPicker}
                        ></TextInput>
                      </Pressable>
                      {primaryPromotionPicker && (
                        <Picker
                          selectedValue={primaryPromotion}
                          onValueChange={(itemValue) =>
                            setPrimaryPromotion(itemValue)
                          }
                        >
                          <Picker.Item label="Word of Mouth" value="mouth" />
                          <Picker.Item
                            label="Social Media"
                            value="social-media"
                          />
                          <Picker.Item
                            label="Referral Programs"
                            value="referral"
                          />
                          <Picker.Item label="Local Ads" value="ads" />
                          <Picker.Item label="Directory" value="directory" />
                          <Picker.Item
                            label="Loyalty Program"
                            value="loyalty"
                          />
                          <Picker.Item
                            label="Partnerships"
                            value="partnership"
                          />
                          <Picker.Item label="Website" value="website" />
                          <Picker.Item label="Other" value="other" />
                        </Picker>
                      )}
                    </View>
                    <View style={globalStyles.labelInput}>
                      <Text style={globalStyles.labelText}>
                        What factors influenced the location?
                      </Text>
                      <Pressable>
                        <TextInput
                          style={globalStyles.input}
                          placeholder="Factors?"
                          value={factorsOfLocation}
                          onChangeText={setFactorsOfLocation}
                          editable={false}
                          onPressIn={toggleFactorsOfLocationPicker}
                        ></TextInput>
                      </Pressable>
                      {factorsOfLocation && (
                        <Picker
                          selectedValue={lengthOpen}
                          onValueChange={(itemValue) =>
                            setLengthOpen(itemValue)
                          }
                        >
                          <Picker.Item
                            label="Geographical Location"
                            value="Word of Mouth"
                          />
                          <Picker.Item
                            label="Operational Needs"
                            value="Social Media"
                          />
                          <Picker.Item
                            label="Rent Cost"
                            value="Referral Programs"
                          />
                          <Picker.Item label="Security" value="Local Ads" />
                          <Picker.Item label="Competition" value="Directory" />
                          <Picker.Item
                            label="Growth Potential"
                            value="Loyalty Program"
                          />
                          <Picker.Item
                            label="Accessibility"
                            value="Partnerships"
                          />
                          <Picker.Item
                            label="Utilities and Infrastructure"
                            value="Website"
                          />
                          <Picker.Item label="Other" value="Other" />
                        </Picker>
                      )}
                    </View>
                  </View>
                </View>
              )}
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
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
