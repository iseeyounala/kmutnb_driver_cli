import { View, Text, TouchableOpacity } from "react-native";
import React, { useRef, useState } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ScrollView } from "react-native-gesture-handler";

const BottomSheetCustom = ({children}) => {
  const sheetRef = useRef(null);
  const [isOpen, setIsOpen] = useState(true);
  const snapPoint = ["10%", "40%", "90%"];
  // const [checkPointData, setCheckPointData] = useState([
  //   {
  //     checkPointName: "คณะเทคโนโลยีการจัดการอุตสาหกรรม",
  //     pickUp: 5,
  //     pickOut: 2,
  //   },
  //   {
  //     checkPointName: "หอชาย",
  //     pickUp: 5,
  //     pickOut: 2,
  //   },
  // ]);
  return (
    <BottomSheet ref={sheetRef} snapPoints={snapPoint}>
      <BottomSheetView>
       {children}
      </BottomSheetView>
    </BottomSheet>
  );
};

export default BottomSheetCustom;
