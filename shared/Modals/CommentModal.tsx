import { Text } from "react-native";
import { logger } from "@/utils/logger";
import React, { useRef, useCallback, useMemo } from "react";
import { globalStyles } from "@/constants/global";
import {
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function CommentModal({}) {
  // useRef
  const bottomCommentSheetModalRef = useRef<BottomSheetModal>(null);
  //   useMemo
  const snapPoints = useMemo(() => ["25%", "50%"], []);
  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    logger.log("Comment modal sheet changed:", index);
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
          <Text>CommentModal</Text>
        </BottomSheetView>
      </BottomSheetModal>
      {/* </BottomSheet> */}
    </GestureHandlerRootView>
  );
}
