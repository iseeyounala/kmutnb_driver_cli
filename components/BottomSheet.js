import { View, Text, TouchableOpacity } from "react-native";
import React, { useRef, useState } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ScrollView } from "react-native-gesture-handler";

const BottomSheetCustom = () => {
  const sheetRef = useRef(null);
  const [isOpen, setIsOpen] = useState(true);
  const snapPoint = ["10%", "40%", "90%"];
  const [checkPointData, setCheckPointData] = useState([
    {
      checkPointName: "คณะเทคโนโลยีการจัดการอุตสาหกรรม",
      pickUp: 5,
      pickOut: 2,
    },
    {
      checkPointName: "หอชาย",
      pickUp: 5,
      pickOut: 2,
    },
  ]);
  return (
    <BottomSheet ref={sheetRef} snapPoints={snapPoint}>
      <BottomSheetView>
        <View className="p-5">
          <Text className="text-black font-kanit_bold text-[20px]">
            รายละเอียด CheckPoint
          </Text>
          <ScrollView className="mb-10">
            {checkPointData.map((data, idx) => {
              return (
                <TouchableOpacity className="flex-col justify-between" key={idx}>
                  <View className="flex-col rounded-lg p-3">
                    <View className="flex-row">
                      <MaterialIcons
                        name="directions"
                        color="#F37234"
                        size={20}
                      />
                      <Text className="text-black font-kanit_regular text-[15px] ml-1">
                        {data.checkPointName}
                      </Text>
                    </View>
                    <View className="flex-row justify-around mt-1">
                      <View className="flex-row bg-green-400 rounded-lg h-[30px] w-[75px] justify-center items-center">
                        <MaterialIcons
                          name="person-add"
                          color="#FFF"
                          size={20}
                        />
                        <Text className="text-white font-kanit_regular text-[15px] ml-1">
                          {data.pickUp} คน
                        </Text>
                      </View>
                      <View className="flex-row bg-red-400 rounded-lg h-[30px] w-[75px] justify-center items-center">
                        <MaterialIcons
                          name="person-remove"
                          color="#FFF"
                          size={20}
                        />
                        <Text className="text-white font-kanit_regular text-[15px] ml-1">
                        {data.pickOut} คน
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default BottomSheetCustom;
