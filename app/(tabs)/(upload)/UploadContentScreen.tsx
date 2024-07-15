import { View, Text, useColorScheme } from "react-native";
import React from "react";
import UploadBox from "@/shared/Upload/UploadBox";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/colors";

const UploadContentScreen = () => {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  return (
    <View
      style={[
        globalStyles.container,
        globalStyles.centerItem,
        { backgroundColor: colors["background"] },
      ]}
    >
      <UploadBox />
    </View>
  );
};

export default UploadContentScreen;
