// import { View, Text, useColorScheme, ScrollView } from "react-native";
// import React from "react";
// import { useLocalSearchParams } from "expo-router";
// import { globalStyles } from "@/constants/global";
// import { COLORS } from "@/constants/Colors";
// import TextPost from "@/shared/PostComponents/TextPost";
// import PicturePost from "@/shared/PostComponents/PicturePost";
// import VideoPost from "@/shared/PostComponents/VideoPost";

// export default function id() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const prime = false;
//   const admin = false;
//   const colorScheme = useColorScheme();
//   const colors = COLORS[colorScheme ?? "dark"];
//   return (
//     <ScrollView
//       showsVerticalScrollIndicator={false}
//       style={[globalStyles.padding, { backgroundColor: colors["background"] }]}
//     >
//       <Text
//         style={[
//           globalStyles.textHuge,
//           globalStyles.padding,
//           { color: colors["priT"] },
//         ]}
//       >
//         HI this should change: {id}
//       </Text>
//     </ScrollView>
//   );
// }
