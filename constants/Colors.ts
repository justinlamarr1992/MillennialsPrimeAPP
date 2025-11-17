// /**
//  * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
//  * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
//  */

export type Colors = {
  background: string;
  backgroundColor: string;
  backgroundModal: string;
  text: string;
  white: string;
  priT: string;
  secT: string;
  triT: string;
  labelT: string;
  defaultText: string;
  primeDefaultText: string;
  adminDefaultText: string;
  gray: string;
  priC: string;
  secC: string;
  triC: string;
  quaC: string;
  quiC: string;
  hexC: string;
  regC: string;
  linkC: string;
  primCar: string;
  primeCarT: string;
  primeCarST: string;
  showCar: string;
  showCarT: string;
  inActTab: string;
  actTab: string;
  inActTabText: string;
  actTabText: string;
  plcHoldText: string;
  loading: string;
  loadingButton: string;
  loadingText: string;
  loadingTextOppo: string;
};

const LIGHT: Colors = {
  background: "#F7F7F7",
  backgroundColor: "#F7F7F7",
  backgroundModal: "#1E1F20",
  text: "#000000",
  white: "#000000",
  priT: "#020101",
  secT: "#ffffff",
  triT: "#8F92A1",
  labelT: "#020101",
  defaultText: "#606060",
  primeDefaultText: "#ffffff",
  adminDefaultText: "#020101",
  gray: "gray",
  priC: "#611821",
  secC: "#8e202b",
  triC: "#BD2932",
  quaC: "#fffd9b",
  quiC: "#ddcd76",
  hexC: "#b9a054",
  regC: "#DEDEDE",
  linkC: "#8e202b",
  primCar: "#fffd9b",
  primeCarT: "#020101",
  primeCarST: "#020101",
  showCar: "#611821",
  showCarT: "#ffffff",
  inActTab: "#611821",
  actTab: "#BD2932",
  inActTabText: "#b9a054",
  actTabText: "#fffd9b",
  plcHoldText: "#BABBBD",
  loading: "#fffd9b",
  loadingButton: "#611821",
  loadingText: "#ffffff",
  loadingTextOppo: "#020101",
};
const DARK: Colors = {
  background: "#000000",
  backgroundColor: "#F7F7F7",
  backgroundModal: "#1E1F20",
  text: "#ffffff",
  white: "#FFFFFF",
  priT: "#8F92A1",
  secT: "#ffffff",
  triT: "#020101",
  labelT: "#020101",
  defaultText: "#606060",
  primeDefaultText: "#ffffff",
  adminDefaultText: "#020101",
  gray: "white",
  // borderColor: "#8F92A1",
  priC: "#611821",
  secC: "#8e202b",
  triC: "#BD2932",
  quaC: "#fffd9b",
  quiC: "#ddcd76",
  hexC: "#b9a054",
  regC: "#DEDEDE",
  linkC: "#ddcd76",
  primCar: "#BD2932",
  primeCarT: "#020101",
  primeCarST: "#8F92A1",
  showCar: "#b9a054",
  showCarT: "#ffffff",
  inActTab: "#611821",
  actTab: "#BD2932",
  inActTabText: "#b9a054",
  actTabText: "#fffd9b",
  plcHoldText: "#BABBBD",
  loading: "#611821",
  loadingButton: "#fffd9b",
  loadingText: "#020101",
  loadingTextOppo: "#ffffff",
};
enum COLOR_SCHEME {
  LIGHT = "light",
  DARK = "dark",
}

export const COLORS = {
  [COLOR_SCHEME.LIGHT]: LIGHT,
  [COLOR_SCHEME.DARK]: DARK,
};

// const tintColorLight = "#0a7ea4";
// const tintColorDark = "#fff";

// const MyTheme = {
//   dark: false,
//   colors: { test: "#fffd9b" },
// };
// const MyTheme2 = {
//   dark: true,
//   colors: { test: "orange" },
// };

