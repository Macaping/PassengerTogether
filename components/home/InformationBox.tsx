import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window"); //Dimensions 이용

interface InformationBoxProps {
  selectedDeparture: string;
  setSelectedDeparture: (location: string) => void;
  selectedDestination: string;
  setSelectedDestination: (location: string) => void;
  date: Date;
  setDate: (date: Date) => void;
  locations: string[];
  distance: number | null;
  duration: number | null;
}

/**
 * InformationBox 컴포넌트
 *
 * 사용자가 출발지, 도착지, 출발 날짜 및 시간을 선택할 수 있도록 하는 UI를 제공합니다.
 * 또한 선택된 경로의 거리와 소요 시간을 표시합니다.
 */
export function InformationBox({
  selectedDeparture,
  setSelectedDeparture,
  selectedDestination,
  setSelectedDestination,
  date,
  setDate,
  locations,
  distance,
  duration,
}: InformationBoxProps): React.JSX.Element {
  // 모달에서 변경하려는 위치의 타입
  const [changingLocationType, setChangingLocationType] = useState("departure");

  // 모달의 표시 여부
  const [modalVisible, setModalVisible] = useState(false);

  // 날짜 및 시간 선택 모달의 표시 여부
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // 위치 선택
  const handleLocationSelect = (location: string) => {
    if (changingLocationType === "departure") {
      setSelectedDeparture(location);
    } else {
      setSelectedDestination(location);
    }
    setModalVisible(false);
  };

  // 날짜를 변경할 때
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

  // 시간을 변경할 때
  const handleTimeChange = (
    _event: DateTimePickerEvent,
    selectedTime?: Date,
  ) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const currentDate = new Date();
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());

      // 검증: 현재 시간보다 이전인지 확인
      if (newDate < currentDate) {
        alert("현재 시간보다 이전의 시간은 선택할 수 없습니다.");
        return;
      }

      setDate(newDate);
    }
  };

  // 현재 시간을 기준으로 제한 설정
  const currentDate = new Date();

  // 위치 선택 모달 열기
  const openLocationModal = (type: "departure" | "destination") => {
    setChangingLocationType(type);
    setModalVisible(true);
  };

  // 상호작용 UI
  return (
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
          <TouchableOpacity onPress={() => openLocationModal("destination")}>
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

      {/* 날짜 모달이 활성화 되었을 때 */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={currentDate} // 현재 날짜보다 이전 선택 불가
        />
      )}

      {/* 시간 모달이 활성화 되었을 때 */}
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
  );
}

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
  itemText: {
    fontSize: width * 0.05,
    color: "#000",
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
