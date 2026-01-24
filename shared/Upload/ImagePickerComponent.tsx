import { View, Button, Image } from "react-native";
import { logger } from "@/utils/logger";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { globalStyles } from "@/constants/global";

interface ImagePickerComponentProps {
  handleVideoSelect: (result: ImagePicker.ImagePickerResult) => void;
}

function ImagePickerComponent({ handleVideoSelect }: ImagePickerComponentProps) {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // No Permission request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      // THIS IS ONLY VIDOES FOR THE PURPOSE BUT CAN BE ALL
      mediaTypes: 'videos',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    logger.log("Image picker result:", result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      handleVideoSelect(result);
      //   handleVideoSelect(result.assets[0].uri);
    }
  };

  return (
    <View>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && (
        <Image source={{ uri: image }} style={globalStyles.videoUpload} />
      )}
    </View>
  );
}

export default ImagePickerComponent;
