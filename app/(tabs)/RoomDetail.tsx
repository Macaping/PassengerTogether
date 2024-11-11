import useUserDataManagement from '@/hooks/userDataManagement';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function RoomDetailView() {
  const { room, fetchRoomDetails } = useUserDataManagement();

  useFocusEffect(
    useCallback(() => {
      fetchRoomDetails();
    }, [])
  );

  if (!room) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredMessageContainer}>
          <Text style={styles.centeredMessageText}>현재 참여한 방이 없습니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.allContainer}>
        <View style={styles.headerContainer}>
        <Text style={styles.header}>나의 티켓</Text>
        </View>
      
      <View style={styles.ticketContainer}>
        <View style={styles.ticketHeader}>
          <Text style={styles.ticketId}>{room.created_at.slice(-10, -6)}</Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>출발 날짜: {new Date(room.departure_time).toLocaleDateString()}</Text>
          <Text style={styles.time}>출발 시간: {new Date(room.departure_time).toLocaleTimeString()}</Text>
        </View>
        <View style={styles.routeContainer}>
          <View style={styles.stationContainer}>
            <Text style={styles.stationTitle}>출발</Text>
            <Text style={styles.station}>{room.origin}</Text>
          </View>
          <View style={styles.stationContainer}>
            <Text style={styles.stationTitle}>도착</Text>
            <Text style={styles.station}>{room.destination}</Text>
          </View>
        </View>
        <Text style={styles.passengerCount}>
          인원수: {room.users.length}/{room.limit_people}
        </Text>

        <View style={styles.detailsContainer}>
          <Text style={styles.detailsLabel}></Text>
          <View style={styles.detailsBox}>
            <Text style={styles.detailsText}>{room.details}</Text>
          </View>
        </View>

        {/* 점선 구간 */}
        <View style={styles.separatorContainer}>
          <View style={styles.dottedLine} />
          <View style={styles.leftCircle} />
          <View style={styles.rightCircle} />
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.completeButton}>
            <Text style={styles.completeButtonText}>도착 완료</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.passengerButton}>
            <Text style={styles.passengerButtonText}>동승자</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exitButton}>
            <Text style={styles.exitButtonText}>나가기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  allContainer:{
    flex:1,
    backgroundColor:"#6049E2",
    alignItems:'center'
  },
  headerContainer: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header:{
    fontSize:20,
    color:'#ffffff'
  },
  centeredMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredMessageText: {
    fontSize: width * 0.05,
    color: '#333',
    textAlign: 'center',
  },
  ticketContainer: {
    width: width * 0.92,
    height: height * 0.8,
    padding: width * 0.05,
    borderRadius: width * 0.05,
    backgroundColor: '#fff',
    position: 'relative',
  },
  ticketHeader: {
    backgroundColor: '#EAE5FE',
    borderTopLeftRadius: width * 0.05,
    borderTopRightRadius: width * 0.05,
    paddingVertical: height * 0.02,
    alignItems: 'flex-start',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  ticketId: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginLeft: width * 0.025,
    color: '#333',
  },
  timeContainer: {
    alignItems: 'center',
    marginTop: height * 0.1,
    marginBottom: height * 0.05,
  },
  time: {
    fontSize: width * 0.05,
    color: '#555',
    textAlign: 'center',
  },
  routeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
  },
  stationContainer: {
    flex: 1,
    alignItems: 'center',
  },
  stationTitle: {
    fontSize: width * 0.06,
    color: '#777',
    marginBottom: height * 0.01,
  },
  station: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#333',
  },
  passengerCount: {
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  detailsLabel: {
    fontSize: width * 0.035,
    marginBottom: height * 0.015,
    color: '#777',
  },
  detailsBox: {
    height: height * 0.12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: width * 0.02,
    backgroundColor: '#f9f9f9',
    padding: width * 0.03,
  },
  detailsText: {
    fontSize: width * 0.04,
    color: '#333',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.02,
  },
  completeButton: {
    flex: 2,
    paddingVertical: height * 0.015,
    backgroundColor: '#5cb85c',
    borderRadius: width * 0.02,
    alignItems: 'center',
    marginRight: width * 0.015,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
  },
  passengerButton: {
    flex: 1,
    paddingVertical: height * 0.015,
    backgroundColor: '#337ab7',
    borderRadius: width * 0.02,
    alignItems: 'center',
    marginHorizontal: width * 0.015,
  },
  passengerButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
  },
  exitButton: {
    flex: 1,
    paddingVertical: height * 0.015,
    backgroundColor: '#d9534f',
    borderRadius: width * 0.02,
    alignItems: 'center',
    marginLeft: width * 0.015,
  },
  exitButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: height * 0.02,
    marginTop: height * 0.1,
  },
  dottedLine: {
    flex: 1,
    borderBottomWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#C3C3C3',
  },
  leftCircle: {
    position: 'absolute',
    left: -width * 0.1,
    width: width * 0.1,
    height: width * 0.1,
    backgroundColor: '#e0f0ff',
    borderRadius: width * 0.05,
  },
  rightCircle: {
    position: 'absolute',
    right: -width * 0.1,
    width: width * 0.1,
    height: width * 0.1,
    backgroundColor: '#e0f0ff',
    borderRadius: width * 0.05,
  },
});
