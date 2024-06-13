import { View, Text, useColorScheme, ScrollView } from "react-native";
import React, { useContext, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/colors";
// import { AuthContext } from "../../context/AuthContext";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import PrimeUser from "@/shared/ConnectedUser/PrimeUser";
import User from "@/shared/ConnectedUser/User";

export default function ConnectedUsersScreen() {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  const { id } = useLocalSearchParams<{ id: string }>();
  const [connected, setConnected] = useState(true);
  const [matching, setMatching] = useState(true);
  let name: String;
  let industry: String;
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
      <PrimeUser
        name={"Test Dude1"}
        industry={"Graphic Design"}
        connected={true}
        matching={true}
      />
      <PrimeUser
        name={"Test Dude3"}
        industry={"Rubix Cuber"}
        connected={true}
        matching={false}
      />
      <PrimeUser
        name={"Test Dude5"}
        industry={"Backend Developer"}
        connected={false}
        matching={true}
      />
      <PrimeUser
        name={"Test Dude7"}
        industry={"Under Water "}
        connected={false}
        matching={false}
      />
      <User
        name={"Test Dude2"}
        industry={"Webste Design"}
        connected={true}
        matching={true}
      />
      <User
        name={"Test Dude4"}
        industry={"Stuff Animal Maker"}
        connected={true}
        matching={false}
      />
      <User
        name={"Test Dude6"}
        industry={"App Design"}
        connected={false}
        matching={true}
      />
      <User
        name={"Test Dude8"}
        industry={"Geek Stuff"}
        connected={false}
        matching={false}
      />
    </ScrollView>
  );
}
