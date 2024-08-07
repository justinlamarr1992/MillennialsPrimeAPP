import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Modal,
  ScrollView,
  useColorScheme,
} from "react-native";
import { router } from "expo-router";
import { AuthContext } from "@/context/AuthContext";

import Ad from "@/shared/Ad";
import TextPost from "@/shared/PostComponents/TextPost";
import PicturePost from "@/shared/PostComponents/PicturePost";
import VideoPost from "@/shared/PostComponents/VideoPost";
import PrimeNewsPost from "@/shared/PostComponents/PrimeNewsPost";
import CustomBottomSheet from "@/shared/Modals/CustomBottomSheet";

import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import axios from "axios";

export default function Page() {
  const { logout, test, auth, id, accessToken, roles, admin } =
    useContext(AuthContext);
  console.log("Accessing the AuthContext in Home Screen");
  const ugh = JSON.parse(auth);

  console.log("The Old Value ", auth);
  console.log("The New Value ", ugh);

  console.log(ugh);
  console.log(auth);
  // const auth = "This is the hard coded Auth";
  // const id = "1111111111";
  // const accessToken = "This is the hard coded AccessToken";
  // const roles = "Know it Jaroni";

  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  // console.log(roles);

  // const navigation = useNavigation();
  // const colors = useTheme().colors;
  const [prime, setPrime] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  // const [reviews, setReviews] = useState([
  //   { title: "Title 1", rating: 5, body: "Body 1111111", key: "1" },
  //   { title: "Title 2", rating: 4, body: "Body 2222222", key: "2" },
  //   { title: "Title 3", rating: 3, body: "Body 3333333", key: "3" },
  // ]);

  const [post, setPost] = useState({
    title: "",
    description: "",
    guid: "",
    dateUploaded: "",
    videoLibraryId: "",
    key: "1",
  });
  const name = "Millennial's Prime Admin";

  useEffect(() => {
    getInfo();
  }, []);

  // MAke this into a function that can call API calls instead of typing every time
  // function AxiosExample() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // define an async function that fetches and processes the data
  // const fetchData = async () => {
  //   try {
  //     setLoading(true);
  //     // use Axios to make a GET request to the JSON placeholder API
  //     const response = axios.get(
  //       "https://us-central1-millennialsprime.cloudfunctions.net/api/test/app"
  //     );
  //     console.log(response);
  //     setData(response);
  //     setLoading(false);
  //   } catch (error) {
  //     setError(error);
  //   }
  // };

  // HOW TO ADD FUTURE POST IN TO SOCIAL
  // const addReview = (review) => {
  //   // Not best way to producw a key
  //   review.key = Math.random().toString();
  //   setReviews((currentReviews) => {
  //     return [review, ...currentReviews];
  //   });
  //   setModalOpen(false);
  // };

  const getInfo = () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        // Test
        // AccessKey: "8ad268ac-6b0a-46fb-92d9b1a6d918-c4e1-4edf",
        // Live
        AccessKey: "a80779d4-9931-4345-80c1ca2315d2-fc09-4143",
      },
    };

    fetch(
      "https://video.bunnycdn.com/library/147838/videos?page=1&itemsPerPage=2&orderBy=date",
      // "https://video.bunnycdn.com/library/181057/videos?page=1&itemsPerPage=2&orderBy=date",
      options
    )
      .then((response) => response.json())
      // .then((response) => console.log(response.items[0]))
      .then((response) =>
        // console.log(
        //   "Testing Response on EXPO",
        //   JSON.stringify(response, null, 3)
        // ),
        setPost({
          title: response.items[0].title,
          // description: response.items[0].metaTags[0].value,
          guid: response.items[0].guid,
          dateUploaded: response.items[0].dateUploaded,
          videoLibraryId: response.items[0].videoLibraryId,
        })
      )
      .catch((err) => console.error(err));
  };

  return (
    <View
      style={[
        globalStyles.container,
        { backgroundColor: colors["background"] },
      ]}
    >
      {/* <View style={globalStyles.container}> */}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <Button
          onPress={() => router.push("/postView")}
          title="Post View Button"
        /> */}
        {/* SAVE THIS MODAL!!!! This will be how i insert post and other things later
         */}
        {/* <Button onPress={() => router.push("/modal")} title="Open Modal" /> */}
        {/* <Button
          onPress={() => router.push("/(aux)/disclaimer")}
          title="Open Disclaimer"
        /> */}
        {/* TODO: Make this dynamic of the lastest news post */}
        <View style={[globalStyles.padding]}>
          <PrimeNewsPost
            prime={true}
            admin={true}
            title={post.title}
            description={post.description}
            name={name}
            time={post.dateUploaded}
            guid={post.guid}
            videoLibraryId={post.videoLibraryId}
          />

          {/* TODO: Then the lastest/ Popular post  */}
          {/* Timer */}
          <Ad />
          {/* Admin Info */}
          {admin && (
            <View>
              <Text
                // style={{ color: colors.priT }}
                onPress={() => router.push("/settings/MyInfoScreen")}
                // onPress={() => navigation.navigate("My Info")}
              >
                My Information
              </Text>
              {id ? (
                <Text style={{ color: colors["hexC"] }}>ID is {id}</Text>
              ) : (
                <Text style={{ color: colors["triC"] }}>No ID</Text>
              )}
              {roles ? (
                <Text style={{ color: colors["hexC"] }}>Roles is {roles}</Text>
              ) : (
                <Text style={{ color: colors["triC"] }}>No Roles</Text>
              )}
              {accessToken ? (
                <Text style={{ color: colors["hexC"] }}>
                  AccessToken is {accessToken}
                </Text>
              ) : (
                <Text style={{ color: colors["triC"] }}>No AccessToken</Text>
              )}
              {auth ? (
                <Text style={{ color: colors["hexC"] }}>Auth is {auth}</Text>
              ) : (
                <Text style={{ color: colors["triC"] }}>
                  No Auth Information
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
