import { ScrollView, useColorScheme } from "react-native";
import React from "react";

import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import VideoPost from "@/shared/PostComponents/VideoPost";
import PicturePost from "@/shared/PostComponents/PicturePost";
import TextPost from "@/shared/PostComponents/TextPost";

export default function MyProfileScreen() {
  // NOTE: Intentional hardcoded values. AuthContext only contains { user, loading }.
  // Admin/prime/id will be derived from user data structure when available.
  const admin = false;
  const prime = false;
  const id = "test-user-id";
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[globalStyles.padding, { backgroundColor: colors["background"] }]}
    >
      <TextPost
        name={"Test User"}
        title={"Testing the Title for the User Profile Post"}
        description={
          "This is where the description of the text Post will go, but it will be however long the user types... However we may need to restrict this by a maximum of 10 lines"
        }
        prime={prime}
        admin={admin}
        authorId={id}
      />
      <PicturePost
        name={"Test User"}
        title={"Test"}
        description={
          "This is where the description of the post will go, but it will be shortened to only two lines max..."
        }
        picture=""
        prime={prime}
        admin={admin}
        authorId={id}
      />
      <VideoPost
        name={"Test User"}
        title={"This is a Video Post Title"}
        description={
          "This is where the description of the post will go, but it will be shortened to only two lines max..."
        }
        prime={prime}
        admin={admin}
        libraryId={147838}
        videoId={"ec4cbe34-8750-4695-b252-69f53e51627a"}
        authorId={id}
      />
    </ScrollView>
  );
}
