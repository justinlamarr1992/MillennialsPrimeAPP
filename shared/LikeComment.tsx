import { View, Text, Pressable, useColorScheme } from "react-native";
import { logger } from "@/utils/logger";
import React, { useState, useRef, useCallback } from "react";
import { COLORS } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { globalStyles } from "@/constants/global";
import {
  BottomSheetModal,
} from "@gorhom/bottom-sheet";

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

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomCommentSheetModalRef.current?.present();
    logger.log("Like/Comment pressed");
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
          globalStyles.borderDefault,
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
        {/* Modal Code will go here */}
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
          <Text>13</Text>
        </Pressable>
      </View>
      {/* Share Button */}
      {/* <View style={[globalStyles.flexRow]}>
        <Text>
          <Ionicons
            name="arrow-redo-sharp"
            size={size}
            color={colors["defaultText"]}
          />
        </Text>
      </View> */}
    </View>
  );
}
// colors["background"];
