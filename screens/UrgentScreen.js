import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment/min/moment-with-locales";
import AlertModalFail from "../components/AlertModalFail";
import AlertModalSuccess from "../components/AlertModalSuccess";
import Axios from "../constant/Axios";
import socket from "../constant/socket";
moment.locale("th");

const UrgentScreen = ({ navigation }) => {
  const [dataList, setDataList] = useState([]);
  const [isModalHandelFail, setModalHandelFail] = useState(false);
  const [isModalHandelSuccess, setModalHandelSuccess] = useState(false);
  const [textModal, setTextModal] = useState("");

  const toggleModalFail = () => {
    setModalHandelFail(!isModalHandelFail);
  };

  const toggleModalSuccess = () => {
    setModalHandelSuccess(!isModalHandelSuccess);
  };

  useEffect(() => {
    socket.on("update_list_urgent", () => {
      console.log("update_list_urgent!!!");
      getList();
    });
    socket.on("update_list_checkPoint", () => {
      getList();
    });
  }, [socket]);

  const getList = () => {
    Axios.post("/mobile/driver/getDataListUrgent")
      .then((res) => {
        console.log(res.data);
        let { status, result } = res.data;
        status && setDataList(result);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const goToCencelUrgent = (get_car_id) => {
    navigation.navigate("UrgentCancelScreen", { get_car_id: get_car_id });
  };

  const confirmUrgent = (get_car_id) => {
    Axios.post("/mobile/driver/confirmUrgent", {
      get_car_id: get_car_id,
    })
      .then((res) => {
        // console.log(res.data);
        let { status, meg } = res.data;
        if (status) {
          setTextModal(meg);
          toggleModalSuccess();
          getList();
        } else {
          toggleModalFail();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getList();
  }, []);
  return (
    <View className="flex-1 p-5 bg-gray-100">
      <ScrollView>
        {dataList.map((val, idx) => {
          return (
            <View
              key={idx}
              className="flex-col bg-white rounded-lg justify-center p-5 mt-5"
            >
              <View className="flex-col">
                <Text className="text-orange_theme text-[15px] font-kanit_bold">
                  จุดรับ {val.departure_name}
                </Text>
                <Text className="text-green_new text-[15px] font-kanit_bold">
                  จุดส่ง {val.destination_name}
                </Text>
                <View className="flex-row justify-start items-center">
                  <MaterialCommunityIcons
                    name="alarm-multiple"
                    color="#000000"
                    size={18}
                  />
                  <Text className="text-black text-[15px] font-kanit_semi_bold ml-2">
                    {moment(val.get_car_created_at).format("LLL")}
                  </Text>
                </View>
                <View className="flex-row">
                  <Text className="text-black text-[15px] font-kanit_semi_bold">
                    สถานะรายการ
                  </Text>
                  {val.get_car_urgent_status == 1 && (
                    <Text className="text-orange_theme text-[15px] font-kanit_semi_bold ml-2">
                      รอยืนยัน
                    </Text>
                  )}
                  {val.get_car_urgent_status == 2 && (
                    <Text className="text-green_new text-[15px] font-kanit_semi_bold ml-2">
                      ยืนยัน
                    </Text>
                  )}
                </View>
                <View className="flex-row">
                  <Text className="text-black text-[15px] font-kanit_semi_bold">
                    สถานะนักศึกษา
                  </Text>
                  {val.get_car_status == 1 && (
                    <Text className="text-orange_theme text-[15px] font-kanit_semi_bold ml-2">
                      รอรถ
                    </Text>
                  )}
                  {val.get_car_status == 2 && (
                    <Text className="text-green_new text-[15px] font-kanit_semi_bold ml-2">
                      อยู่บนรถ
                    </Text>
                  )}
                </View>
                <View className="flex-row justify-around">
                  {val.get_car_urgent_status == 1 && (
                    <>
                      <TouchableOpacity
                        onPress={() => goToCencelUrgent(val.get_car_id)}
                        className="bg-red-500 rounded-md h-10 w-[50px] justify-center items-center mt-5"
                      >
                        <MaterialCommunityIcons
                          name="close-box"
                          color="#FFFF"
                          size={18}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => confirmUrgent(val.get_car_id)}
                        className="bg-green-400 rounded-md h-10 w-[50px] justify-center items-center mt-5"
                      >
                        <MaterialCommunityIcons
                          name="check-circle"
                          color="#FFFF"
                          size={18}
                        />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            </View>
          );
        })}
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
      </ScrollView>
      <View className="bg-gray-100 h-[50px] justify-center items-center" />
    </View>
  );
};

export default UrgentScreen;
