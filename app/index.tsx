import { Link, router } from "expo-router";
import {
  useColorScheme,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  Image,
} from "react-native";
import { globalStyles } from "@/constants/global";
import { AuthContext } from "../../provider/AuthProvider";
import { COLORS } from "@/constants/Colors";
import { Logo } from "@/assets/images/MillennialsPrimeLogoNB.png";
import { auth } from "@/firebase/firebaseConfig";

export default function index() {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  console.log(auth);
  return (
    <View
      style={[
        globalStyles.container,
        globalStyles.padding,
        globalStyles.flexColumn,
        globalStyles.flexAlignItemsCenter,
        globalStyles.flexJustifyContentSpaceEvenly,
        { backgroundColor: colors["background"] },
      ]}
    >
      {/* <Logo /> */}
      <Image
        source={require("@/assets/images/MillennialsPrimeLogoNB.png")}
        style={[globalStyles.imageLoading]}
      />
      <Text
        style={[globalStyles.textLoading, { color: colors["loadingTextOppo"] }]}
      >
        Welcome to Millennial's Prime
      </Text>
      <View
        style={[
          globalStyles.flexRow,
          globalStyles.flexJustifyContentSpaceBetween,

          { width: "100%" },
        ]}
      >
        <Pressable
          style={[
            globalStyles.button,
            { backgroundColor: colors["loadingButton"], width: "45%" },
          ]}
        >
          <Link
            style={[globalStyles.buttonText, { color: colors["loadingText"] }]}
            replace
            href="/(auth)/SignInScreen"
            asChild
          >
            <Text>Log In</Text>
          </Link>
        </Pressable>
        <Pressable
          style={[
            globalStyles.button,
            { backgroundColor: colors["loadingButton"], width: "45%" },
          ]}
        >
          <Link
            style={[globalStyles.buttonText, { color: colors["loadingText"] }]}
            replace
            href="/(auth)/RegisterScreen"
            asChild
          >
            <Text>Sign Up</Text>
          </Link>
        </Pressable>
      </View>
      <View
      // style={[globalStyles.flexAlignSelfFlexEnd]}
      >
        <Text
          style={[
            globalStyles.textCenter,
            { color: colors["loadingTextOppo"] },
          ]}
        >
          Made by JustAPPin' LLC
        </Text>
        <Image
          source={require("@/assets/images/JustAppin'.png")}
          style={[
            globalStyles.imageLoadingSmall,
            globalStyles.flexAlignSelfCenter,
          ]}
        />
      </View>
    </View>
  );
}
