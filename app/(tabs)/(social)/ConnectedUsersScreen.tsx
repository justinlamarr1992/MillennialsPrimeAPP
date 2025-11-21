import { View, Text, useColorScheme, ScrollView } from "react-native";
import React, { useContext, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
// import { AuthContext } from "../../context/AuthContext";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import User from "@/shared/ConnectedUser/User";

export default function ConnectedUsersScreen() {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  const { id } = useLocalSearchParams<{ id: string }>();
  const [connected, setConnected] = useState(true);
  const [matching, setMatching] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [prime, setPrime] = useState(false);

  let name: String;
  let industry: String;
  // const axiosPrivate = useAxiosPrivate();
  // const { auth, id, accessToken, roles } = useContext(AuthContext);

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
      <User
        name={"Admin Dude1"}
        industry={"Graphic Design"}
        connected={true}
        matching={true}
        prime={true}
        admin={true}
      />
      <User
        name={"Admin Dude3"}
        industry={"Rubix Cuber"}
        connected={true}
        matching={false}
        prime={true}
        admin={true}
      />
      <User
        name={"Admin Dude5"}
        industry={"Backend Developer"}
        connected={false}
        matching={true}
        prime={true}
        admin={true}
      />
      <User
        name={"Admin Dude7"}
        industry={"Under Water "}
        connected={false}
        matching={false}
        prime={true}
        admin={true}
      />
      <User
        name={"Prime Dude1"}
        industry={"Graphic Design"}
        connected={true}
        matching={true}
        prime={true}
        admin={false}
      />
      <User
        name={"Prime Dude3"}
        industry={"Rubix Cuber"}
        connected={true}
        matching={false}
        prime={true}
        admin={false}
      />
      <User
        name={"Prime Dude5"}
        industry={"Backend Developer"}
        connected={false}
        matching={true}
        admin={false}
        prime={true}
      />
      <User
        name={"Prime Dude7"}
        industry={"Under Water "}
        connected={false}
        matching={false}
        admin={false}
        prime={true}
      />
      <User
        name={"Normal Dude2"}
        industry={"Webste Design"}
        connected={true}
        admin={false}
        prime={false}
        matching={true}
      />
      <User
        name={"Normal Dude4"}
        industry={"Stuff Animal Maker"}
        connected={true}
        matching={false}
        admin={false}
        prime={false}
      />
      <User
        name={"Normal Dude6"}
        industry={"App Design"}
        connected={false}
        matching={true}
        admin={false}
        prime={false}
      />
      <User
        name={"Normal Dude8"}
        industry={"Geek Stuff"}
        connected={false}
        matching={false}
        admin={false}
        prime={false}
      />
    </ScrollView>
  );
}
