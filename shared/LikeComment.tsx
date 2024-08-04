import { View, Text, Pressable, useColorScheme } from "react-native";
import React, { useState, useRef, useMemo, useCallback } from "react";
import { COLORS } from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { globalStyles } from "@/constants/global";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function LikeComment() {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  const size = 20;

  // useStates
  const [noLike, setNoLike] = useState(true);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  // useRef
  const bottomCommentSheetModalRef = useRef<BottomSheetModal>(null);

  //   useMemo
  const snapPoints = useMemo(() => ["25%", "50%"], []);
  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomCommentSheetModalRef.current?.present();
    console.log("pressed");
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const likePressed = () => {
    // add extra stuff here from backend to see if they liked it
    if (liked == false) {
      setNoLike(false);
      setDisliked(false);
      setLiked(true);
    }
  };
  const unlikePressed = () => {
    // add extra stuff here from backend to see if they liked it
    if (liked == true) {
      setNoLike(true);
      setDisliked(false);
      setLiked(false);
    }
  };

  const dislikePressed = () => {
    // add extra stuff here from backend to see if they liked it
    if (disliked == false) {
      setNoLike(false);
      setLiked(false);
      setDisliked(true);
    }
  };
  const undislikePressed = () => {
    // add extra stuff here from backend to see if they liked it
    if (disliked == true) {
      setNoLike(true);
      setLiked(false);
      setDisliked(false);
    }
  };

  return (
    <View
      style={[
        globalStyles.flexRow,
        globalStyles.flex1,
        globalStyles.flexJustifyContentSpaceBetween,
      ]}
    >
      <View
        style={[
          globalStyles.flexRow,
          globalStyles.flexJustifyContentSpaceBetween,
          //   globalStyles.borderDefault,
          globalStyles.likeBox,
        ]}
      >
        {noLike && (
          <View
            style={[
              globalStyles.flexRow,
              globalStyles.flexJustifyContentSpaceBetween,
              globalStyles.flexAlignSelfFlexEnd,
            ]}
          >
            {/* Likes */}
            <Pressable
              onPress={likePressed}
              style={[
                globalStyles.flexRow,
                globalStyles.flexJustifyContentSpaceBetween,
              ]}
            >
              <Ionicons
                name="heart-outline"
                size={size}
                color={colors["secC"]}
              />
              <Text>13</Text>
            </Pressable>
            <Pressable
              onPress={dislikePressed}
              style={[
                globalStyles.flexRow,
                globalStyles.flexJustifyContentSpaceBetween,
              ]}
            >
              <Ionicons
                name="skull-outline"
                size={size}
                color={colors["hexC"]}
              />
              <Text>13</Text>
            </Pressable>
          </View>
        )}
        {liked && (
          <View
            style={[
              globalStyles.flexRow,
              globalStyles.flexJustifyContentSpaceBetween,
              globalStyles.flexAlignSelfFlexEnd,
            ]}
          >
            {/* Likes only */}
            <Pressable
              onPress={unlikePressed}
              style={[
                globalStyles.flexRow,
                globalStyles.flexJustifyContentSpaceBetween,
              ]}
            >
              <Ionicons name="heart" size={size} color={colors["secC"]} />
              <Text>13</Text>
            </Pressable>
          </View>
        )}

        {disliked && (
          <View
            style={[
              globalStyles.flexRow,
              globalStyles.flexJustifyContentSpaceBetween,
              globalStyles.flexAlignSelfFlexEnd,
            ]}
          >
            {/* Dislikes only */}
            <Pressable
              onPress={undislikePressed}
              style={[
                globalStyles.flexRow,
                globalStyles.flexJustifyContentSpaceBetween,
              ]}
            >
              <Ionicons name="skull" size={size} color={colors["hexC"]} />
              <Text>13</Text>
            </Pressable>
          </View>
        )}
        {/* Comments */}
        <Pressable
          onPress={handlePresentModalPress}
          style={[
            globalStyles.flexRow,
            globalStyles.flexJustifyContentSpaceBetween,
            globalStyles.flexAlignSelfFlexEnd,
          ]}
        >
          <Ionicons
            name="chatbox-outline"
            size={size}
            color={colors["defaultText"]}
          />
          {/* <Ionicons name="chatbox" size={size} color={colors["defaultText"]} /> */}
          <Text>13</Text>
        </Pressable>
      </View>
      <View style={[globalStyles.flexRow]}>
        {/* Shares */}
        <Text>
          <Ionicons
            name="arrow-redo-sharp"
            size={size}
            color={colors["defaultText"]}
          />
        </Text>
      </View>
      {/* Testing Modal */}

      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheet index={1} snapPoints={snapPoints}>
          {/* <BottomSheetModal
          style={globalStyles.bottomCommentSheet}
          ref={bottomCommentSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        > */}
          <BottomSheetView>
            <Text>CommentModalssss</Text>
          </BottomSheetView>
          {/* </BottomSheetModal> */}
        </BottomSheet>
      </GestureHandlerRootView>
      {/* Testing Modal */}
    </View>
  );
}
// colors["background"];
