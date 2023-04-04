import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState, useContext } from "react";
import { UserIcon, LockClosedIcon } from "react-native-heroicons/outline";
import { AuthContext } from "../context/AuthContext";
import { commonImage } from "../constant/images";
import AlertModalSuccess from "../components/AlertModalSuccess";
import AlertModalFail from "../components/AlertModalFail";
import Axios from "../constant/Axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const [textModal, setTextModal] = useState("");
  const [isModalHandelSuccess, setModalHandelSuccess] = useState(false);
  const [isModalHandelFail_Check, setModalHandelFail_Check] = useState(false);
  const [isModalHandelFail, setModalHandelFail] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsername = (text) => {
    setUsername(text);
  };
  const handlePassword = (text) => {
    setPassword(text);
  };
  const toggleModalFail_check = () => {
    setModalHandelFail_Check(!isModalHandelFail_Check);
  };
  const toggleModalFail = () => {
    setModalHandelFail(!isModalHandelFail);
  };
  const toggleModalSuccess = () => {
    setModalHandelSuccess(!isModalHandelSuccess);
  };

  const loginHandle = () => {
    if (username.length > 0 && password.length > 0) {
      Axios.post("/mobile/driver/login", {
        username: username,
        password: password,
      })
        .then((res) => {
          let { status, meg, token, driver_id } = res.data;
          if (status) {
            toggleModalSuccess();
            setTextModal(meg);
            setTimeout(() => {
              login(token, driver_id);
            }, 1000);
          } else {
            toggleModalFail();
            setTextModal(meg);
          }
          console.log(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      toggleModalFail_check();
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center bg-green_new">
      <View className="flex-colmn">
        <View className="items-center">
          <Text className="text-white text-[50px] font-kanit_bold mb-[-15]">
            KMUTNB
          </Text>
          <Text className="text-white text-[20px] font-kanit_semi_bold">
            SMART SERVICE For Driver
          </Text>
        </View>
        <View className="rounded-md p-5">
          <Text className="text-white font-kanit_semi_bold">
            <UserIcon color="white" size={20} /> Username
          </Text>
          <TextInput
            className="bg-white rounded-md h-10 my-2 px-3"
            onChangeText={handleUsername}
          />
          <Text className="text-white font-kanit_semi_bold">
            <LockClosedIcon color="white" size={20} className="mr-5" />
            Password
          </Text>
          <TextInput
            className="bg-white rounded-md h-10 my-2 px-3"
            secureTextEntry={true}
            onChangeText={handlePassword}
          />
          <TouchableOpacity
            onPress={loginHandle}
            className="bg-white rounded-md h-10 my-2 justify-center items-center"
          >
            <Text className="text-green_new font-kanit_semi_bold">
              เข้าสู่ระบบ
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <AlertModalSuccess
        isModalHandel={isModalHandelSuccess}
        // onBackdropPress={toggleModalSuccess}
        detailText={textModal}
      />
      <AlertModalFail
        isModalHandel={isModalHandelFail}
        onBackdropPress={toggleModalFail}
        detailText={textModal}
      />
      <AlertModalFail
        isModalHandel={isModalHandelFail_Check}
        onBackdropPress={toggleModalFail_check}
        title={true}
        titleText="กรุณากรอก"
        detailText="Username หรือ Password"
      />
    </SafeAreaView>
  );
};

export default LoginScreen;
