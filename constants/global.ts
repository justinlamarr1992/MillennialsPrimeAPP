import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export const globalStyles = StyleSheet.create({
  logouttry: { paddingTop: 30 },
  // A
  adDescription: {},
  adPost: {
    borderRadius: 20,
    elevation: 5,
    backgroundColor: "#ddcd76",
    shadowColor: "#fffd9b",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
    marginHorizontal: 4,
    marginVertical: 6,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  adTitle: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 50,
    textAlign: "center",
  },
  yellowGlow: {
    shadowColor: "#fffd9b",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  authModal: { backgroundColor: "#ffffff" },

  // B
  bold: { fontWeight: "bold" },
  borderDefault: {
    borderWidth: 1,
    borderColor: "#b9a054",
    // backgroundColor: "#fffd9b",
    padding: 10,
    borderRadius: 10,
  },
  bottomPadding: { paddingBottom: 40 },
  bottomPadding10: { paddingBottom: 10 },
  bottomPadding20: { paddingBottom: 20 },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: "#611821",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  // C
  cancelButton: {
    paddingHorizontal: 20,
    backgroundColor: "#BD2932",
  },
  cancelButtonText: {
    color: "#ffffff",
  },
  centerItem: {
    flex: 1,
    flexDirection: "column",
    // alignItems: "center",
    justifyContent: "center",
  },
  confirmButton: {
    paddingHorizontal: 20,
    backgroundColor: "green",
  },
  confirmButtonText: {
    color: "#ffffff",
  },
  connectedUserButton: {
    backgroundColor: "#ddcd76",
    padding: 10,
    borderRadius: 10,
  },
  primeConnectedUserButton: {
    backgroundColor: "#DEDEDE",
    padding: 10,
    borderRadius: 10,
  },
  adminConnectedUserButton: {
    backgroundColor: "#8e202b",
    padding: 10,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#f7f7f7",
  },

  // D
  datePicker: {},

  // E
  errorText: {
    fontSize: 18,
    color: "crimson",
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 6,
    textAlign: "center",
  },

  // F
  flex1: {
    flex: 1,
  },
  flexColumn: { flexDirection: "column" },
  flexRow: { flexDirection: "row" },
  formTitle: {
    // paddingTop: 30,
    // displayz: flex,
    // flexDirection: column,
  },

  // G

  // H
  header: {
    position: "absolute",
    alignSelf: "center",
    // left: 0,
    // top: 0,
    // right: 0,
    // bottom: -75,
    width: 425,
    // height: "100%",
    height: 135,
    // flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "center",
    borderRadius: 50,
    // marginTop: 50,
    paddingTop: 35,
  },
  headerImage: {
    width: 50,
    height: 50,
    marginVertical: 5,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#ffffff",
    letterSpacing: 1,
  },
  headerTitle: { flexDirection: "column", alignItems: "center" },

  // I
  icon: {
    // position: "absolute",
    // left: 16,
  },
  image: {
    flex: 1,
    width: "100%",
    height: 200,
    backgroundColor: "#0553",
    borderRadius: 10,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    color: "#8F92A1",
  },

  // J

  // K

  // L
  labelInput: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  loginButtonBox: {
    width: "100%",
    height: "15%",
  },
  loginForm: { width: "100%", height: "70%" },

  // M
  // Margin
  margin: { margin: 20 },
  marginVertical: {
    marginTop: 10,
    marginBottom: 10,
  },
  marginB100: {
    marginBottom: 100,
  },
  // Modal
  modalClose: {
    marginTop: 20,
    marginBottom: 0,
  },
  modalContent: { flex: 1, padding: 20, paddingTop: 40 },
  modalToggle: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#b9a054",
    backgroundColor: "#fffd9b",
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
  },

  // N

  // O

  // P
  // Padding
  padding: {
    padding: 20,
  },
  paddingTest: {
    padding: 200,
  },
  groupPadding: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  vertPadding: {
    paddingTop: 10,
    paddingBottom: 10,
  },

  // Post Styling ADMIN, PRIME AND REGULAR
  post: {
    borderRadius: 20,
    elevation: 5,
    // backgroundColor: "#8e202b",

    shadowColor: "#BD2932",
    // shadowOffset: { width: 0, height: 0 },
    // shadowOpacity: 0.9,
    // shadowRadius: 5,
    marginHorizontal: 4,
    marginVertical: 6,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  postConnectedUser: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    elevation: 5,
    marginHorizontal: 4,
    marginVertical: 6,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  postContainer: {
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 3,
  },
  postContent: {
    marginVertical: 2,
    color: "#606060",
  },
  primePostContent: {
    marginVertical: 2,
    color: "#ffffff",
  },
  adminPostContent: {
    marginVertical: 2,
    color: "#020101",
  },
  postDescription: {
    fontSize: 12,
  },
  postLikes: {
    marginBottom: 20,
  },
  postTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },

  // User Info
  postUserInfo: {
    flexDirection: "row",
    paddingBottom: 5,
  },
  postUserInfoImage: {
    width: "100%",
    height: "100%",
  },
  postUserInfoName: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#606060",
  },
  postUserInfoPicContainer: {
    flex: 0.25,
    aspectRatio: 1,
    paddingRight: 5,
  },
  postUserInfoTextContainer: {
    justifyContent: "space-around",
  },
  postUserInfoTime: {
    color: "#8F92A1",
  },
  postVideo: {
    width: "auto",
    height: 205,
    borderRadius: 10,
    marginBottom: 15,
  },
  primePostTitle: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 18,
  },
  primePostUserInfoName: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#ffffff",
  },
  primeTitle: { color: "#ffffff", fontWeight: "bold", fontSize: 30 },
  primeCardLeft: { width: "auto", flexGrow: 2 },
  primeCardRight: { width: "auto" },
  adminPostTitle: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 18,
  },
  adminPostUserInfoName: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#020101",
  },
  adminTitle: { color: "#ffffff", fontWeight: "bold", fontSize: 30 },
  adminCardLeft: { width: "auto", flexGrow: 2 },
  adminCardRight: { width: "auto" },

  // Q

  // R
  registerButtonBox: {
    width: "100%",
    height: "30%",
  },
  passwordRecoveryBox: {
    width: "100%",
    height: "60%",
  },
  registerForm: { width: "100%", height: "85%" },

  // S
  scrollView: { marginBottom: 20 },
  settingsInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
  },
  showView: {
    borderWidth: 1,
    borderColor: "#b9a054",
    // backgroundColor: "#fffd9b",
    padding: 10,
    borderRadius: 10,
  },
  showViewTitle: {
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  showViewDescription: {},
  showViewTime: {},
  signInForm: {
    borderRadius: 10,
    paddingTop: 50,
    borderWidth: 1,
    // borderRadius: 2,
  },
  recoveryForm: {
    borderRadius: 10,
    paddingTop: 50,
    borderWidth: 1,
    width: "100%",
    height: "50%",
    // borderRadius: 2,
  },
  signInScreen: {
    backgroundColor: "#000000",
    flex: 1,
    alignItems: "center",
  },

  // T
  // Text Types
  textHuge: {
    fontFamily: "inter-bold",
    fontSize: 40,
    color: "#020101",
    textAlign: "center",
  },
  labelText: {
    // fontFamily: "inter-bold",
    fontSize: 13,
    // color: "#8F92A1",
    paddingTop: 3,
    paddingBottom: 3,
  },
  textParagraph: {
    marginVertical: 8,
    lineHeight: 20,
  },
  textTitle: {
    fontFamily: "inter-bold",
    fontSize: 18,
  },

  // U
  uploadBox: { backgroundColor: "#ffffff" },

  // V
  videoUpload: { width: 200, height: 200 },

  // W

  // X

  // Y

  // Z

  // Container Sizes

  // --p-bshade: 0 0px 25px 1px #611821;
  // --p2-bshade: 0 0px 25px 1px #b9a054;
});

// TERNARY USING 3 LOGICS OF ADMIN, PRIME AND USER
// "Colors of what needs to be renderd"={
//         admin
//           ? "Colors/ settings of Admin"
//           : prime
//           ? "colors/ settings of Prime"
//           : "colors/ settings of User"
//       }
