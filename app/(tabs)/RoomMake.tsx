import { createRoom } from '@/hooks/createRoom';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const RoomMake = () => {
  const { selectedDeparture = '기본 출발지', selectedDestination = '기본 도착지', date = new Date().toISOString() } = useLocalSearchParams();

  const [departure, setDeparture] = useState(selectedDeparture);
  const [destination, setDestination] = useState(selectedDestination);
  const [selectedDate, setSelectedDate] = useState(new Date(date));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [changingLocationType, setChangingLocationType] = useState('departure');
  const [details, setDetails] = useState('');
  const [numPassengers, setNumPassengers] = useState(0); // 동승자 인원 추가
  const locations = ['천안역', '천안아산역', '선문대', '탕정역'];

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(new Date(selectedDate));
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(selectedDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setSelectedDate(newDate);
    }
  };

  const openLocationModal = (type) => {
    setChangingLocationType(type);
    setModalVisible(true);
  };

  const handleLocationSelect = (location) => {
    if (changingLocationType === 'departure') {
      setDeparture(location);
    } else {
      setDestination(location);
    }
    setModalVisible(false);
  };

  const incrementPassengers = () => {
    if (numPassengers < 3) {
      setNumPassengers(numPassengers + 1);
    }
  };

  const decrementPassengers = () => {
    if (numPassengers > 0) {
      setNumPassengers(numPassengers - 1);
    }
  };

  const handleCreateRoom = async () => {
    await createRoom({
      departure_time: selectedDate.toISOString(),
      origin: departure,
      destination: destination,
      limit_people: numPassengers,
      users: [],
      details: details,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>방 만들기</Text>
      </View>

      <View style={styles.infoBox}>
        {/* 출발지와 도착지 선택 */}
        <View style={styles.locationSection}>
          <Text style={styles.locationLabel}>출발</Text>
          <Text style={styles.locationLabel}>도착</Text>
        </View>

        <View style={styles.locationSelectorRow}>
          <TouchableOpacity style={styles.locationButton} onPress={() => openLocationModal('departure')}>
            <Text style={styles.routeText}>{departure}</Text>
          </TouchableOpacity>
          <Text style={styles.arrow}>→</Text>
          <TouchableOpacity style={styles.locationButton} onPress={() => openLocationModal('destination')}>
            <Text style={styles.routeText}>{destination}</Text>
          </TouchableOpacity>
        </View>

        {/* 출발지 및 도착지 선택 모달 */}
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalView}>
            <FlatList
              data={locations}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.item} onPress={() => handleLocationSelect(item)}>
                  <Text style={styles.itemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>

        {/* 날짜와 시간 선택 */}
        <Text style={styles.infoTitle}>출발 시간</Text>
        <View style={styles.dateTimeRow}>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateTimeButton}>
            <Text style={styles.dateText}>{selectedDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.dateTimeButton}>
            <Text style={styles.dateText}>{selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker value={selectedDate} mode="date" display="default" onChange={handleDateChange} />
        )}
        {showTimePicker && (
          <DateTimePicker value={selectedDate} mode="time" display="default" minuteInterval={5} onChange={handleTimeChange} />
        )}

        {/* 동승자 인원 선택 */}
        <Text style={styles.infoTitle}>동승자</Text>
        <View style={styles.passengerContainer}>
          <TouchableOpacity onPress={decrementPassengers} disabled={numPassengers === 0} style={styles.passengerButton}>
            <Text style={styles.passengerButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.passengerText}>{numPassengers}명</Text>
          <TouchableOpacity onPress={incrementPassengers} disabled={numPassengers === 3} style={styles.passengerButton}>
            <Text style={styles.passengerButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* 세부사항 입력 */}
        <Text style={styles.infoTitle}>세부사항</Text>
        <TextInput
          style={styles.textInput}
          placeholder="만남 장소와 옷차림을 기입해주세요"
          multiline
          value={details}
          onChangeText={setDetails}
        />
      </View>

      {/* 방 만들기 버튼 */}
      <TouchableOpacity style={styles.submitButton} onPress={handleCreateRoom}>
        <Text style={styles.submitButtonText}>방만들기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#6B59CC',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    margin: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
  },
  locationSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  locationLabel: {
    fontSize: 15,
    color: '#888',
  },
  locationSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // 중앙 정렬
    marginBottom: 100,
  },
  routeText: {
    fontSize: 30,
    color: '#6B59CC',
    fontWeight: 'bold',
  },
  arrow: {
    fontSize: 30,
    color: '#6B59CC',
    marginHorizontal: 8,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  item: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 8,
  },
  dateTimeButton: {
    backgroundColor: '#FFFFFF',
    //padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    // flex: 1,
    marginHorizontal: 5,
  },
  dateText: {
    fontSize: 25,
    color: '#6B59CC',
  },
  infoTitle: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  passengerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  passengerButton: {
    backgroundColor: '#A99CE3',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  passengerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  passengerText: {
    fontSize: 16,
    color: '#6B59CC',
  },
  textInput: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#A99CE3',
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default RoomMake;
