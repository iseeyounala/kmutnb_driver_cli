import { View, Text } from "react-native";
import React, { useRef, useState } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

const BottomSheetCustom = () => {
  const sheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = useState(true);
  const snapPoint = ["10%","40%", "90%"];
  return (
    <BottomSheet ref={sheetRef} snapPoints={snapPoint}>
      <BottomSheetView>
        <Text>BottomSheet</Text>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default BottomSheetCustom;
