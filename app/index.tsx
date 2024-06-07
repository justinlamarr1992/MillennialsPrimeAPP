import React from "react";
import { Appearance, useColorScheme, StyleSheet } from "react-native";
import { Link, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthProvider } from "@/context/AuthContext";
import AppNav from "@/routes/navigation/AppNav";
// import { useTheme } from "@react-navigation/native";
// TODO Mak this the Loading page for The APP

// for now to test
import {
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  TextInput,
  Button,
} from "react-native";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/colors";

export default function Index() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  // console.log(`Index ColorScheme: ${colorScheme}`);
  // console.log(`Index Theme: ${theme}`);
  // console.log(`Index Test: ${test}`);

  return (
    <View
      style={[
        globalStyles.container,
        { backgroundColor: colors["background"], paddingTop: insets.top },
      ]}
    >
      <Text style={{ color: colors["text"] }}>Index Page for links</Text>
      {/* <Text style={{ color: themeTextStyle.text }}>
        the Color of UseColorScheme() is: {colorScheme}{" "}
      </Text>
      <Text style={{ color: themeTextStyle.text }}>
        Testing varibles from light is
      </Text> */}

      <Button
        onPress={() => router.push("/(home)/homeScreen")}
        title="Home Page"
      />
      <Button
        onPress={() => router.push("/(tabs)/social/index")}
        title="User Page"
      />
      <Button
        onPress={() => router.push("/UploadContentScreen")}
        title="Upload Page"
      />
      <Button
        onPress={() => router.push("/ShowViewScreen")}
        title="Episode Page"
      />
      <Button
        onPress={() => router.push("/LogOutScreen")}
        title="Log Out Page"
      />
      {/* <Link href={"/pagetwo"} replace asChild>
        <Button title="Page 2 with Href" />
      </Link>
      <Link href={"/LogOutScreen"} asChild>
        <Button title="Logout with Href" />
      </Link> */}
    </View>
  );
}
