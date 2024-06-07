import { View, Text, useColorScheme, ScrollView } from "react-native";
import React, { useContext } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/colors";
// import { AuthContext } from "../../context/AuthContext";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

export default function ConnectedUsersScreen() {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  const { id } = useLocalSearchParams<{ id: string }>();
  // const axiosPrivate = useAxiosPrivate();
  // const { auth, id, accessToken, roles } = useContext(AuthContext);
  // const colors = useTheme().colors;

  // const getUsers = async () => {
  //   try {
  //     const response = await axiosPrivate.get(
  //       `https://us-central1-millennialsprime.cloudfunctions.net/api/users/`
  //     );
  //     console.log(response);
  //   } catch (err) {
  //     console.log("ERROR: ", err);
  //   }
  // };
  // getUsers();
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[globalStyles.padding, { backgroundColor: colors["background"] }]}
    >
      <Text
        style={[
          globalStyles.textHuge,
          globalStyles.padding,
          { color: colors["priT"] },
        ]}
      >
        ConnectedUsers
      </Text>
    </ScrollView>
  );
}
