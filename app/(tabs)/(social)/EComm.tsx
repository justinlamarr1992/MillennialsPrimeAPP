import { View, Text, ScrollView, useColorScheme } from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";

import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/colors";
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
      <Item
        itemName="User Item"
        picture=""
        description="This is what the description for an item for sale buy a Regular User will Look like the description with be limited to 2 lines"
        price="$###.##"
        prime={false}
        admin={false}
      />
      <Item
        itemName="Prime Item"
        picture=""
        description="This is what the description for an item for sale buy a Prime User will Look like the description with be limited to 2 lines"
        price="$###.##"
        prime={true}
        admin={false}
      />
      <Item
        itemName="Admin Item"
        picture=""
        description="This is what the description for an item for sale buy a Admin User will Look like the description with be limited to 2 lines"
        price="$###.##"
        prime={true}
        admin={true}
      />
    </ScrollView>
  );
}
