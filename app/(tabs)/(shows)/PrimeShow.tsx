import React from "react";
import { Text, View, useColorScheme } from "react-native";
import { WebView } from "react-native-webview";
import { LinearGradient } from "expo-linear-gradient";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
// import UserInfo from "@/shared/PostComponents/UserInfo";

interface RouteParams {
  guid: string;
  videoLibraryId: string;
  title: string;
  description: string;
  dateUploaded: string;
}

interface PrimeShowProps {
  route: {
    params: RouteParams;
  };
}

const PrimeShow = ({ route }: PrimeShowProps) => {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  const prime = true;
  // const [post, setPost] = useState({
  //   title: "",
  //   description: "",
  //   guid: "",
  //   dateUploaded: "",
  //   videoLibraryId: "",
  //   key: "1",
  // });
  const { guid, videoLibraryId, title, description } = route.params;
  console.log(`The Guid is ${guid}`);
  console.log(`The Library ID is ${videoLibraryId}`);

  // useEffect(() => {
  //   getInfo();
  // }, []);

  // const getInfo = () => {
  //   const options = {
  //     method: "GET",
  //     headers: {
  //       accept: "application/json",
  //       // Test
  //       AccessKey: "8ad268ac-6b0a-46fb-92d9b1a6d918-c4e1-4edf",
  //       // Live
  //       // AccessKey: "a80779d4-9931-4345-80c1ca2315d2-fc09-4143",
  //     },
  //   };

  //   fetch(
  //     "https://video.bunnycdn.com/library/181057/videos?page=1&itemsPerPage=2&orderBy=date",
  //     options
  //   )
  //     .then((response) => response.json())
  //     // .then((response) => console.log(response.items[0]))
  //     .then((response) =>
  //       // console.log(
  //       //   "Testing Response on EXPO",
  //       //   JSON.stringify(response, null, 3)
  //       // ),
  //       setPost({
  //         title: response.items[0].title,
  //         // description: response.items[0].metaTags[0].value,
  //         guid: response.items[0].guid,
  //         dateUploaded: response.items[0].dateUploaded,
  //         videoLibraryId: response.items[0].videoLibraryId,
  //       })
  //     )
  //     .catch((err) => console.error(err));
  // };

  return (
    <View
      style={[globalStyles.padding, { backgroundColor: colors["background"] }]}
    >
      <LinearGradient
        style={globalStyles.post}
        colors={
          prime
            ? ["#b9a054", "#cbb665", "#ddcd76", "#eee588", "#fffd9b"]
            : ["#bd2932", "#a5242f", "#8e202b", "#771c26", "#611821"]
        }
      >
        <WebView
          source={{
            uri: `https://video.bunnycdn.com/embed/${videoLibraryId}/${guid}`,
          }}
          width="100%"
          height="auto"
          style={{
            border: "none",
            maxWidth: 1280,
            maxHeight: 720,
            ...globalStyles.postVideo,
            ...globalStyles.postContent,
          }}
        />

        <Text
          style={
            prime
              ? { ...globalStyles.primePostTitle, ...globalStyles.postContent }
              : { ...globalStyles.postTitle, ...globalStyles.postContent }
          }
        >
          {title ? title : "Loading"}
        </Text>
        <Text
          style={{
            ...globalStyles.postDescription,
            ...globalStyles.postContent,
          }}
        >
          {description ? description : "Loading"}
        </Text>
        {/* <UserInfo prime={prime} name={name} time={dateUploaded} /> */}
      </LinearGradient>
    </View>
  );
};

export default PrimeShow;
