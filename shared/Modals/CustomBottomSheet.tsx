import { View, Text, useColorScheme } from "react-native";
import React, { useMemo, forwardRef } from "react";

import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import BottomSheet from "@gorhom/bottom-sheet";

interface Props {
  title: string;
}
export type Ref = BottomSheet;

const CustomBottomSheet = forwardRef<Ref, Props>((props, ref) => {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  const snapPoints = useMemo(() => ["25%", "50%", "70%", "100%"], []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheet
        ref={ref}
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        //   backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: colors["backgroundColor"] }}
        backgroundStyle={{ backgroundColor: colors["backgroundModal"] }}
      >
        <View>
          <Text
            style={[
              globalStyles.textHuge,
              globalStyles.padding,
              { color: colors["priT"] },
            ]}
          >
            {props.title}
          </Text>
        </View>
        {/* <BottomSheetTextInput style={[globalStyles.input]} /> */}
      </BottomSheet>
    </GestureHandlerRootView>
  );
});

export default CustomBottomSheet;
