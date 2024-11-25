import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function 장소선택({
  departure,
  setDeparture,
  destination,
  setDestination,
  locations,
}: {
  departure: string;
  setDeparture: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  locations: string[];
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [changingType, setChangingType] = useState<"departure" | "destination">(
    "departure",
  );

  return (
    <View>
      {/* 출발지/도착지 UI */}
      <View style={styles.row}>
        <Text style={styles.label}>출발</Text>
        <Text style={styles.label}>도착</Text>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.box}
          onPress={() => {
            setChangingType("departure");
            setModalVisible(true);
          }}
        >
          <Text style={styles.text}>{departure}</Text>
        </TouchableOpacity>
        <Text style={styles.arrow}>→</Text>
        <TouchableOpacity
          style={styles.box}
          onPress={() => {
            setChangingType("destination");
            setModalVisible(true);
          }}
        >
          <Text style={styles.text}>{destination}</Text>
        </TouchableOpacity>
      </View>

      {/* 모달창 */}
      <Modal visible={modalVisible} transparent>
        <View style={styles.modal}>
          <FlatList
            data={locations.filter(
              (loc) =>
                (changingType === "departure" && loc !== destination) ||
                (changingType === "destination" && loc !== departure),
            )}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  if (changingType === "departure") setDeparture(item);
                  else setDestination(item);
                  setModalVisible(false);
                }}
                style={styles.modalItem}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  label: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },
  box: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  text: {
    fontSize: 18,
    color: "#6B59CC",
  },
  arrow: {
    fontSize: 20,
    color: "#6B59CC",
    marginHorizontal: 5,
  },
  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: "center",
  },
});
