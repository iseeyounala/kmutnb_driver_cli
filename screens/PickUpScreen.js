import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
  Animated,
  ScrollView,
} from "react-native";
import React, {
  useContext,
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
  Fragment,
} from "react";
import MapView, { Marker, AnimatedRegion, Circle } from "react-native-maps";
// import BottomSheet from '@gorhom/bottom-sheet';
import BottomSheetCustom from "../components/BottomSheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapViewDirections from "react-native-maps-directions";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  locationPermission,
  getCurrentLocation,
} from "../helper/helperFunction";
import { commonImage } from "../constant/images";
import Loader from "../components/Loader";
import AlertModalFail from "../components/AlertModalFail";
import socket from "../constant/socket";
const screen = Dimensions.get("window");
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_MAP_KEY = "AIzaSyBHBTkH9fICG5hTL1xNFkyLXaQGyZU6fek";
// import {AuthContext} from '../context/AuthContext';
import Axios from "../constant/Axios";
import AlertModalSuccess from "../components/AlertModalSuccess";

const PickUpScreen = ({ navigation }) => {
  const mapRef = useRef();
  const markerRef = useRef();
  // const {logout} = useContext(AuthContext);

  const [state, setState] = useState({
    curLoc: {
      latitude: 30.7046,
      longitude: 77.1025,
    },
    destinationCords: {},
    isLoading: false,
    coordinate: new AnimatedRegion({
      latitude: 30.7046,
      longitude: 77.1025,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }),
    time: 0,
    distance: 0,
    heading: 0,
    showMaker: [],
    radius: 100,
  });
  const [isModalHandelFail, setModalHandelFail] = useState(false);

  const {
    curLoc,
    time,
    distance,
    destinationCords,
    isLoading,
    coordinate,
    heading,
    showMaker,
    radius,
  } = state;
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const toggleModalFail = () => {
    setModalHandelFail(!isModalHandelFail);
  };

  useEffect(() => {
    getLiveLocation();
    updateSocketId();
    get_data_check_point();
    // logout();
  }, []);

  const getLiveLocation = async () => {
    const locPermissionDenied = await locationPermission();
    if (locPermissionDenied) {
      const { latitude, longitude, heading } = await getCurrentLocation();
      console.log("get live location after 4 second", heading);
      animate(latitude, longitude);
      updateState({
        heading: heading,
        curLoc: { latitude, longitude },
        coordinate: new AnimatedRegion({
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }),
      });
      sentDataDriver(latitude, longitude);
    }
  };

  const updateSocketId = async () => {
    try {
      const savedUser = await AsyncStorage.getItem("userData");
      const currentUser = JSON.parse(savedUser);
      Axios.post("/mobile/driver/updateSocketId", {
        driver_id: currentUser.driver_id,
        socketId: socket.id,
      })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const sentDataDriver = async (latitude, longitude) => {
    try {
      const savedUser = await AsyncStorage.getItem("userData");
      const currentUser = JSON.parse(savedUser);
      let data = {
        driver_id: currentUser.driver_id,
        latitude: latitude,
        longitude: longitude,
      };
      Axios.post("/mobile/driver/updateLocation", data)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (error) {
      console.log(error);
    }
  };
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

  const onPressLocation = () => {
    navigation.navigate("ChooseLocation", { getCordinates: fetchValue });
  };
  const fetchValue = (data) => {
    console.log("this is data", data);
    updateState({
      destinationCords: {
        latitude: data.destinationCords.latitude,
        longitude: data.destinationCords.longitude,
      },
    });
  };

  const animate = (latitude, longitude) => {
    const newCoordinate = { latitude, longitude };
    if (Platform.OS == "android") {
      if (markerRef.current) {
        markerRef.current.animateMarkerToCoordinate(newCoordinate, 500);
      }
    } else {
      coordinate.timing(newCoordinate).start();
    }
  };

  const onCenter = () => {
    mapRef.current.animateToRegion({
      latitude: curLoc.latitude,
      longitude: curLoc.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getLiveLocation();
      // console.log(socket.id);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    socket.on("update_list_checkPoint", () => {
      console.log("update_list_checkPoint!!!");
      get_data_check_point();
    });
  }, [socket]);

  const get_data_check_point = () => {
    Axios.post("/mobile/driver/getDataListCheckPoint")
      .then((res) => {
        console.log(res.data);
        let { status, result } = res.data;
        status ? updateState({ showMaker: result }) : null;
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const checkLocationInCircle = (center, radius, location) => {
    center.latitude = parseFloat(center.latitude);
    location.latitude = parseFloat(location.latitude);
    location.longitude = parseFloat(location.longitude);
    center.longitude = parseFloat(center.longitude);
    const R = 6371e3; // Earth's radius in meters
    const lat1 = (center.latitude * Math.PI) / 180;
    const lat2 = (location.latitude * Math.PI) / 180;
    const deltaLat = ((location.latitude - center.latitude) * Math.PI) / 180;
    const deltaLon = ((location.longitude - center.longitude) * Math.PI) / 180;

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in meters

    // return distance <= radius;
    if (distance <= radius) {
      console.log("in circle");
    } else {
      console.log(distance, "out circle", radius);
      toggleModalFail();
    }
  };

  const fetchTime = (d, t) => {
    updateState({
      distance: d,
      time: t,
    });
  };
  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1">
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={{
            ...curLoc,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        >
          <Marker.Animated ref={markerRef} coordinate={coordinate}>
            <Image
              source={commonImage.icCurLoc}
              style={{
                width: 40,
                height: 40,
                transform: [{ rotate: `${heading}deg` }],
              }}
              resizeMode="contain"
            />
          </Marker.Animated>

          {Object.keys(destinationCords).length > 0 && (
            <Marker
              coordinate={destinationCords}
              image={commonImage.icGreenMarker}
            />
          )}

          {showMaker.map((val, key) => {
            return (
              <Fragment key={key}>
                <Marker
                  onPress={(location) => {
                    // let center = {
                    //   latitude: val.latitude,
                    //   longitude: val.longitude,
                    // };
                    // checkLocationInCircle(center, radius, curLoc);
                    updateState({
                      destinationCords: {
                        latitude: val.cpd_lat,
                        longitude: val.cpd_long,
                      },
                    });
                  }}
                  coordinate={{
                    latitude: val.cpd_lat,
                    longitude: val.cpd_long,
                  }}
                >
                  <Entypo name="location-pin" color="#F37234" size={40} />
                </Marker>
                <Circle
                  center={{ latitude: val.cpd_lat, longitude: val.cpd_long }}
                  radius={radius}
                  fillColor="rgba(250,226,214,0.5)"
                  strokeWidth={0}
                />
              </Fragment>
            );
          })}

          {Object.keys(destinationCords).length > 0 && (
            <MapViewDirections
              origin={curLoc}
              destination={destinationCords}
              apikey={GOOGLE_MAP_KEY}
              strokeWidth={4}
              strokeColor="green"
              optimizeWaypoints={true}
              mode="DRIVING"
              onStart={(params) => {
                console.log(
                  `Started routing between "${params.origin}" and "${params.destination}"`
                );
              }}
              onReady={(result) => {
                console.log(`Distance: ${result.distance} km`);
                console.log(`Duration: ${result.duration} min.`);
                fetchTime(result.distance, result.duration),
                  mapRef.current.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      // right: 30,
                      // bottom: 300,
                      // left: 30,
                      // top: 100,
                    },
                  });
                if (result.distance < 0.02) {
                  updateState({
                    destinationCords: {},
                    distance: 0,
                    time: 0,
                  });
                }
              }}
              onError={(errorMessage) => {
                // console.log('GOT AN ERROR');
              }}
            />
          )}
        </MapView>
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 70,
            right: 0,
          }}
          onPress={onCenter}
        >
          <Image source={commonImage.greenIndicator} />
        </TouchableOpacity>
      </View>
      {distance !== 0 && time !== 0 && (
        <View className="justify-center items-center rounded-md bg-green_new m-3 h-20 w-[200] absolute top-[10] left-[70]">
          <Text className="font-kanit_semi_bold text-lg text-white">
            เวลา: {time.toFixed(0)} นาที
          </Text>
          <Text className="font-kanit_semi_bold text-lg text-white">
            ระยะทาง: {distance.toFixed(0)} KM
          </Text>
        </View>
      )}
      <Loader isLoading={isLoading} />
      <BottomSheetCustom>
        <View className="p-5">
          <TouchableOpacity
            className="justify-center items-center bg-red-400 rounded h-[35px]"
            onPress={() => {
              navigation.navigate("NotifyCarScreen");
            }}
          >
            <Text className="font-kanit_semi_bold text-lg text-white">
              แจ้งปัญหา
            </Text>
          </TouchableOpacity>
          <Text className="font-kanit_semi_bold text-[13px] text-red-500">
            *กรณีรถเกิดขัดข้อง
          </Text>
          <Text className="text-black font-kanit_bold text-[20px] mt-2">
            รายละเอียด CheckPoint
          </Text>
          <ScrollView className="mb-10">
            {showMaker.map((data, idx) => {
              return (
                <TouchableOpacity
                  className="flex-col justify-between"
                  key={idx}
                >
                  <View className="flex-col rounded-lg p-3">
                    <View className="flex-row">
                      <MaterialIcons
                        name="directions"
                        color="#F37234"
                        size={20}
                      />
                      <Text className="text-black font-kanit_regular text-[15px] ml-1">
                        {data.cpd_name}
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
                          {data.amount.upPoint} คน
                        </Text>
                      </View>
                      <View className="flex-row bg-red-400 rounded-lg h-[30px] w-[75px] justify-center items-center">
                        <MaterialIcons
                          name="person-remove"
                          color="#FFF"
                          size={20}
                        />
                        <Text className="text-white font-kanit_regular text-[15px] ml-1">
                          {data.amount.downPoint} คน
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </BottomSheetCustom>
      <AlertModalFail
        isModalHandel={isModalHandelFail}
        onBackdropPress={toggleModalFail}
        detailText="คุณอยู่ห่างจากจุด CheckPoint"
      />
      <AlertModalSuccess
        isModalHandel={isModalHandelSuccess}
        onBackdropPress={toggleModalSuccess}
        detailText={textModal}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});

export default PickUpScreen;
