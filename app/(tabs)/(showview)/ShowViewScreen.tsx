import { View, Text, ScrollView, useColorScheme } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useNavigation, useTheme } from "@react-navigation/native";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import axios from "../../../API/axios";
import PrimeCard from "@/shared/ShowView/PrimeCard";

export default function ShowViewScreen() {
  // const { auth, isLoading, roles, id } = useContext(AuthContext);
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  //   const [videos, setVideos] = useState({});
  const [videoData, setVideoData] = useState();
  const [originalUser, setOriginalUser] = useState(false);
  // var videoData = [];
  let mappedVideos;
  //   Get Library Videos from bunny.net

  // useEffect(() => {
  //   mapVideos();
  // }, [auth]);

  // const mapVideos = () => {
  //   const options = {
  //     method: "GET",
  //     headers: {
  //       accept: "application/json",
  //       AccessKey: "8ad268ac-6b0a-46fb-92d9b1a6d918-c4e1-4edf",
  //     },
  //   };

  //   fetch(
  //     "https://video.bunnycdn.com/library/181057/videos?page=1&itemsPerPage=100&orderBy=date",
  //     options
  //   )
  //     .then((response) => response.json())
  //     .then((response) => {
  //       setVideoData(response.items); //This gets the first video
  //       console.log(`The items inside fetch is ${response.items[0]}`);
  //       // console.log(`The Amount of items inside fetch is ${videoData.length}`);
  //     })
  //     .catch((err) => console.error(err));

  //   // if (videoData.hasOwnProperty("availableResolutions")) {
  //   //   console.log(`It has all the right stuff which is ${videoData}`);
  //   // } else {
  //   //   console.log(`Something happened`);
  //   // }
  // };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[globalStyles.padding, { backgroundColor: colors["background"] }]}
    >
      <Text style={[{ color: colors["priT"] }]}>ShowView</Text>
      <Text style={[{ color: colors["priT"] }]}>Roles</Text>
      {/* {videoData?.map((videos) => (
          <PrimeCard
            id={id}
            userPosting={videos.metaTags[3].value}
            prime={videos.metaTags[2]}
            key={videos.guid}
            videoLibraryId={videos.videoLibraryId}
            guid={videos.guid}
            title={videos.title}
            description={videos.metaTags[1].value}
            dateUploaded={videos.dateUploaded}
          />
        ))} */}
      {/* {mappedVideos ? (
          videoData.map((videos) => (
            <PrimeCard title="testing" description="Test Dec" />
          ))
        ) : (
          <Text style={{ color: colors.triC }}>No Video Data</Text>
        )} */}
      {/* {videoData ? (
          <PrimeCard title="Test" description="Test" />
        ) : (
          <Text style={{ color: colors.triC }}>No Video Data</Text>
        )} */}

      {/* <PrimeCard title="test Title" description="Test Dec" />
      <PreviewCard title="test Title" description="Test Dec" />
      <PreviewCard title="test Title" description="Test Dec" />
      <PreviewCard title="test Title" description="Test Dec" />
      <PreviewCard title="test Title" description="Test Dec" /> */}
    </ScrollView>
  );
}
