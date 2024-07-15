import { View, Text, ScrollView, useColorScheme } from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";

import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import Item from "@/shared/EComm/Item";

export default function EComm() {
  const { auth, admin, prime } = useContext(AuthContext);
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[globalStyles.padding, { backgroundColor: colors["background"] }]}
    >
      <Item itemName="Microphone" picture="" description="Testing" price="$###.##" prime={false} admin={false}/>
    </ScrollView>
  );
}
