import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import FlashMessage from "react-native-flash-message";
// import CustomDrawer from '../components/CustomDrawer';
import TabNavigator from "./TabNavigator";
import HeaderStack from "../components/HeaderStack";
import NotifyCarScreen from "../screens/NotifyCarScreen";
import UrgentScreen from "../screens/UrgentScreen";
import UrgentCancelScreen from "../screens/UrgentCancelScreen";

const Stack = createNativeStackNavigator();
const AuthStack = () => {
  return (
    <>
      <Stack.Navigator
        screenOptions={() => ({
          headerShown: false,
        })}
      >
        <Stack.Screen name="Home" component={TabNavigator} />
        <Stack.Group
          screenOptions={() => ({
            // presentation: 'modal',
            headerShown: true,
          })}
        >
          <Stack.Screen
            name="NotifyCarScreen"
            component={NotifyCarScreen}
            options={{
              header: () => <HeaderStack title="รับ-ส่ง" />,
            }}
          />
           <Stack.Screen
            name="UrgentScreen"
            component={UrgentScreen}
            options={{
              header: () => <HeaderStack title="รับ-ส่ง(ฉุกเฉิน)" />,
            }}
          />
           <Stack.Screen
            name="UrgentCancelScreen"
            component={UrgentCancelScreen}
            options={{
              header: () => <HeaderStack title="รับ-ส่ง(ฉุกเฉิน)" />,
            }}
          />
        </Stack.Group>
      </Stack.Navigator>
      <FlashMessage position="top" />
    </>
  );
};

export default AuthStack;
