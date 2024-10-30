import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // 수정된 임포트
import DateTimePicker from '@react-native-community/datetimepicker';
import { StatusBar } from 'react-native-web';

const HomeView = ({ navigation }) => {
  const locations = ['천안역', '천안아산역', '선문대', '탕정역']; // 미리 정의된 장소들
  const [selectedDeparture, setSelectedDeparture] = useState(locations[0]);
  const [selectedDestination, setSelectedDestination] = useState(locations[1]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false); // 시간 선택 상태 추가
  const [numPeople, setNumPeople] = useState(1);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
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


  const showDateTimePicker = () => {
    setShowDatePicker(true);
  };

    // 시간 선택용 TimePicker 열기
    const showTimePickerModal = () => {
      setShowTimePicker(true);
    };

  const incrementPeople = () => {
    if (numPeople < 4) {
      setNumPeople(numPeople + 1);
    }
  };

  const decrementPeople = () => {
    if (numPeople > 1) {
      setNumPeople(numPeople - 1);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light"/>
      <View style={styles.header}>
        <Text style={styles.headerText}>가나다</Text>
      </View>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>출발</Text>
        <Picker
          selectedValue={selectedDeparture}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedDeparture(itemValue)}
        >
          {locations.map((location) => (
            <Picker.Item key={location} label={location} value={location} style={styles.pickerItem} />
          ))}
        </Picker>

        <Text style={styles.infoTitle}>도착</Text>
        <Picker
          selectedValue={selectedDestination}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedDestination(itemValue)}
        >
          {locations.map((location) => (
            <Picker.Item key={location} label={location} value={location} style={styles.pickerItem} />
          ))}
        </Picker>

        <Text style={styles.infoTitle}>출발 날짜</Text>
        <TouchableOpacity onPress={showDateTimePicker} style={styles.dateButton}>
          <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <Text style={styles.infoTitle}>출발 시간</Text>
        <TouchableOpacity onPress={showTimePickerModal} style={styles.dateButton}>
          <Text style={styles.dateText}>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </TouchableOpacity>

        {showTimePicker && (
          <DateTimePicker
            value={date}
            mode="time"
            display="default"
            minuteInterval={5} // 5분 간격으로 시간 설정
            onChange={handleTimeChange}
          />
        )}

        <Text style={styles.infoTitle}>인원 선택</Text>
        <View style={styles.peopleContainer}>
          <TouchableOpacity onPress={decrementPeople} disabled={numPeople === 1} style={styles.peopleButton}>
            <Text style={styles.peopleButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.peopleText}>{numPeople}명</Text>
          <TouchableOpacity onPress={incrementPeople} disabled={numPeople === 4} style={styles.peopleButton}>
            <Text style={styles.peopleButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>조회</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>방만들기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E8F8',
  },
  header: {
    backgroundColor: '#6B59CC',
    padding: 16,
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
    margin: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  pickerItem: {
    color: '#000', // 선택된 텍스트 색상을 검정색으로 설정
    fontSize: 16,   // 필요에 따라 폰트 크기 조정
  },
  timePickerContainer: {
    flexDirection: 'row',  // 시/분 선택을 위한 컨테이너 추가
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dateButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginTop: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
  peopleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  peopleButton: {
    backgroundColor: '#A99CE3',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  peopleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  peopleText: {
    fontSize: 16,
    color: '#000',
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
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default HomeView;
