import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  useColorScheme,
} from "react-native";
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import ImagePickerComponent from "./ImagePickerComponent";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import { useVideoUpload } from "@/hooks/useVideoUpload";

export default function UploadBox() {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  const { phase, progress, error, handleVideoSelect, submitUpload, reset } =
    useVideoUpload();

  const [uploadType, setUploadType] = useState<string | null>(null);
  const [uploadTypePicker, setUploadTypePicker] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [audience, setAudience] = useState<"millennials" | "primes">(
    "millennials"
  );
  const [audiencePicker, setAudiencePicker] = useState(false);
  const [category, setCategory] = useState("");
  const [categoryPicker, setCategoryPicker] = useState(false);

  const handleUploadTypeChange = (value: string) => {
    setUploadTypePicker(false);
    setUploadType(value);
  };

  const handleSubmit = () => {
    if (uploadType !== "Video") return;
    void submitUpload({ title, description, category, audience });
  };

  const handleReset = () => {
    reset();
    setTitle("");
    setDescription("");
    setCategory("");
    setUploadType(null);
  };

  if (phase === "complete") {
    return (
      <View style={[globalStyles.container, globalStyles.centerItem]}>
        <Text style={[globalStyles.textTitle, { color: colors["priT"] }]}>
          Video Uploaded!
        </Text>
        <Text
          style={[globalStyles.labelText, { color: colors["priT"] }]}
        >
          Your video has been uploaded and will be available shortly.
        </Text>
        <Pressable
          style={[
            globalStyles.button,
            globalStyles.marginVertical,
            { backgroundColor: colors.triC },
          ]}
          onPress={handleReset}
          accessibilityRole="button"
          accessibilityLabel="Upload Another"
        >
          <Text style={globalStyles.buttonText}>Upload Another</Text>
        </Pressable>
      </View>
    );
  }

  if (phase === "authorizing" || phase === "uploading") {
    const label =
      phase === "authorizing" ? "Authorizing…" : `Uploading… ${progress}%`;
    return (
      <View style={[globalStyles.container, globalStyles.centerItem]}>
        <Text style={[globalStyles.textTitle, { color: colors["priT"] }]}>
          {label}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[globalStyles.borderDefault]}
    >
      <Text style={[globalStyles.textTitle, { color: colors["priT"] }]}>
        Millennial's Prime News Upload
      </Text>

      {phase === "error" && error && (
        <View style={globalStyles.groupPadding}>
          <Text style={globalStyles.errorText}>{error}</Text>
          <Pressable
            style={[
              globalStyles.button,
              globalStyles.marginVertical,
              { backgroundColor: colors.triC },
            ]}
            onPress={handleReset}
            accessibilityRole="button"
            accessibilityLabel="Try Again"
          >
            <Text style={globalStyles.buttonText}>Try Again</Text>
          </Pressable>
        </View>
      )}

      <View style={globalStyles.groupPadding}>
        {/* Upload type selector */}
        <View style={globalStyles.labelInput}>
          <Text style={globalStyles.labelText}>
            What type of Upload is this?
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Select upload type"
            onPress={() => setUploadTypePicker(!uploadTypePicker)}
          >
            <TextInput
              style={globalStyles.input}
              placeholder="What type of upload?"
              value={uploadType ?? ""}
              editable={false}
              pointerEvents="none"
            />
          </Pressable>

          {uploadTypePicker && (
            <Picker
              testID="upload-type-picker"
              selectedValue={uploadType}
              onValueChange={(value) => handleUploadTypeChange(value as string)}
            >
              <Picker.Item
                label="Select your Option"
                value=""
                enabled={false}
              />
              <Picker.Item label="Video" value="Video" />
              <Picker.Item label="Text (Coming Soon)" value="Text" enabled={false} />
              <Picker.Item label="Images (Coming Soon)" value="Images" enabled={false} />
              <Picker.Item label="Music (Coming Soon)" value="Music" enabled={false} />
            </Picker>
          )}
        </View>

        {uploadType === "Video" && (
          <View>
            {/* Title */}
            <View style={globalStyles.labelInput}>
              <Text
                style={[globalStyles.labelText, { color: colors["priT"] }]}
              >
                Title of Video
              </Text>
              <TextInput
                style={globalStyles.settingsInput}
                placeholder="Enter Title Here"
                value={title}
                onChangeText={setTitle}
                accessibilityLabel="Video title"
              />
            </View>

            {/* Description */}
            <View style={globalStyles.labelInput}>
              <Text
                style={[globalStyles.labelText, { color: colors["priT"] }]}
              >
                Description of the Video
              </Text>
              <TextInput
                style={globalStyles.settingsInput}
                placeholder="Enter A Brief Description Here"
                value={description}
                onChangeText={setDescription}
                accessibilityLabel="Video description"
              />
            </View>

            {/* Audience */}
            <View style={globalStyles.labelInput}>
              <Text
                style={[globalStyles.labelText, { color: colors["priT"] }]}
              >
                Who is the Video For?
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Select audience"
                onPress={() => setAudiencePicker(!audiencePicker)}
              >
                <TextInput
                  style={globalStyles.input}
                  placeholder="Select Your Option"
                  value={audience}
                  editable={false}
                  pointerEvents="none"
                />
              </Pressable>
              {audiencePicker && (
                <Picker
                  testID="audience-picker"
                  selectedValue={audience}
                  onValueChange={(value) => {
                    setAudience(value as "millennials" | "primes");
                    setAudiencePicker(false);
                  }}
                >
                  <Picker.Item label="Millennial's" value="millennials" />
                  <Picker.Item label="Primes" value="primes" />
                </Picker>
              )}
            </View>

            {/* Category */}
            <View style={globalStyles.labelInput}>
              <Text
                style={[globalStyles.labelText, { color: colors["priT"] }]}
              >
                Category
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Select category"
                onPress={() => setCategoryPicker(!categoryPicker)}
              >
                <TextInput
                  style={globalStyles.input}
                  placeholder="Select your option"
                  value={category}
                  editable={false}
                  pointerEvents="none"
                />
              </Pressable>
              {categoryPicker && (
                <Picker
                  testID="category-picker"
                  selectedValue={category}
                  onValueChange={(value) => {
                    setCategory(value as string);
                    setCategoryPicker(false);
                  }}
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

            {/* Video file picker */}
            <ImagePickerComponent handleVideoSelect={handleVideoSelect} />
          </View>
        )}
      </View>

      {/* Upload button */}
      <View style={globalStyles.groupPadding}>
        <Pressable
          style={[
            globalStyles.button,
            globalStyles.marginVertical,
            { backgroundColor: colors.triC, marginBottom: 25 },
          ]}
          onPress={handleSubmit}
          accessibilityRole="button"
          accessibilityLabel="Upload"
        >
          <Text style={globalStyles.buttonText}>Upload</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
