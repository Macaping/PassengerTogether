import { InformationBox } from "@/components/home/InformationBox";
import { MapWidget } from "@/components/home/MapWidget";
import { 방_탐색 } from "@/components/home/방_탐색";
import { 방장_하기 } from "@/components/home/방장_하기";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import MapView from "react-native-maps";

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

  const [route, setRoute] = useState<{ latitude: number; longitude: number }[]>(
    [],
  );
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

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
      <MapWidget
        coordinates={coordinates}
        selectedDeparture={selectedDeparture}
        selectedDestination={selectedDestination}
        route={route}
        mapRef={mapRef}
      />

      <View style={styles.interface}>
        {/* 상호작용 UI */}
        <InformationBox
          selectedDeparture={selectedDeparture}
          selectedDestination={selectedDestination}
          date={date}
          showDatePicker={showDatePicker}
          showTimePicker={showTimePicker}
          modalVisible={modalVisible}
          changingLocationType={changingLocationType}
          locations={locations}
          distance={distance}
          duration={duration}
          openLocationModal={openLocationModal}
          setModalVisible={setModalVisible}
          handleDateChange={handleDateChange}
          handleTimeChange={handleTimeChange}
          handleLocationSelect={handleLocationSelect}
        />

        {/* 버튼 */}
        <View style={styles.buttonContainer}>
          <방_탐색
            departure={selectedDeparture}
            destination={selectedDestination}
            date={date}
          />
          <방장_하기
            departure={selectedDeparture}
            destination={selectedDestination}
            date={date}
          />
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
