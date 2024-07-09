import { View, Text, useColorScheme, ScrollView } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/colors";
import TextPost from "@/shared/PostComponents/TextPost";
import PicturePost from "@/shared/PostComponents/PicturePost";
import VideoPost from "@/shared/PostComponents/VideoPost";

export default function Page() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const prime = false;
  const admin = false;
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
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
        HI: {id}
      </Text>
      <VideoPost
        title={"Admin"}
        description={"This is the description of the Video Post"}
        prime={true}
        admin={true}
      />
      <VideoPost
        title={"Prime"}
        description={"This is the description of the Video Post"}
        prime={true}
        admin={false}
      />
      <VideoPost
        title={"Regular"}
        description={"This is the description of the Video Post"}
        prime={false}
        admin={false}
      />
      <PicturePost
        title={"Admin"}
        description={"This is the description of the Picture Post"}
        prime={true}
        admin={true}
      />
      <PicturePost
        title={"Prime"}
        description={"This is the description of the Picture Post"}
        prime={true}
        admin={false}
      />
      <PicturePost
        title={"Regular"}
        description={"This is the description of the Picture Post"}
        prime={false}
        admin={false}
      />
      <TextPost
        title={"Admin"}
        description={
          "This is where the description of the text Post will go, but it will be however long the user types... However we may need to restrict this by a maximum of 10 lines"
        }
        prime={true}
        admin={true}
      />

      <TextPost
        title={"Prime"}
        description={
          "This is where the description of the text Post will go, but it will be however long the user types... However we may need to restrict this by a maximum of 10 lines"
        }
        prime={true}
        admin={false}
      />
      <TextPost
        title={"Regular"}
        description={
          "This is where the description of the text Post will go, but it will be however long the user types... However we may need to restrict this by a maximum of 10 lines"
        }
        prime={false}
        admin={false}
      />
    </ScrollView>
  );
}
