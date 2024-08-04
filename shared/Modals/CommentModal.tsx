import { View, Text, useColorScheme, ScrollView } from "react-native";
import React, { useRef, useCallback, useMemo } from "react";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/colors";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function CommentModal({}) {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  // useRef
  const bottomCommentSheetModalRef = useRef<BottomSheetModal>(null);
  //   useMemo
  const snapPoints = useMemo(() => ["25%", "50%"], []);
  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomCommentSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* <BottomSheet snapPoints={snapPoints}> */}
      <BottomSheetModal
        style={globalStyles.bottomCommentSheet}
        ref={bottomCommentSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <BottomSheetView>
          <Text>CommentModalssss</Text>
        </BottomSheetView>
      </BottomSheetModal>
      {/* </BottomSheet> */}
    </GestureHandlerRootView>
  );
}
