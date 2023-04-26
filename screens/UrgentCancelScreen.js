import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useRoute } from "@react-navigation/native";
import AlertModalFail from "../components/AlertModalFail";
import AlertModalSuccess from "../components/AlertModalSuccess";
import Axios from "../constant/Axios";
const UrgentCancelScreen = ({navigation}) => {
  const route = useRoute();
  const { get_car_id } = route.params;

  const [detail, setDetail] = useState("");
  const [isModalHandelFail, setModalHandelFail] = useState(false);
  const [isModalHandelSuccess, setModalHandelSuccess] = useState(false);
  const [textModal, setTextModal] = useState("");

  const toggleModalFail = () => {
    setModalHandelFail(!isModalHandelFail);
  };

  const toggleModalSuccess = () => {
    setModalHandelSuccess(!isModalHandelSuccess);
  };

  const handledetail = (text) => {
    setDetail(text);
  };

  const handleSubmit = () => {
    if (detail != "") {
      Axios.post("/mobile/driver/cancelUrgent", {
        get_car_id: get_car_id,
        detail: detail,
      })
        .then((res) => {
          console.log(res.data);
          let {status, meg} = res.data;
          if (status) {
            setTextModal(meg);
            toggleModalSuccess();
            setTimeout(() => {
                navigation.navigate("Home");
            }, 1000);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      setTextModal("กรอกสาเหตุให้ครบถ้วน");
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
        onChangeText={handledetail}
      />
      <TouchableOpacity
        className="justify-center items-center bg-red-400 h-[45px] rounded"
        onPress={handleSubmit}
      >
        <Text className="font-kanit_semi_bold text-lg text-white">แจ้ง</Text>
      </TouchableOpacity>
      <AlertModalFail
        isModalHandel={isModalHandelFail}
        onBackdropPress={toggleModalFail}
        detailText={textModal}
      />
      <AlertModalSuccess
        isModalHandel={isModalHandelSuccess}
        onBackdropPress={toggleModalSuccess}
        detailText={textModal}
      />
    </View>
  );
};

export default UrgentCancelScreen;
