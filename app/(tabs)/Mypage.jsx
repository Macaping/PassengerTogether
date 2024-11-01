import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'; 

export default function MyPage() {
    const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>내 정보</Text>
      </View>
      
      <View style={styles.profileCard}>
        <Ionicons 
          name="person-circle-outline" 
          size={180} 
          color="#6C4AB6" 
          style={{
            marginTop: 10,      // 위쪽 여백
            marginBottom: 10,   // 아래쪽 여백
            marginLeft: 20,     // 왼쪽 여백
            marginRight: 20,    // 오른쪽 여백
            position: 'absolute', // 위치 조정을 위해 'absolute' 사용
            top: 80,            // 상단 위치 조정
            left: 50,            // 왼쪽 위치 조정
            right: 0,           // 오른쪽 위치 조정
            bottom: 0           // 하단 위치 조정
          }}
        />
        
        <Text style={styles.userName}>하라마라탕</Text>
        <Text style={styles.userEmail}>haram@gmail.com</Text>
        
        <View style={styles.followContainer}>
          <View style={styles.followBox}>
            <Text style={styles.followLabel}>팔로워</Text>
            <Text style={styles.followCount}>32</Text>
          </View>
          <View style={styles.followBox}>
            <Text style={styles.followLabel}>팔로잉</Text>
            <Text style={styles.followCount}>32</Text>
          </View>
        </View>
      </View>


 {/* 로그아웃 버튼 클릭 시 LoginView로 이동 */}
      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={() => navigation.navigate('LoginView')}
      >
        <Text style={styles.logoutButtonText}>로그아웃</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#6C4AB6',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileCard: { //하라마라탕 박스
    width: '90%',
    marginTop: 50, //하라마라탕 박스위치 조절
    padding: 20,
    paddingVertical: 180, //박스 세로 크기 하단 조절
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6C4AB6',
    position: 'relative', // 내부 요소의 절대 위치 설정 가능하도록 relative 설정
    height: 500, // 프로필 카드의 전체 높이 지정
  },

  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    position: 'absolute',
    top: 265, // 상하위치
    textAlign: 'center',
  },
  userEmail: { 
    fontSize: 23,
    color: 'gray',
    position: 'absolute',
    top: 299, // 상하위치
    textAlign: 'center',
  },
  followContainer: { //팔로잉,팔로우
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    position: 'absolute',
    bottom: 45, // 상하위치
  },
  followBox: {
    alignItems: 'center',
  },
  followLabel: { //팔로워*팔로잉 사이즈  크기
    fontSize: 15,
    color: 'gray',
  },
  followCount: { //팔로워*팔로잉 숫자크기
    fontSize: 25,
    fontWeight: 'bold',
  },
  logoutButton: { //로그아웃 버튼
    position: 'absolute', // 화면에서 절대 위치 지정
    bottom: 40, //로그아웃 버튼 상하위치 조정
    width: '90%', //버튼 가로넓이
    paddingVertical: 25, //버튼 세로넓이
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#888888',
    fontSize: 17,
    fontWeight: 'bold',
  },


});
