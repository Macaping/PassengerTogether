import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import * as Location from "expo-location";
import { Link } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

const { width } = Dimensions.get("window"); //Dimensions 이용

export default function HomeView() {
  const locations = ["천안역", "천안아산역", "선문대", "탕정역", "두정동 롯데"];
  interface Coordinates {
    latitude: number;
    longitude: number;
  }
  const coordinates: { [key: string]: Coordinates } = {
    천안역: { latitude: 36.8089885, longitude: 127.148933 },
    천안아산역: { latitude: 36.7946071, longitude: 127.1045608 },
    선문대: { latitude: 36.7989764, longitude: 127.0750025 },
    탕정역: { latitude: 36.78827, longitude: 127.084638 },
    "두정동 롯데": { latitude: 36.8261834, longitude: 127.1399744 },
  };

  const [selectedDeparture, setSelectedDeparture] = useState(locations[0]);
  const [selectedDestination, setSelectedDestination] = useState(locations[1]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [changingLocationType, setChangingLocationType] = useState("departure");

  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [route, setRoute] = useState<{ latitude: number; longitude: number }[]>(
    [],
  );
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("위치 권한이 거부되었습니다.");
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      if (currentLocation && currentLocation.coords) {
        setLocation(currentLocation.coords);
      } else {
        setErrorMsg("위치를 가져오는 데 실패했습니다.");
      }
    })();
  }, []);

  useEffect(() => {
    fetchRouteData();
  }, [selectedDeparture, selectedDestination]);

  const fetchRouteData = async () => {
    const departureCoord = coordinates[selectedDeparture];
    const destinationCoord = coordinates[selectedDestination];

    const MAP_KEY = process.env.EXPO_PUBLIC_MAP_KEY || ""; //길찾기 api 키 가져옴
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${MAP_KEY}&start=${departureCoord.longitude},${departureCoord.latitude}&end=${destinationCoord.longitude},${destinationCoord.latitude}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const geometry = data.features[0].geometry.coordinates;
      const polylineCoords: { latitude: number; longitude: number }[] =
        geometry.map((coord: [number, number]) => ({
          latitude: coord[1],
          longitude: coord[0],
        }));
      setRoute(polylineCoords);

      const summary = data.features[0].properties.summary;
      setDistance(summary.distance / 1000); // distance in km
      setDuration(summary.duration / 60); // duration in minutes
    } catch (error) {
      console.error("Error fetching route data:", error);
    }
  };

  const handleDateChange = (
    _event: DateTimePickerEvent,
    selectedDate?: Date | undefined,
  ): void => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(date);
      newDate.setFullYear(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
      );
      setDate(newDate);
    }
  };

  const handleTimeChange = (
    _event: DateTimePickerEvent,
    selectedTime?: Date,
  ) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDate(newDate);
    }
  };

  const openLocationModal = (type: "departure" | "destination") => {
    setChangingLocationType(type);
    setModalVisible(true);
  };

  const mapRef = useRef<MapView | null>(null);

  const handleLocationSelect = (location: string) => {
    if (changingLocationType === "departure") {
      setSelectedDeparture(location);
    } else {
      setSelectedDestination(location);
    }
    setModalVisible(false);

    const selectedCoordinates: Coordinates = coordinates[location];
    mapRef.current?.animateToRegion(
      {
        latitude: selectedCoordinates.latitude,
        longitude: selectedCoordinates.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000, // 애니메이션 지속 시간 (1초)
    );
  };

  return (
    <View style={styles.container}>
      {/* 지도 상자 */}
      <View style={map_styles.mapInfoBox}>
        {location ? (
          <MapView
            ref={mapRef} // 지도 참조 추가
            style={map_styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            <Marker
              coordinate={{
                latitude: coordinates[selectedDeparture].latitude,
                longitude: coordinates[selectedDeparture].longitude,
              }}
              title="출발지"
            />
            <Marker
              coordinate={{
                latitude: coordinates[selectedDestination].latitude,
                longitude: coordinates[selectedDestination].longitude,
              }}
              title="도착지"
            />
            {route && (
              <Polyline
                coordinates={route}
                strokeColor="#6B59CC"
                strokeWidth={4}
              />
            )}
          </MapView>
        ) : (
          <View style={map_styles.loadingContainer}>
            <Text>위치를 불러오는 중...</Text>
            {errorMsg ? <Text>{errorMsg}</Text> : null}
          </View>
        )}
      </View>

      {/* 상호작용 UI */}
      <View style={styles.interface}>
        <View style={main_styles.infoBox}>
          {/* 첫번째 열 */}
          <View
            style={{
              flexDirection: "row",
            }}
          >
            {/* 출발지 */}
            <View style={{ flex: 3 }}>
              <Text style={main_styles.locationLabel}>출발</Text>
              <TouchableOpacity onPress={() => openLocationModal("departure")}>
                <Text style={main_styles.routeText}>{selectedDeparture}</Text>
              </TouchableOpacity>
            </View>

            {/* 화살표 */}
            <View style={{ flex: 1 }}>
              {/* 빈 텍스트로 공간 확보 */}
              <Text></Text>
              <Text style={main_styles.arrow}>➜</Text>
            </View>

            {/* 도착지 */}
            <View style={{ flex: 3 }}>
              <Text style={main_styles.locationLabel}>도착</Text>
              <TouchableOpacity
                onPress={() => openLocationModal("destination")}
              >
                <Text style={main_styles.routeText}>{selectedDestination}</Text>
              </TouchableOpacity>
            </View>

            {/* 출발지와 목적지에 관한 모달 */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={choice_styles.modalView}>
                <FlatList
                  data={locations.filter(
                    (item) =>
                      (changingLocationType === "departure" &&
                        item !== selectedDestination) ||
                      (changingLocationType === "destination" &&
                        item !== selectedDeparture),
                  )}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={choice_styles.item}
                      onPress={() => handleLocationSelect(item)}
                    >
                      <Text style={choice_styles.itemText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => (
                    <View style={choice_styles.separator} />
                  )}
                />
              </View>
            </Modal>
          </View>

          {/* 두번째 열 */}
          <View>
            {/* 출발 시간 */}
            <Text style={date_styles.infoTitle}>출발 시간</Text>
            <View style={date_styles.dateTimeRow}>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={date_styles.dateTimeButton}
              >
                <Text style={date_styles.dateText}>
                  {date.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                style={date_styles.dateTimeButton}
              >
                <Text style={date_styles.dateText}>
                  {date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={date}
              mode="time"
              display="default"
              minuteInterval={5}
              onChange={handleTimeChange}
            />
          )}

          {/* 세번째 열 */}
          {/* 경로 정보 표시 */}
          {distance && duration && (
            <View
              style={{
                flexDirection: "row",
                padding: 10,
                backgroundColor: "#F1E7FC",
                gap: 10,
              }}
            >
              <Text>거리: {distance.toFixed(2)} km</Text>
              <Text>소요 시간: {duration.toFixed(2)} 분</Text>
            </View>
          )}
        </View>

        {/* 버튼 */}
        <View style={styles.buttonContainer}>
          {/* 방 탐색 버튼 */}
          <Link
            href={{
              pathname: "/RoomList",
              params: {
                selectedDeparture,
                selectedDestination,
                date: date.toISOString(),
              },
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>방 탐색</Text>
          </Link>

          {/* 방장 하기 버튼 */}
          <Link
            href={{
              pathname: "/RoomMake",
              params: {
                selectedDeparture,
                selectedDestination,
                date: date.toISOString(),
              },
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>방장 하기</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // 맨 위 타이틀, 버튼
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    // 맨 아래로 정렬
    justifyContent: "flex-end",
  },
  interface: {
    padding: "5%",
    gap: 20,
  },
  buttonContainer: {
    height: 50,
    flexDirection: "row",
    gap: 20,
  },
  button: {
    flex: 1,
    backgroundColor: "#7963F4",
    borderRadius: 8,
    textAlign: "center",
    textAlignVertical: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: width * 0.045,
  },
});

const map_styles = StyleSheet.create({
  // 지도화면, 소요시간 글씨
  mapInfoBox: {
    // 절대 위치로 지정해서 지도가 배경으로 나타나게 함
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "75%",
    zIndex: -1,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

const main_styles = StyleSheet.create({
  //출발지 도착지
  infoBox: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    gap: 10,
  },
  locationSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
    marginBottom: 10,
  },
  locationLabel: {
    textAlign: "center",
    fontSize: width * 0.037,
    color: "#888",
  },

  locationSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginBottom: "8%",
    width: "120%",
  },
  routeContainer: {
    width: width * 0.3, // 고정된 너비로 박스가 항상 일정하게 유지
    alignItems: "center",
  },
  routeText: {
    textAlign: "center",
    fontSize: width * 0.06,
    color: "#6B59CC",
    fontWeight: "bold",
  },
  arrow: {
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#6B59CC",
  },
});

const choice_styles = StyleSheet.create({
  //출발지 도착지 선택 항목
  modalView: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: "10%",
    paddingHorizontal: "10%",
    alignItems: "stretch",
  },
  item: {
    backgroundColor: "white",
    padding: "5%",
    marginVertical: "1.5%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  separator: {
    height: 1,
  },
});

const date_styles = StyleSheet.create({
  // 날짜, 시간
  infoTitle: {
    fontSize: width * 0.037,
    fontWeight: "bold",
    color: "#888",
  },
  dateTimeRow: {
    flexDirection: "row",
    gap: 20,
  },
  dateTimeButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
  },
  dateText: {
    fontSize: width * 0.06,
    color: "#6B59CC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
