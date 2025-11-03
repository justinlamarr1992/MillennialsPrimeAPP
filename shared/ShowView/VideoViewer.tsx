import React from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import { globalStyles } from "@/constants/global";

import axios from "axios";

const VideoViewer = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Text>VideoViewer</Text>
    </View>
  );
};

export default VideoViewer;
