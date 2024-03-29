import React from 'react';
import {Dimensions, View, StyleSheet, Platform} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  HomeIcon,
  ClockIcon,
  QrCodeIcon,
  BellAlertIcon,
  UserIcon,
} from 'react-native-heroicons/outline';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import PickUpScreen from '../screens/PickUpScreen';
import AccountScreen from '../screens/AccountScreen';
import HeaderStack from '../components/HeaderStack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const {height} = Dimensions.get('window');

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={route => ({
        tabBarActiveTintColor: '#1DAE46',
        tabBarInactiveTintColor: '#000000',
        tabBarStyle: {
          backgroundColor: '#FFF',
          shadowOpacity: 0.2,
          // marginTop: 10,
          // opacity: 0.3,
          height: Platform.OS === 'ios' ? height * 0.1 : 60,
        },
        tabBarLabelStyle: {
          fontFamily: 'Kanit-Medium',
          fontSize: 13,
        },
      })}>
      <Tab.Screen
        name="hometab"
        component={HomeStack}
        options={{
          tabBarLabel: 'หน้าหลัก',
          headerShown: false,
          tabBarIcon: ({color, size}) => <HomeIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="notification"
        component={PickUpScreen}
        options={{
          tabBarLabel: 'รับ-ส่ง',
          headerShown: false,
          tabBarBadge: 3,
          tabBarBadgeStyle: {backgroundColor: 'red'},
          unmountOnBlur: true,
          tabBarIcon: ({color, size}) => (
            // <BellAlertIcon color={color} size={size} />
            <MaterialIcons name="airport-shuttle" color={color} size={size} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="account"
        component={AccountScreen}
        options={{
          tabBarLabel: 'บัญชี',
          headerShown: false,
          tabBarIcon: ({color, size}) => <UserIcon color={color} size={size} />,
        }}
      /> */}
    </Tab.Navigator>
  );
};

export default TabNavigator;

const style = StyleSheet.create({
  radius_in: {
    backgroundColor: '#1DAE46',
    width: 50,
    height: 50,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radius_out: {
    backgroundColor: '#FFFF',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    top: -10,
  },
});
