import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  useColorScheme,
} from "react-native";
import React, { useState, useRef } from "react";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import ImagePickerComponent from "./ImagePickerComponent";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

type UploadType = "Text" | "Images" | "Video" | "Music" | "Episode" | "E-Commerence" | null;

export default function UploadBox() {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  const axiosPrivate = useAxiosPrivate();
  // AuthContext
  // const { id } = useContext(AuthContext);
  // const _id = id;

  let videoFile: ImagePicker.ImagePickerAsset | undefined;

  var tus = require("tus-js-client");

  // Use States
  const [upload, setUpload] = useState<UploadType>(null);
  const [uploadPicker, setUploadPicker] = useState(false);
  const [userPosting, setUserPosting] = useState({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prime, setPrime] = useState("");
  const [primePicker, setPrimePicker] = useState(false);
  const [category, setCategory] = useState("");
  const [categoryPicker, setCategoryPicker] = useState(false);
  const [duration, setDuration] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [videoID, setVideoID] = useState("");

  const [valueStuff, setValueStuff] = useState(false);

  //   Use Refs
  const uploadRef = useRef<Picker<UploadType>>(null);

  const toggleUploadPicker = () => {
    setUploadPicker(!uploadPicker);
  };
  const togglePrimePicker = () => {
    setPrimePicker(!primePicker);
  };
  const toggleCategoryPicker = () => {
    setCategoryPicker(!categoryPicker);
  };

  const uploadCheck = (e: UploadType) => {
    setUploadPicker(false);
    console.log(e);
    if (e == "Text") {
      setUpload("Text");
    } else if (e == "Images") {
      setUpload("Images");
    } else if (e == "Video") {
      setUpload("Video");
      try {
        const options = {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/*+json",
            // Test
            AccessKey: "8ad268ac-6b0a-46fb-92d9b1a6d918-c4e1-4edf",
            // Live
            // AccessKey: "a80779d4-9931-4345-80c1ca2315d2-fc09-4143",
          },
          // body: `{"title":"(Pre upload) Creating Video ${title} ${new Date()}"}`,
          body: `{"title":"${title} ${new Date()}"}`,
        };

        fetch("https://video.bunnycdn.com/library/181057/videos", options)
          .then((response) => response.json())
          .then((response) => {
            console.log(response);
            setVideoID(response.guid);
            console.log("This is the videoID", videoID, new Date());
          });
      } catch (err) {
        console.log("ERROR", err);
      }

      // console.log(upload);
    } else if (e == "Music") {
      setUpload("Music");
    } else if (e == "Episode") {
      setUpload("Episode");
    } else if (e == "E-Commerence") {
      setUpload("E-Commerence");
    }
  };
  const handleChangeTitle = (text: string) => {
    setTitle(text);
  };
  const handleChangeDescription = (text: string) => {
    setDescription(text);
  };
  const handleWhoChange = (e: string) => {
    setPrime(e);
    setPrimePicker(false);
  };
  const handleCategoryChange = (e: string) => {
    setCategory(e);
    setCategoryPicker(false);
  };
  function setStuff(stuff: boolean) {
    console.log("To the Parent its ", stuff);
    setValueStuff(stuff);
  }
  //   stuff == videoValue
  function handleVideoSelect(videoValue: ImagePicker.ImagePickerResult) {
    // console.log("THIS IS THE INFO From Picture Picker ", videoValue);
    if (!videoValue.canceled && videoValue.assets && videoValue.assets[0]) {
      videoFile = videoValue.assets[0];
      console.log("Video file after button click", videoFile);
    }
  }
  const handleSubmit = () => {
    // No e.preventDefault() needed in React Native

    if (
      title === "" ||
      description === "" ||
      category === ""
      // file === []
      // file === ""
      // duration === "" ||
      // thumbnail === ""
    )
      return alert("Fill all of the fileds");

    // Build form data object for axios request
    const formData: Record<string, string | number> = {
      // userPosting: _id,
      title: title,
      description: description,
      prime: prime,
      // file: file,
      category: category,
      duration: duration,
      thumbnail: thumbnail,
      videoID: videoID,
      // later library ID if a Prime Submitter
    };

    const sendToBackEnd = async () => {
      try {
        console.log("Step 1");
        console.log("Video file before backend data", videoFile);

        const response = await axiosPrivate.post(`/videos/bunnyInfo`, formData);
        console.log(response.data);
        if (response.data.success === true) {
          // Validate videoFile exists before attempting upload
          if (!videoFile) {
            console.error("No video file selected");
            return alert("Please select a video file before uploading");
          }

          try {
            // console.log("Video file after backend data", videoFile);
            // console.log("Video file individual data", videoFile);
            console.log("Step 2");
            // Create a new tus upload
            var upload = new tus.Upload(videoFile, {
              // var upload = new tus.Upload(file, {
              endpoint: "https://video.bunnycdn.com/tusupload",
              retryDelays: [0, 3000, 5000, 10000, 20000, 60000, 60000],
              headers: {
                AuthorizationSignature: response.data.shaAttempt, // SHA256 signature (library_id + api_key + expiration_time + video_id)
                AuthorizationExpire: response.data.authorizationExpire, // Expiration time as in the signature,
                VideoId: response.data.video_id,
                // "video-guid", // The guid of a previously created video object through the Create Video API call
                LibraryId: response.data.libraryId,
              },
              metadata: {
                filetype: videoFile?.type || "",
                title: "Is this where the title is changed",
                collection: "collectionID",
              },
              onError: function (error: Error) {
                console.log("Step 2.5");
                console.log("ERROR", error);
              },
              onProgress: function (bytesUploaded: number, bytesTotal: number) {
                console.log("Step 3");
                console.log(
                  bytesTotal,
                  "Bytes Total",
                  bytesUploaded,
                  "Bytes Uploaded"
                );
              },
              onSuccess: function () {
                console.log("Step 4");
                console.log("The video Uploaded Great Job");
              },
            });
            // Check if there are any previous uploads to continue.
            upload.findPreviousUploads().then(function (previousUploads: unknown[]) {
              // Found previous uploads so we select the first one.
              if (previousUploads.length) {
                console.log("Step 5");
                upload.resumeFromPreviousUpload(previousUploads[0]);
              }
              // Start the upload
              console.log("Step 6");
              upload.start();
            });
            console.log("Step 7");
          } catch (err) {
            console.log("ERROR", err);
          }
        }
      } catch (err) {
        alert("Change this later because you have an err: " + err);
      } finally {
        console.log("Step 8");
        // EDIT VIDEO may need to move this to the backend
        const options = {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/*+json",
            // Test
            AccessKey: "8ad268ac-6b0a-46fb-92d9b1a6d918-c4e1-4edf",
            // Live
            // AccessKey: "a80779d4-9931-4345-80c1ca2315d2-fc09-4143",
          },
          body: `{"title":"${title}"}`,
        };

        fetch(
          `https://video.bunnycdn.com/library/181057/videos/${videoID}`,
          // `https://video.bunnycdn.com/library/181057/videos/${video.guid}`,
          options
        )
          .then((response) => response.json())
          .then((response) => {
            console.log("This is the newly Edited video", response);
          })
          .catch((err) => console.error(err));
      }
    };
    sendToBackEnd();
    console.log("Step 9");
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[globalStyles.borderDefault]}
    >
      <Text style={[globalStyles.textTitle, { color: colors["priT"] }]}>
        Millennial's Prime News Upload
      </Text>
      <View style={globalStyles.groupPadding}>
        <View style={globalStyles.labelInput}>
          <Text style={globalStyles.labelText}>
            What type of Upload is this?
          </Text>
          <Pressable>
            <TextInput
              style={globalStyles.input}
              placeholder="Can Users Like your Post?"
              value={upload || ""}
              //   onChangeText={setUpload}
              //   onChange={handleChange}
              editable={false}
              onPressIn={toggleUploadPicker}
            ></TextInput>
          </Pressable>

          {uploadPicker && (
            <Picker
              style={{}}
              ref={uploadRef}
              selectedValue={upload}
              onValueChange={(itemValue, itemIndex) => uploadCheck(itemValue)}
            >
              <Picker.Item
                label="Select your Option"
                value=""
                enabled={false}
              />
              <Picker.Item label="Text" value="Text" />
              {/* Later change TEXT to post or something like  words idk */}
              <Picker.Item label="Images" value="Images" />
              <Picker.Item label="Video" value="Video" />
              <Picker.Item label="Music" value="Music" />
              <Picker.Item label="Episode" value="Episode" />
              <Picker.Item label="E-Commerence" value="E-Commerence" />
            </Picker>
          )}
        </View>
        {upload == "Text" && (
          <Text style={[{ color: colors["priT"] }]}>Text stuff goes here</Text>
        )}
        {upload == "Images" && (
          <Text style={[{ color: colors["priT"] }]}>
            Images stuff goes here
          </Text>
        )}
        {upload == "Video" && (
          <View>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors["priT"] }]}>
                Title of Video
              </Text>
              <TextInput
                style={globalStyles.settingsInput}
                placeholder="Enter Title Here"
                value={title}
                onChangeText={handleChangeTitle}
              ></TextInput>
            </View>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors["priT"] }]}>
                Description of the Video
              </Text>
              <TextInput
                style={globalStyles.settingsInput}
                placeholder="Enter A Brief Description Here"
                value={description}
                onChangeText={handleChangeDescription}
              ></TextInput>
            </View>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors["priT"] }]}>
                Who is the Video For?
              </Text>
              <Pressable>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Select Your Option"
                  value={prime}
                  //   onChangeText={setUpload}
                  //   onChange={handleChange}
                  editable={false}
                  onPressIn={togglePrimePicker}
                ></TextInput>
              </Pressable>

              {primePicker && (
                <Picker
                  style={{}}
                  selectedValue={prime}
                  onValueChange={(itemValue, itemIndex) =>
                    handleWhoChange(itemValue)
                  }
                >
                  <Picker.Item
                    label="Select your Option"
                    value=""
                    enabled={false}
                  />
                  <Picker.Item label="Millennial's" value="Millennial's" />
                  <Picker.Item label="Primes" value="Primes" />
                </Picker>
              )}
            </View>
            <View style={globalStyles.labelInput}>
              <Text style={[globalStyles.labelText, { color: colors["priT"] }]}>
                What the Category of this Video?
              </Text>
              <Pressable>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Select your option"
                  value={category}
                  //   onChangeText={setUpload}
                  //   onChange={handleChange}
                  editable={false}
                  onPressIn={toggleCategoryPicker}
                ></TextInput>
              </Pressable>

              {categoryPicker && (
                <Picker
                  style={{}}
                  selectedValue={category}
                  onValueChange={
                    (itemValue, itemIndex) => handleCategoryChange(itemValue)
                    // console.log("Category picker working")
                  }
                >
                  <Picker.Item
                    label="Select your Option"
                    value=""
                    enabled={false}
                  />
                  <Picker.Item label="All News" value="All News" />
                  <Picker.Item label="Music" value="Music" />
                  <Picker.Item label="Movie's" value="Movie's" />
                  <Picker.Item label="Politics" value="Politics" />
                  <Picker.Item label="Good Stuff" value="Good Stuff" />
                  <Picker.Item label="Prime Stuff" value="Prime Stuff" />
                </Picker>
              )}
            </View>
            <ImagePickerComponent
              handleVideoSelect={handleVideoSelect}
              //   handleVideoSelect={(value) => handleVideoSelect(value)}
            />
          </View>
        )}
        {upload == "Music" && (
          <Text style={[{ color: colors["priT"] }]}>Music stuff goes here</Text>
        )}
        {upload == "Episode" && (
          <Text style={[{ color: colors["priT"] }]}>
            Episode stuff goes here
          </Text>
        )}
        {upload == "E-Commerence" && (
          <Text style={[{ color: colors["priT"] }]}>
            E-Commerence stuff goes here
          </Text>
        )}
      </View>
      {/* Button */}
      <View style={globalStyles.groupPadding}>
        <Pressable
          style={[
            globalStyles.button,
            globalStyles.marginVertical,
            { backgroundColor: colors.triC, marginBottom: 25 },
          ]}
        >
          <Text style={globalStyles.buttonText} onPress={handleSubmit}>
            Upload
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
