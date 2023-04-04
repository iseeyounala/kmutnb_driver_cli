import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import AlertModalFail from "../components/AlertModalFail";
import AlertModalSuccess from "../components/AlertModalSuccess";
import Axios from "../constant/Axios";

const NotifyCarScreen = ({ navigation }) => {
  const [emgcy_detail, setEmgcy_detail] = useState("");
  const [isModalHandelFail, setModalHandelFail] = useState(false);
  const [isModalHandelSuccess, setModalHandelSuccess] = useState(false);
  const [textModal, setTextModal] = useState("");

  const toggleModalFail = () => {
    setModalHandelFail(!isModalHandelFail);
  };

  const toggleModalSuccess = () => {
    setModalHandelSuccess(!isModalHandelSuccess);
  };

  const handleUsername = (text) => {
    setEmgcy_detail(text);
  };
  const handleNotify = () => {
    if (emgcy_detail.length > 0) {
      Axios.post("/mobile/driver/carEmgcy", {
        get_car_emgcy_detail: emgcy_detail,
      })
        .then((res) => {
          let { status, meg } = res.data;
          if (status) {
            setTextModal(meg);
            toggleModalSuccess();
            setTimeout(() => {
                navigation.navigate('hometab');
            }, 1000);
          } else {
            toggleModalFail();
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      setTextModal("กรอกรายละเอียดก่อนทำการแจ้ง");
      toggleModalFail();
    }
  };
  return (
    <View className="flex-1 p-5">
      <Text className="font-kanit_semi_bold text-sm text-red-500">
        ระบุสาเหตุ
      </Text>
      <TextInput
        className="bg-white rounded-md h-50 my-2 px-3"
        onChangeText={handleUsername}
      />
      <TouchableOpacity
        className="justify-center items-center bg-red-400 h-[45px] rounded"
        onPress={handleNotify}
      >
        <Text className="font-kanit_semi_bold text-lg text-white">
          แจ้งปัญหา
        </Text>
      </TouchableOpacity>
      <AlertModalFail
        isModalHandel={isModalHandelFail}
        onBackdropPress={toggleModalFail}
        detailText={textModal}
      />
      <AlertModalSuccess
        isModalHandel={isModalHandelSuccess}
        // onBackdropPress={toggleModalSuccess}
        detailText={textModal}
      />
    </View>
  );
};

export default NotifyCarScreen;
