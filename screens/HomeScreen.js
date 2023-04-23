import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React from "react";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = () => {
  return (
    <SafeAreaView className="flex-1">
      <View className="bg-green_new h-[200] justify-center items-center rounded-br-[70px] rounded-bl-[70px]">
        <Text className="text-white text-[50px] font-kanit_bold mb-[-15]">
          KMUTNB
        </Text>
        <Text className="text-white text-[20px] font-kanit_semi_bold">
          SMART SERVICE For Driver
        </Text>
      </View>
      {/* <View className="flex-row p-10 mb-5">
        <View className="flex-1 border border-gray_new bg-white rounded-md justify-center items-center h-[100] m-1">
          <MaterialIcons name="directions" size={20} />
          <Text className="font-kanit_semi_bold text-[20px]">แผนที่</Text>
        </View>
      </View> */}
    </SafeAreaView>
  );
};

export default HomeScreen;
