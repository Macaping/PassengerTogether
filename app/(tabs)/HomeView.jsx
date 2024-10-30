import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { Link } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

const HomeView = () => {
  const locations = ['천안역', '천안아산역', '선문대', '탕정역'];
  const [selectedDeparture, setSelectedDeparture] = useState(locations[0]);
  const [selectedDestination, setSelectedDestination] = useState(locations[1]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [changingLocationType, setChangingLocationType] = useState('departure');

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(date);
      newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      setDate(newDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDate(newDate);
    }
  };

  const openLocationModal = (type) => {
    setChangingLocationType(type);
    setModalVisible(true);
  };

  const handleLocationSelect = (location) => {
    if (changingLocationType === 'departure') {
      setSelectedDeparture(location);
    } else {
      setSelectedDestination(location);
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>조회</Text>
      </View>

      <View style={styles.infoBox}>
        <View style={styles.locationSection}>
          <Text style={styles.locationLabel}>출발</Text>
          <Text style={styles.locationLabel}>도착</Text>
        </View>

        {/* 출발지와 도착지를 한 줄에 표시하면서 각각 선택 가능하게 설정 */}
        <View style={styles.locationSelector}>
          <TouchableOpacity onPress={() => openLocationModal('departure')}>
            <Text style={styles.routeText}>{selectedDeparture}</Text>
          </TouchableOpacity>
          <Text style={styles.arrow}> → </Text>
          <TouchableOpacity onPress={() => openLocationModal('destination')}>
            <Text style={styles.routeText}>{selectedDestination}</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <FlatList
              data={locations}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.item} onPress={() => handleLocationSelect(item)}>
                  <Text style={styles.itemText}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </Modal>

        <Text style={styles.infoTitle}>출발 시간</Text>
        <View style={styles.dateTimeRow}>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateTimeButton}>
            <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.dateTimeButton}>
            <Text style={styles.dateText}>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>
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
      </View>

      <View style={styles.buttonContainer}>
        <Link href="/RoomList" style={styles.button}>
          <Text style={styles.buttonText}>방 탐색</Text>
        </Link>

        <Link
          href={{
            pathname: '/RoomMake',
            params: { selectedDeparture, selectedDestination, date: date.toISOString() }
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>방장 하기</Text>
        </Link>
      </View>
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
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginHorizontal: 20,
    marginVertical: 80,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 35,
    paddingHorizontal: 20,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  item: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 15,
  },
  dateTimeButton: {
    backgroundColor: '#FFFFFF',
  //  padding: 10,
    borderRadius: 5,
   // flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 25,
    color: '#6B59CC',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    marginHorizontal: 16,
  },
  button: {
    backgroundColor: '#A99CE3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '40%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default HomeView;
