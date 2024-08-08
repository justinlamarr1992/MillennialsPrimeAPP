import { View, Text, ScrollView, useColorScheme, Button } from "react-native";
import React, {
  useContext,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { AuthContext } from "@/context/AuthContext";

import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import Item from "@/shared/EComm/Item";
import CustomBottomSheet from "@/shared/Modals/CustomBottomSheet";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function EComm() {
  const { auth, admin, prime } = useContext(AuthContext);
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  const bottomSheetRef = useRef<BottomSheet>(null);
  // SLIDING MODAL CODE ITS WORKS inside of component
  const snapPoints = useMemo(() => ["1%", "25%", "50%", "70%", "100%"], []);
  //userefs
  // TODO: CHANGE THIS NAME
  // const bottomSheetRef = useRef<BottomSheet>(null);
  // HAndle clossing the Modal
  const handleClosePress = () => bottomSheetRef.current?.close();
  const handleOpenPress = () => bottomSheetRef.current?.expand();
  const handleCollapsePress = () => bottomSheetRef.current?.collapse();
  const snapToIndex = (index: number) =>
    bottomSheetRef.current?.snapToIndex(index);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={3}
        disappearsOnIndex={1}
        {...props}
      />
    ),
    []
  );
  // SLIDING MODAL CODE ITS WORKS

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View
        style={[
          globalStyles.padding,
          { backgroundColor: colors["background"] },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          // style={[globalStyles.padding, { backgroundColor: colors["background"] }]}
        >
          <Button title="open" onPress={handleOpenPress} />
          <Button title="close" onPress={handleClosePress} />
          <Button title="collaspe" onPress={handleCollapsePress} />
          <Button title="Snap To 0" onPress={() => snapToIndex(0)} />
          <Button title="Snap To 1" onPress={() => snapToIndex(1)} />
          <Button title="Snap To 2" onPress={() => snapToIndex(2)} />
          <Button title="Snap To 3" onPress={() => snapToIndex(3)} />
          <Item
            itemName="User Item"
            picture=""
            description="This is what the description for an item for sale buy a Regular User will Look like the description with be limited to 2 lines"
            price="$###.##"
            prime={false}
            admin={false}
          />
          <Item
            itemName="Prime Item"
            picture=""
            description="This is what the description for an item for sale buy a Prime User will Look like the description with be limited to 2 lines"
            price="$###.##"
            prime={true}
            admin={false}
          />
          <Item
            itemName="Admin Item"
            picture=""
            description="This is what the description for an item for sale buy a Admin User will Look like the description with be limited to 2 lines"
            price="$###.##"
            prime={true}
            admin={true}
          />
        </ScrollView>
        {/* <CustomBottomSheet title="Will it work" /> */}
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
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
            This is the tester
          </Text>
        </View>
        <BottomSheetTextInput style={[globalStyles.input]} />
      </BottomSheet>
    </GestureHandlerRootView>
  );
}
