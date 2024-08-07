import { View, Text, ScrollView, useColorScheme } from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";

import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import VideoPost from "@/shared/PostComponents/VideoPost";
import PicturePost from "@/shared/PostComponents/PicturePost";
import TextPost from "@/shared/PostComponents/TextPost";

export default function MyProfileScreen() {
  // const { auth, id, accessToken, roles } = useContext(AuthContext);
  const { auth, admin, prime, id, accessToken, roles } =
    useContext(AuthContext);
  // const [admin, setAdmin] = useState(false);
  // const [prime, setPrime] = useState(true);
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[globalStyles.padding, { backgroundColor: colors["background"] }]}
    >
      <TextPost
        title={"Testing the Title for the User Profile Post"}
        description={
          "This is where the description of the text Post will go, but it will be however long the user types... However we may need to restrict this by a maximum of 10 lines"
        }
        prime={prime}
        admin={admin}
      />
      <PicturePost
        title={"Test"}
        description={
          "This is where the description of the pst willl go, but it will be shortened to only two lines max..."
        }
        prime={prime}
        admin={admin}
      />
      <VideoPost
        title={"This is a Video Post Title"}
        description={
          "This is where the description of the pst willl go, but it will be shortened to only two lines max..."
        }
        prime={prime}
        admin={admin}
        libraryId={147838}
        videoId={"ec4cbe34-8750-4695-b252-69f53e51627a"}
        url={"https://www.youtube.com/embed/cqyziA30whE"}
      />
    </ScrollView>
  );
}
