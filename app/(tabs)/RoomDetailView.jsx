import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useUserDataManagement from '../../hooks/userDataManagement';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width, height } = Dimensions.get('window');
import { StatusBar } from 'react-native-web';
import { Ionicons } from '@expo/vector-icons';

const RoomDetailView = () => {
  const { room, fetchRoomDetails } = useUserDataManagement();

  useEffect(() => {
    fetchRoomDetails();
  }, []);

  if (!room) {
    return <Text>로딩 중...</Text>;
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
        <Text style={styles.timeLabel}>출발 시각</Text>
            <Text style={styles.timeValue}>
              {`${new Date(room.departure_time).getMonth() + 1}월 ${new Date(room.departure_time).getDate()}일 (${['일','월','화','수','목','금','토'][new Date(room.departure_time).getDay()]}) ${String(new Date(room.departure_time).getHours()).padStart(2, '0')}:${String(new Date(room.departure_time).getMinutes()).padStart(2, '0')}`}
            </Text>

        </View>
        <View style={styles.routeSection}>
            <View style={styles.routeItem}>
              <Text style={styles.routeLabel}>출발</Text>
              <Text style={styles.routeValue}>{room.origin}</Text>
            </View>
            <View style={styles.routeItem}>
              <Text style={styles.routeLabel}>도착</Text>
              <Text style={styles.routeValue}>{room.destination}</Text>
            </View>
          </View>

          <View style={styles.passengerSection}>
            <Text style={styles.passengerCount}>인원수 {room.users ? room.users.length : 0}/{room.limit_people}</Text>
          </View>

          <View style={styles.detailsSection}>
            <Text style={styles.detailsText}>{room.details}</Text>
          </View>

        {/* 점선 구간 */}
        <View style={styles.separatorContainer}>
          <View style={styles.dottedLine} />
          <View style={styles.leftCircle} />
          <View style={styles.rightCircle} />
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="chatbubbles-outline" size={24} color="#666666" />
              <Text style={styles.iconButtonText}>채팅</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="people-outline" size={24} color="#666666" />
              <Text style={styles.iconButtonText}>동승자</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="exit-outline" size={24} color="#666666" />
              <Text style={styles.iconButtonText}>나가기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

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
    height: 80,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header:{
    paddingTop: '2%',
    fontSize:20,
    color:'#ffffff',
    
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
    marginTop: height * 0.07,
  },
  timeLabel: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  timeValue: {
    fontSize: 20,
    color: '#000000',
  },
  routeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  routeItem: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  routeValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
  },

  passengerSection: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  passengerCount: {
    fontSize: 16,
    color: '#000000',
  },
  detailsSection: {
    padding: 65,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    marginHorizontal: 20,
    backgroundColor: '#FAFAFA',
  },
  detailsText: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },

  
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  iconButton: {
    alignItems: 'center',
  },
  iconButtonText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666666',
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
    backgroundColor: '#6049E2',
    borderRadius: width * 0.05,
  },
  rightCircle: {
    position: 'absolute',
    right: -width * 0.1,
    width: width * 0.1,
    height: width * 0.1,
    backgroundColor: '#6049E2',
    borderRadius: width * 0.05,
  },
});

export default RoomDetailView;
