import { View, Text } from "react-native";
import React, { useState } from "react";

const LoginScreen = () => {
  const username = useState(null);
  const password = useState(null);
  
  return (
    <View className="flex-1 justify-center items-center">
      <Text>LoginScreen</Text>
    </View>
  );
};

export default LoginScreen;
