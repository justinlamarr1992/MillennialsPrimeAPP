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
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";

export default function MyInfoScreen() {
  // const axiosPrivate = useAxiosPrivate();
  // const { auth, accessToken, roles, id, logout, userInfo } =
  //   useContext(AuthContext);
  // let _id = id;

  // console.log(`AuthContext ${accessToken}`);

  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  // Use States
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [date, setDate] = useState(new Date());
  const [name, setName] = useState("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [DOB, setDOB] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [zip, setZip] = useState<string>("");
  const [canLike, setCanLike] = useState<"yes" | "no" | "">("");
  const [canDislike, setCanDislike] = useState<"yes" | "no" | "">("");
  const [canComment, setCanComment] = useState<"yes" | "no" | "">("");
  const [canShare, setCanShare] = useState<"yes" | "no" | "">("");
  const [industry, setIndustry] = useState<string>("");
  const [B2B, setB2B] = useState<string>("");
  const [eComm, setEComm] = useState<string>("");
  const [upload, setUpload] = useState<string>("");

  // Pickers
  const [showPicker, setShowPicker] = useState(false);
  const [canLikePicker, setCanLikePicker] = useState(false);
  const [canDislikePicker, setCanDislikePicker] = useState(false);
  const [canCommentPicker, setCanCommentPicker] = useState(false);
  const [canSharePicker, setCanSharePicker] = useState(false);
  const [industryPicker, setIndustryPicker] = useState(false);
  const [B2BPicker, setB2BPicker] = useState(false);
  const [eCommPicker, setECommPicker] = useState(false);
  const [uploadPicker, setUploadPicker] = useState(false);

  let values = {
    name,
    username,
    email,
    DOB,
    country,
    state,
    city,
    zip,
    canLike,
    canDislike,
    canComment,
    canShare,
    industry,
    B2B,
    eComm,
    upload,
  };

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

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };
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
  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "set" && selectedDate) {
      setDate(selectedDate);

      if (Platform.OS === "android") {
        toggleDatePicker();
        setDateOfBirth(selectedDate.toDateString());
      }
    } else {
      toggleDatePicker();
    }
  };

  const confirmIOSDate = () => {
    setDateOfBirth(date.toDateString());
    toggleDatePicker();
  };

  // TODO: Implement Firebase integration for form submission
  // The commented code below shows the original backend integration pattern.
  // To implement:
  // 1. Uncomment imports: useAxiosPrivate, useContext, AuthContext (lines 18-21)
  // 2. Update AuthContext to include: auth, accessToken, roles, id, logout, userInfo
  // 3. OR migrate to Firebase Firestore for data storage
  // 4. Update the user document in Firestore with the form values
  const handleSubmit = async () => {
    try {
      console.log("Started the APP test");
      // let dataToSubmit = {
      //   name,
      //   username,
      //   email,
      //   DOB,
      //   country,
      //   state,
      //   city,
      //   zip,
      //   canLike,
      //   canDislike,
      //   canComment,
      //   canShare,
      //   industry,
      //   B2B,
      //   eComm,
      //   upload,
      // };
      // console.log(`From useContext id: ${id}`);
      // console.log(`Saved to useState _id: ${_id}`);
      console.log("Starting the try to get in to back end ");
      // const response = await axiosPrivate.patch(
      //   `https://us-central1-millennialsprime.cloudfunctions.net/api/users/${_id}`,
      //   { values }
      // );
      // const response = await axios.patch(
      //   `users/profilesettings/662a6321a0e8a4dd4be50586`,
      //   { dataToSubmit }
      // );

      // console.log(response);
    } catch (err) {
      console.log("ERR", err);
    }
    // finally {
    // console.log("It worked!!!");
    // navigation.jumpTo("Business");
    // navigation.navigate("Business");
    // }
    console.log("Handle Submit pressed");
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
                  editable={false}
                  onPressIn={toggleCanLikePicker}
                ></TextInput>
              </Pressable>

              {canLikePicker && (
                <Picker
                  style={{}}
                  selectedValue={canLike}
                  onValueChange={(itemValue, itemIndex) =>
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
                  editable={false}
                  onPressIn={toggleCanDislikePicker}
                ></TextInput>
              </Pressable>
              {canDislikePicker && (
                <Picker
                  selectedValue={canDislike}
                  onValueChange={(itemValue, itemIndex) =>
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
                  editable={false}
                  onPressIn={toggleCanCommentPicker}
                ></TextInput>
              </Pressable>
              {canCommentPicker && (
                <Picker
                  selectedValue={canComment}
                  onValueChange={(itemValue, itemIndex) =>
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
                  editable={false}
                  onPressIn={toggleCanSharePicker}
                ></TextInput>
              </Pressable>
              {canSharePicker && (
                <Picker
                  selectedValue={canShare}
                  onValueChange={(itemValue, itemIndex) =>
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
                  onValueChange={(itemValue, itemIndex) =>
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
                  onValueChange={(itemValue, itemIndex) => setB2B(itemValue)}
                >
                  <Picker.Item label="Yes" value="yes" />
                  <Picker.Item label="No" value="no" />
                </Picker>
              )}
            </View>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors.text }]}>
                E-Commerence
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
                  onValueChange={(itemValue, itemIndex) => setEComm(itemValue)}
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
                  placeholder="Do you have Cont to Upload"
                  value={upload}
                  onChangeText={setUpload}
                  editable={false}
                  onPressIn={toggleUploadPicker}
                ></TextInput>
              </Pressable>
              {uploadPicker && (
                <Picker
                  selectedValue={upload}
                  onValueChange={(itemValue, itemIndex) => setUpload(itemValue)}
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
