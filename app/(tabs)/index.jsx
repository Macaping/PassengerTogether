import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import { Link } from 'expo-router';
import React, { default as React, default as React, useEffect, useRef, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { StatusBar } from 'react-native-web';

const HomeView = () => {
  const locations = ['천안역', '천안아산역', '선문대', '탕정역', '두정동 롯데'];
  const coordinates = {
    '천안역': { latitude: 36.8089885, longitude: 127.148933 },
    '천안아산역': { latitude: 36.7946071, longitude: 127.1045608 },
    '선문대': { latitude: 36.7989764, longitude: 127.0750025 },
    '탕정역': { latitude: 36.78827, longitude: 127.084638 },
    '두정동 롯데': { latitude: 36.8261834, longitude: 127.1399744 },
  };


  const [selectedDeparture, setSelectedDeparture] = useState(locations[0]);
  const [selectedDestination, setSelectedDestination] = useState(locations[1]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [changingLocationType, setChangingLocationType] = useState('departure');

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [route, setRoute] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('위치 권한이 거부되었습니다.');
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      if (currentLocation && currentLocation.coords) {
        setLocation(currentLocation.coords);
      } else {
        setErrorMsg('위치를 가져오는 데 실패했습니다.');
      }
    })();
  }, []);

  useEffect(() => {
    fetchRouteData();
  }, [selectedDeparture, selectedDestination]);

  const fetchRouteData = async () => {
    const departureCoord = coordinates[selectedDeparture];
    const destinationCoord = coordinates[selectedDestination];

    const MAP_KEY = process.env.EXPO_PUBLIC_MAP_KEY || '';  //길찾기 api 키 가져옴
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${MAP_KEY}&start=${departureCoord.longitude},${departureCoord.latitude}&end=${destinationCoord.longitude},${destinationCoord.latitude}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const geometry = data.features[0].geometry.coordinates;
      const polylineCoords = geometry.map(coord => ({ latitude: coord[1], longitude: coord[0] }));
      setRoute(polylineCoords);

      const summary = data.features[0].properties.summary;
      setDistance(summary.distance / 1000); // distance in km
      setDuration(summary.duration / 60); // duration in minutes
    } catch (error) {
      console.error('Error fetching route data:', error);
    }
  };

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

  const mapRef = useRef(null);

  const handleLocationSelect = (location) => {
    if (changingLocationType === 'departure') {
      setSelectedDeparture(location);
    } else {
      setSelectedDestination(location);
    }
    setModalVisible(false);

    const selectedCoordinates = coordinates[location];
    mapRef.current?.animateToRegion(
      {
        latitude: selectedCoordinates.latitude,
        longitude: selectedCoordinates.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000 // 애니메이션 지속 시간 (1초)
    );


  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerText}>조회</Text>
      </View>

      {/* 지도 상자 */}
      <View style={styles.mapInfoBox}>
        {location ? (
          <MapView
            ref={mapRef} // 지도 참조 추가
            style={styles.map}
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
          <View style={styles.loadingContainer}>
            <Text>위치를 불러오는 중...</Text>
            {errorMsg ? <Text>{errorMsg}</Text> : null}
          </View>
        )}
      </View>

      {/* 출발지 및 도착지 선택 상자 */}
      <View style={styles.infoBox}>
        <View style={styles.locationSection}>
          <Text style={styles.locationLabel}>출발</Text>
          <Text style={styles.locationLabel}>도착</Text>
        </View>
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
              data={locations.filter(
                item => (changingLocationType === 'departure' && item !== selectedDestination) ||
                  (changingLocationType === 'destination' && item !== selectedDeparture)
              )}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.item} onPress={() => handleLocationSelect(item)}>
                  <Text style={styles.itemText}>{item}</Text>
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

        {/* 경로 정보 표시 */}
        {distance && duration && (
          <View style={styles.routeInfo}>
            <Text>거리: {distance.toFixed(2)} km</Text>
            <Text>소요 시간: {duration.toFixed(2)} 분</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Link href="/RoomList" style={styles.button}>
          <Text style={styles.buttonText}>방 탐색</Text>
        </Link>

        <Link
          href={{
            pathname: '/RoomMake',
            params: { selectedDeparture, selectedDestination, date: date.toISOString() },
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
  mapInfoBox: {
    height: 300, // 지도 높이 조정
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
    //  margin: 16,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  infoBox: {
    backgroundColor: '#FFFFFF',
    padding: 50,
    margin: 20,
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
    marginBottom: 20,
  },
  locationLabel: {
    fontSize: 15,
    color: '#888',
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 35,
    paddingHorizontal: 20,
    alignItems: 'stretch',
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
  },
  infoTitle: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#888',
  },
  dateTimeRow: {
    flexDirection: 'row',
    //  justifyContent: 'space-between',
    justifyContent: 'center',
    width: '80%',
    marginTop: 15,
  },
  dateTimeButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    marginHorizontal: 10,

  },
  dateText: {
    fontSize: 25,
    color: '#6B59CC',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    //  marginTop: 16,
    //  marginHorizontal: 16,
  },
  button: {
    backgroundColor: '#A99CE3',
    paddingVertical: 20, //버튼 크기
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '40%',
    alignItems: 'center',
    paddingLeft: 40,

  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,

  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeView;
