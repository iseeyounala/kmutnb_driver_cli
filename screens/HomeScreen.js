import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import socket from "../constant/socket";
import AlertModalSuccess from "../components/AlertModalSuccess";

const HomeScreen = ({ navigation }) => {
  const [isModalHandelSuccess, setModalHandelSuccess] = useState(false);
  const [textModal, setTextModal] = useState("");

  const toggleModalSuccess = () => {
    setModalHandelSuccess(!isModalHandelSuccess);
  };
  useEffect(() => {
    socket.on("update_list_urgent", () => {
      console.log("update_list_urgent!!!");
      setTextModal("มีรายการเข้ามาใหม่!");
      toggleModalSuccess();
      setTimeout(() => {
        navigation.navigate("UrgentScreen");
      }, 1000);
    });
  }, [socket]);
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
      <TouchableOpacity
        onPress={() => navigation.navigate("UrgentScreen")}
        className="flex-row p-10 mb-5"
      >
        <View className="flex-1 bg-white rounded-md justify-center items-center h-[100] m-1">
          <MaterialIcons name="directions" size={20} />
          <Text className="font-kanit_semi_bold text-[20px]">
            รายการฉุกเฉิน
          </Text>
        </View>
      </TouchableOpacity>
      <AlertModalSuccess
        isModalHandel={isModalHandelSuccess}
        onBackdropPress={toggleModalSuccess}
        detailText={textModal}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
