import { InformationBox } from "@/components/home/InformationBox";
import { MapWidget } from "@/components/home/MapWidget";
import { 방_탐색 } from "@/components/home/방_탐색";
import { 방장_하기 } from "@/components/home/방장_하기";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { LatLng } from "react-native-maps";

const coordinates: { [key: string]: LatLng } = {
  천안역: { latitude: 36.8089885, longitude: 127.148933 },
  천안아산역: { latitude: 36.7946071, longitude: 127.1045608 },
  선문대: { latitude: 36.7989764, longitude: 127.0750025 },
  탕정역: { latitude: 36.78827, longitude: 127.084638 },
  "두정동 롯데": { latitude: 36.8261834, longitude: 127.1399744 },
};
const locations = ["천안역", "천안아산역", "선문대", "탕정역", "두정동 롯데"];

export default function HomeView() {
  // 출발지, 도착지
  const [departure, setDeparture] = useState<LatLng>(coordinates["천안역"]);
  const [destination, setDestination] = useState<LatLng>(
    coordinates["천안아산역"],
  );
  const [selectedDeparture, setSelectedDeparture] = useState<string>("천안역");
  const [selectedDestination, setSelectedDestination] =
    useState<string>("천안아산역");
  useEffect(() => {
    if (selectedDeparture) {
      setDeparture(coordinates[selectedDeparture]);
    }
    if (selectedDestination) {
      setDestination(coordinates[selectedDestination]);
    }
  }, [selectedDeparture, selectedDestination]);

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [changingLocationType, setChangingLocationType] = useState("departure");

  // 경로 정보
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

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

  const handleLocationSelect = (location: string) => {
    if (changingLocationType === "departure") {
      setSelectedDeparture(location);
      setDeparture(coordinates[location]);
    } else {
      setSelectedDestination(location);
      setDestination(coordinates[location]);
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.map}>
        <MapWidget
          departure={departure}
          destination={destination}
          setDistance={setDistance}
          setDuration={setDuration}
        />
      </View>

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
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "75%",
    zIndex: 0,
    borderWidth: 1,
    borderColor: "#ccc",
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
});
