import React from "react";
import { View, Pressable, Image, StyleSheet, useColorScheme, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { COLORS } from "@/constants/Colors";
import { logger } from "@/utils/logger";

export interface ProfilePictureProps {
  imageUri: string | null;
  onImageSelected: (uri: string) => void;
  size?: number;
  editable?: boolean;
}

const DEFAULT_SIZE = 120;
const EDIT_BUTTON_SIZE = 36;
const BORDER_WIDTH = 3;

export default function ProfilePicture({
  imageUri,
  onImageSelected,
  size = DEFAULT_SIZE,
  editable = true,
}: ProfilePictureProps) {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  const handleImagePick = async (): Promise<void> => {
    if (!editable) return;

    try {
      // Request media library permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.status !== "granted") {
        logger.warn("Media library permission denied");
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        logger.log("Profile picture selected:", uri);
        logger.log("Calling onImageSelected callback...");
        logger.log("Callback type:", typeof onImageSelected);
        logger.log("Callback is:", onImageSelected);
        try {
          const result = onImageSelected(uri);
          logger.log("onImageSelected returned:", result);
          logger.log("onImageSelected callback completed successfully");
        } catch (callbackError) {
          logger.error("onImageSelected callback threw error:", callbackError);
        }
      }
    } catch (error) {
      logger.error("Error picking image:", error);
    }
  };

  const renderPlaceholder = (): JSX.Element => (
    <View style={styles.placeholder}>
      <Text style={[styles.placeholderText, { color: colors["background"] }]}>
        {editable ? "Tap to add photo" : "No photo"}
      </Text>
    </View>
  );

  const renderImage = (): JSX.Element => (
    <Image
      source={{ uri: imageUri as string }}
      style={[
        styles.image,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    />
  );

  const renderEditButton = (): JSX.Element | null => {
    if (!editable) return null;

    return (
      <Pressable
        onPress={handleImagePick}
        style={[
          styles.editButton,
          {
            backgroundColor: colors["priC"],
            borderColor: colors["background"],
          },
        ]}
      >
        <Text style={[styles.editButtonText, { color: colors["secT"] }]}>
          ✎
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container} testID="profile-picture">
      <Pressable
        testID="profile-picture-pressable"
        onPress={handleImagePick}
        disabled={!editable}
        style={[
          styles.imageContainer,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors["secC"],
            borderColor: colors["priC"],
          },
        ]}
      >
        {imageUri ? renderImage() : renderPlaceholder()}
      </Pressable>
      {renderEditButton()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    borderWidth: BORDER_WIDTH,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    resizeMode: "cover",
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  placeholderText: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "600",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: EDIT_BUTTON_SIZE,
    height: EDIT_BUTTON_SIZE,
    borderRadius: EDIT_BUTTON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  editButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
