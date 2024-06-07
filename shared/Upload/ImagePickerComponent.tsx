import { View, Text, Button, Image } from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { globalStyles } from "@/constants/global";

function ImagePickerComponent(props) {
  const { handleVideoSelect } = props;
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No Permission request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      // THIS IS ONLY VIDOES FOR THE PURPOSE BUT CAN BE ALL
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

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
