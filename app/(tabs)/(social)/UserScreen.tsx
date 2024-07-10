import {
  View,
  Text,
  ScrollView,
  Pressable,
  useColorScheme,
} from "react-native";
import React, { useContext } from "react";
import { router } from "expo-router";
// import { useTheme, useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../../context/AuthContext";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/colors";
import PicturePost from "../../../shared/PostComponents/PicturePost";
import PrimePicturePost from "../../../shared/PostComponents/PrimePicturePost";
import VideoPost from "../../../shared/PostComponents/VideoPost";
import PrimeVideoPost from "../../../shared/PostComponents/PrimeVideoPost";
import TextPost from "../../../shared/PostComponents/TextPost";
import PrimeTextPost from "../../../shared/PostComponents/PrimeTextPost";

export default function UserScreen() {
  const { auth, id, accessToken, roles } = useContext(AuthContext);
  // const navigation = useNavigation();
  // navigation.jumpTo("Business");
  // navigation.navigate("Business");
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[globalStyles.padding, { backgroundColor: colors["background"] }]}
    >
      <Text
        style={[{ color: colors["priT"] }]}
        // style={{ color: colors.priT }}
      >
        User: {id ? id : "No Id"}
      </Text>
      <Text
        style={[{ color: colors["priT"] }]}
        // style={{ color: colors.priT }}
      >
        Roles: {roles ? roles : "No Roles"}
      </Text>

      <Text
        style={[{ color: colors["priT"] }]}
        // style={{ color: colors.priT }}
      >
        Test User Profile Here
      </Text>
      <Pressable
        // onPress={() => navigation.navigate("Connected Users")}
        onPress={() => router.push("/ConnectedUsersScreen")}
        style={[
          globalStyles.button,
          globalStyles.marginVertical,
          { backgroundColor: colors["priC"] },
        ]}
      >
        <Text style={globalStyles.buttonText}>Connected Users</Text>
      </Pressable>
      <Pressable
        // onPress={() => navigation.navigate("My Profile")}
        onPress={() => router.push("/MyProfileScreen")}
        style={[
          globalStyles.button,
          globalStyles.marginVertical,
          { backgroundColor: colors["priC"] },
        ]}
      >
        <Text style={globalStyles.buttonText}>My Profile</Text>
      </Pressable>
      <Pressable
        // onPress={() => navigation.navigate("My Profile")}
        onPress={() => router.push("/123456")}
        style={[
          globalStyles.button,
          globalStyles.marginVertical,
          { backgroundColor: colors["priC"] },
        ]}
      >
        <Text style={globalStyles.buttonText}>To User 123456</Text>
      </Pressable>
      <Pressable
        // onPress={() => navigation.navigate("My Profile")}
        onPress={() => router.push("/123457")}
        style={[
          globalStyles.button,
          globalStyles.marginVertical,
          { backgroundColor: colors["priC"] },
        ]}
      >
        <Text style={globalStyles.buttonText}>To User 123457</Text>
      </Pressable>
      {/* 
        <TextPost />
        <PrimeTextPost />
        <PicturePost />
        <PrimePicturePost />
        <VideoPost />
        <PrimeVideoPost /> */}
    </ScrollView>
  );
}
