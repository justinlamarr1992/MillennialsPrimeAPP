// TODO: Settings PAge but have Top Tabs for Info/Business/Art
import {
  View,
  Text,
  ScrollView,
  Pressable,
  useColorScheme,
} from "react-native";
import React, { useContext } from "react";
import { Link, router } from "expo-router";
import { AuthContext } from "../../../context/AuthContext";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";

export default function Page() {
  const { auth, id, accessToken, roles } = useContext(AuthContext);

  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[globalStyles.padding, { backgroundColor: colors["background"] }]}
    >
      <Text style={[globalStyles.textMedium, { color: colors["text"] }]}>
        Hello, (Name here)
      </Text>
      <Pressable
        onPress={() => router.push("/MyInfoScreen")}
        style={[
          globalStyles.button,
          globalStyles.marginVertical,
          { backgroundColor: colors["priC"] },
        ]}
      >
        <Text style={[globalStyles.buttonText, { color: colors["secT"] }]}>
          Personal Information
        </Text>
      </Pressable>
      <Pressable
        onPress={() => router.push("/BusinessScreen")}
        style={[
          globalStyles.button,
          globalStyles.marginVertical,
          { backgroundColor: colors["priC"] },
        ]}
      >
        <Text style={[globalStyles.buttonText, { color: colors["secT"] }]}>
          Business Infomation
        </Text>
      </Pressable>
      <Pressable
        onPress={() => router.push("/ArtScreen")}
        style={[
          globalStyles.button,
          globalStyles.marginVertical,
          { backgroundColor: colors["priC"] },
        ]}
      >
        <Text style={[globalStyles.buttonText, { color: colors["secT"] }]}>
          Artistry Information
        </Text>
      </Pressable>
    </ScrollView>
  );
}