// const Colors = {
//   colors: {
//     //  Background
//     background: "#F7F7F7",
//     background2: "#C4C4C4",

//     //  Form Color
//     formC: "#ffffff",

//     //  Text Colors
//     priT: "#020101",
//     secT: "#ffffff",
//     triT: "#8F92A1",

//     //  Colors
//     priC: "#611821",
//     secC: "#8e202b",
//     triC: "#BD2932",
//     quaC: "#fffd9b",
//     quiC: "#ddcd76",
//     hexC: "#b9a054",
//  regC: "#DEDEDE",

//     // NavBar Colors
//     navbC: "#BD2932",
//     footC: "#939597",

//     transpWhite: "rgba(255, 255, 255, 0.9)",

//     outline: "#8F92A1",
//   },
//   light: {
//     background: "#F7F7F7",
//     text: "#000000",
//     white: "#000000",
//     priT: "#020101",
//     secT: "#ffffff",
//     triT: "#8F92A1",
//     gray: "gray",
//     priC: "#611821",
//     secC: "#8e202b",
//     triC: "#BD2932",
//     quaC: "#fffd9b",
//     quiC: "#ddcd76",
//     hexC: "#b9a054",
//     linkC: "#8e202b",
//     primCar: "#fffd9b",
//     primeCarT: "#020101",
//     primeCarST: "#020101",
//     showCar: "#611821",
//     showCarT: "#ffffff",
//     inActTab: "#BD2932",
//     actTab: "#611821",
//     inActTabText: "#b9a054",
//     actTabText: "#fffd9b",

//     // tint: tintColorLight,
//     // icon: "#687076",
//     // tabIconDefault: "#687076",
//     // tabIconSelected: tintColorLight,
//   },
//   dark: {
//     background: "#000000",
//     text: "#ffffff",
//     white: "#FFFFFF",
//     priT: "#8F92A1",
//     secT: "#ffffff",
//     triT: "#020101",
//     gray: "white",
//     borderColor: "#8F92A1",
//     priC: "#611821",
//     secC: "#8e202b",
//     triC: "#BD2932",
//     quaC: "#fffd9b",
//     quiC: "#ddcd76",
//     hexC: "#b9a054",
//     linkC: "#ddcd76",
//     primCar: "#BD2932",
//     primeCarT: "#020101",
//     primeCarST: "#8F92A1",
//     showCar: "#b9a054",
//     showCarT: "#ffffff",
//     inActTab: "#611821",
//     actTab: "#BD2932",
//     inActTabText: "#b9a054",
//     actTabText: "#fffd9b",

//     // tint: tintColorDark,
//     // icon: "#9BA1A6",
//     // tabIconDefault: "#9BA1A6",
//     // tabIconSelected: tintColorDark,
//   },
//   sizes: {
//     xSmall: 10,
//     small: 12,
//     medium: 16,
//     large: 20,
//     xLarge: 24,
//     xxLarge: 32,
//   },
//   shadows: {
//     small: {
//       shadowColor: "#000",
//       shadowOffset: {
//         width: 0,
//         height: 2,
//       },
//       shadowOpacity: 0.25,
//       shadowRadius: 3.84,
//       elevation: 2,
//     },
//     medium: {
//       shadowColor: "#000",
//       shadowOffset: {
//         width: 0,
//         height: 2,
//       },
//       shadowOpacity: 0.25,
//       shadowRadius: 5.84,
//       elevation: 5,
//     },
//   },
//   font: { regular: "Inter", medium: "DMMedium", bold: "DMBold" },
// };

// export default { Colors, MyTheme, MyTheme2 };

// export const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   text: {
//     fontSize: 20,
//   },
//   lightContainer: {
//     backgroundColor: "#d0d0c0",
//   },
//   darkContainer: {
//     backgroundColor: "#242c40",
//   },
//   lightThemeText: {
//     color: "#242c40",
//   },
//   darkThemeText: {
//     color: "#d0d0c0",
//   },
// });

// export default { COLORS, LIGHT, DARK };
