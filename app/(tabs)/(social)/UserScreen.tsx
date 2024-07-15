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
import PicturePost from "../../../shared/PostComponents/PicturePost";
import VideoPost from "../../../shared/PostComponents/VideoPost";
import TextPost from "../../../shared/PostComponents/TextPost";

export default function UserScreen() {
  const { auth, id, accessToken, roles } = useContext(AuthContext);

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
        style={[
          globalStyles.button,
          globalStyles.marginVertical,
          { backgroundColor: colors["priC"] },
        ]}
      >
        <Link push href="/EComm" asChild>
          <Text style={globalStyles.buttonText}>E-Comm Test (Move later)</Text>
        </Link>
      </Pressable>
      <Pressable
        // onPress={() => navigation.navigate("Connected Users")}
        // onPress={() => router.navigate("/ConnectedUsersScreen")}
        style={[
          globalStyles.button,
          globalStyles.marginVertical,
          { backgroundColor: colors["priC"] },
        ]}
      >
        <Link push href="/ConnectedUsersScreen" asChild>
          <Text style={globalStyles.buttonText}>Connected Users</Text>
        </Link>
      </Pressable>

      <Pressable
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
