import { createRoom } from '@/hooks/createRoom';
import useJoinRoom from '@/hooks/useJoinRoom';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Dimensions } from 'react-native'; //Dimensions API를 이용해 화면의 너비나 높이에 따라 fontSize를 설정

const { width, height } = Dimensions.get('window'); //Dimensions 이용


export default function RoomMakeView() {
  const { selectedDeparture = '기본 출발지', selectedDestination = '기본 도착지', date } = useLocalSearchParams();

  // date가 배열이면 첫 번째 요소를 가져오고, 그렇지 않으면 date 그대로 사용
  const initialDate = Array.isArray(date) ? new Date(date[0]) : new Date(date || new Date());

  const [departure, setDeparture] = useState(selectedDeparture);
  const [destination, setDestination] = useState(selectedDestination);
  //  const [selectedDate, setSelectedDate] = useState(new Date(date));
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [changingLocationType, setChangingLocationType] = useState('departure');
  const [details, setDetails] = useState('');
  const [numPassengers, setNumPassengers] = useState(0); // 동승자 인원 추가
  const locations = ['천안역', '천안아산역', '선문대', '탕정역', '두정동 롯데'];

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(new Date(selectedDate));
    }
  };

  const handleTimeChange = (event: any, selectedTime: Date | undefined) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(selectedDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setSelectedDate(newDate);
    }
  };

  const openLocationModal = (type: 'departure' | 'destination') => {
    setChangingLocationType(type);
    setModalVisible(true);
  };

  const handleLocationSelect = (location: string) => {
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
    // 방 생성
    const roomData = await createRoom({
      departure_time: selectedDate.toISOString(),
      origin: departure as string,
      destination: destination as string,
      limit_people: numPassengers,
      users: [],
      details: details,
    });
    // 방 생성한 사람이 방에 참가
    await useJoinRoom(roomData.id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>방 만들기</Text>
      </View>

      <View style={main_styles.infoBox}>
        {/* 출발지와 도착지 선택 */}
        <View style={main_styles.locationSection}>
          <Text style={main_styles.locationLabel}>출발</Text>
          <Text style={main_styles.locationLabel}>도착</Text>
        </View>
        

        <View style={main_styles.locationSelectorRow}>
          <TouchableOpacity style={main_styles.routeContainer} onPress={() => openLocationModal('departure')}>
            <Text style={main_styles.routeText}>{departure}</Text>
          </TouchableOpacity>

          <Text style={main_styles.arrow}>→</Text>

          <TouchableOpacity style={main_styles.routeContainer} onPress={() => openLocationModal('destination')}>
            <Text style={main_styles.routeText}>{destination}</Text>
          </TouchableOpacity>
        </View>


        {/* 출발지 및 도착지 선택 모달 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={choice_styles.modalView}>
            <FlatList
              data={locations.filter(
                item => (changingLocationType === 'departure' && item !== destination) ||
                        (changingLocationType === 'destination' && item !== departure)
              )}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={choice_styles.item} onPress={() => handleLocationSelect(item)}>
                  <Text style={choice_styles.itemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>


        {/* 날짜와 시간 선택 */}
        <Text style={passenger_styles.infoTitle}>출발 시간</Text>
        <View style={date_styles.dateTimeRow}>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={date_styles.dateTimeButton}>
            <Text style={date_styles.dateText}>{selectedDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowTimePicker(true)} style={date_styles.dateTimeButton}>
            <Text style={date_styles.dateText}>{selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker value={selectedDate} mode="date" display="default" onChange={handleDateChange} />
        )}
        {showTimePicker && (
          <DateTimePicker value={selectedDate} mode="time" display="default" minuteInterval={5} onChange={handleTimeChange} />
        )}

        {/* 동승자 인원 선택 */}
        <Text style={passenger_styles.infoTitle}>동승자</Text>
        <View style={passenger_styles.passengerContainer}>
          <TouchableOpacity onPress={decrementPassengers} disabled={numPassengers === 0} style={passenger_styles.passengerButton}>
            <Text style={passenger_styles.passengerButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={passenger_styles.passengerText}>{numPassengers}명</Text>
          <TouchableOpacity onPress={incrementPassengers} disabled={numPassengers === 3} style={passenger_styles.passengerButton}>
            <Text style={passenger_styles.passengerButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* 세부사항 입력 */}
        <Text style={passenger_styles.infoTitle}>세부사항</Text>
        <TextInput
          style={passenger_styles.textInput}
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
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#6B59CC',
    paddingVertical: '4.5%' ,
    alignItems: 'center',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#A99CE3',
    paddingVertical: '5%',
    borderRadius: 10,
    marginHorizontal: '5%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.04,
  },
});

const main_styles = StyleSheet.create({
  infoBox: {
    backgroundColor: '#FFFFFF',
    padding: '18%', 
    margin: '5%', 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
  },
  locationSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    marginBottom: '15%',
  },
  locationLabel: {
    fontSize: width * 0.037,
    color: '#888',
  },
  locationSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    //justifyContent: 'center', // 중앙 정렬
    justifyContent: 'space-evenly',
    width: '140%',
    marginBottom: '40%',
  },
  routeContainer: {
    width: width * 0.35,
    alignItems: 'center',
    //paddingVertical: '3%',
    //borderColor: '#6B59CC',
    //borderWidth: 1,
    //borderRadius: 8,
  },
  routeText: {  
    fontSize: width * 0.073,
    color: '#6B59CC',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  arrow: {
    fontSize: width * 0.07,
    color: '#6B59CC',
    marginHorizontal: '6%',
  },
});

const choice_styles = StyleSheet.create({
  modalView: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: '10%',
    paddingHorizontal: '10%',
    alignItems: 'stretch',
  },
  item: {
    backgroundColor: 'white',
    padding: '5%',
    marginVertical: '1.5%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {},
});

const date_styles = StyleSheet.create({
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '80%',
    marginTop: '6%',
  },
  dateTimeButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    marginHorizontal: '4.5%',
  },
  dateText: {
    fontSize: width * 0.063,
    color: '#6B59CC',
  },
});

const passenger_styles = StyleSheet.create({
  infoTitle: {
    marginTop: '5%',
    fontSize: width * 0.037,
    fontWeight: 'bold',
    color: '#888',
  },
  passengerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '6%',
  },
  passengerButton: {
    backgroundColor: '#A99CE3',
    padding: '5%',
    borderRadius: 5,
    marginHorizontal: '7%',
  },
  passengerButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.04,
  },
  passengerText: {
    fontSize: width * 0.04,
    color: '#6B59CC',
  },
  textInput: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: '5%',
    marginTop: '5%',
    fontSize: width * 0.038,
  },
});
