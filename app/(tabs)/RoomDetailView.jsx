import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');  // 화면 크기 가져오기

const RoomDetailView = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.ticketContainer}>
        <View style={styles.ticketHeader}>
          <Text style={styles.ticketId}>123131654</Text>
        </View>
        <Text style={styles.time}>출발 시간: 09월 30일 (월) 23:00</Text>
        <View style={styles.routeContainer}>
          <View style={styles.stationContainer}>
            <Text style={styles.stationTitle}>출발</Text>
            <Text style={styles.station}>천안역</Text>
          </View>
          <View style={styles.stationContainer}>
            <Text style={styles.stationTitle}>도착</Text>
            <Text style={styles.station}>천안아산역</Text>
          </View>
        </View>

        <Text style={styles.passengerCount}>인원수: 3/4</Text>


        <View style={styles.detailsContainer}>
          <Text style={styles.detailsLabel}>세부사항</Text>
          <View style={styles.detailsBox} />
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0f0ff',
  },
  ticketContainer: {
    width: width * 0.75,   // 화면 너비의 75%로 축소
    height: height * 0.7,  // 화면 높이의 70%로 축소
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    position: 'relative',  // 상위 컨테이너에 상대적인 위치 설정
  },
  ticketHeader: {
    backgroundColor: '#f8d7da',
    borderTopLeftRadius: 10,  // 상단 왼쪽 모서리 둥글게
    borderTopRightRadius: 10, // 상단 오른쪽 모서리 둥글게
    paddingVertical: height * 0.01,  // 높이 조정
    alignItems: 'center',
    position: 'absolute',  // 절대 위치
    top: 0,  // 상단에 붙도록 설정
    left: 0,  // 좌측 끝에 붙도록 설정
    right: 0,  // 우측 끝에 붙도록 설정
    borderBottomWidth: 1,  // 아래쪽에만 테두리 추가
    borderColor: '#ddd',  // 테두리 색상
  },
  ticketId: {
    fontSize: width * 0.05,  // 화면 너비에 따른 텍스트 크기 조정
    fontWeight: 'bold',
    color: '#333',
  },
  time: {
    height: '10%',
    fontSize: width * 0.05,  // 화면 너비에 따른 텍스트 크기 조정
    marginTop: '30%',
    marginBottom: height * 0.05,  // 여백 비율 조정
    color: '#555',
    textAlign: 'center',
  },
  routeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.015,  // 여백 비율 조정
  },
  stationContainer: {
    flex: 1,
    alignItems: 'center',
  },
  stationTitle: {
    fontSize: width * 0.06,  // 화면 너비에 따른 텍스트 크기 조정
    color: '#777',
    marginBottom: height * 0.008,  // 여백 비율 조정
  },
  station: {
    fontSize: width * 0.06,  // 화면 너비에 따른 텍스트 크기 조정
    fontWeight: 'bold',
    color: '#333',
  },
  passengerCount: {
    fontSize: width * 0.035,  // 화면 너비에 따른 텍스트 크기 조정
    marginBottom: height * 0.03,  // 여백 비율 조정
    color: '#333',
    textAlign: 'right',
  },
  detailsContainer: {
    marginBottom: height * 0.03,  // 여백 비율 조정
  },
  detailsLabel: {
    fontSize: width * 0.035,  // 화면 너비에 따른 텍스트 크기 조정
    marginBottom: height * 0.015,  // 여백 비율 조정
    color: '#777',
  },
  detailsBox: {
    height: height * 0.12,  // 화면 높이에 따른 높이 조정
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.015,  // 여백 비율 조정
  },
  completeButton: {
    flex: 2,
    paddingVertical: height * 0.012,  // 화면 높이에 따른 패딩 감소
    backgroundColor: '#5cb85c',
    borderRadius: 5,
    alignItems: 'center',
    marginRight: width * 0.015,  // 버튼 간의 간격 조정
  },
  completeButtonText: {
    color: '#fff',
    fontSize: width * 0.04,  // 화면 너비에 따른 텍스트 크기 조정
  },
  passengerButton: {
    flex: 1,
    paddingVertical: height * 0.012,  // 화면 높이에 따른 패딩 감소
    backgroundColor: '#337ab7',
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: width * 0.015,  // 버튼 간의 간격 조정
  },
  passengerButtonText: {
    color: '#fff',
    fontSize: width * 0.04,  // 화면 너비에 따른 텍스트 크기 조정
  },
  exitButton: {
    flex: 1,
    paddingVertical: height * 0.012,  // 화면 높이에 따른 패딩 감소
    backgroundColor: '#d9534f',
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: width * 0.015,  // 버튼 간의 간격 조정
  },
  exitButtonText: {
    color: '#fff',
    fontSize: width * 0.04,  // 화면 너비에 따른 텍스트 크기 조정
  },

  // 점선과 동그라미 스타일 수정
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: height * 0.02,  // 여백 비율 조정
  },
  dottedLine: {
    flex: 1,
    borderBottomWidth: 2,
    borderStyle: 'dotted',
    borderColor: '#777',
    zIndex: 1,  // 동그라미 뒤로 보내기
  },
  leftCircle: {
    position: 'absolute',
    left: -45,  // 동그라미 위치 조정
    width: 45,
    height: 45,
    backgroundColor: '#e0f0ff',
    borderRadius: 25,  // 반원 형태
    zIndex: 2,  // 점선 위로 오게 하기
  },
  rightCircle: {
    position: 'absolute',
    right: -45,  // 동그라미 위치 조정
    width: 45,
    height: 45,
    backgroundColor: '#e0f0ff',
    borderRadius: 25,  // 반원 형태
    zIndex: 2,  // 점선 위로 오게 하기
  },
});

export default RoomDetailView;