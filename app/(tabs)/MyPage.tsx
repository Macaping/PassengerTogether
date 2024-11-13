import { signOutUser } from '@/utils/auth.utils';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

export default function MyPage() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>마이 페이지</Text>
            </View>

            <View style={styles.profileCard}>
                <Ionicons
                    name="person-circle-outline"
                    size={Dimensions.get('window').width * 0.5} // 이미지 크기 조정
                    color="#6C4AB6"
                    style={styles.icon}
                   
                />

                <Text style={styles.userName}>하마마라탕</Text>
                <Text style={styles.userEmail}>haram@gmail.com</Text>

                {/*밑에 아이콘 세개 크기*/}
                <View style={styles.iconContainer}> 
                    <TouchableOpacity style={styles.profileIcon}>
                        <Ionicons name="mail-outline" size={60} color="#6C4AB6" />
                        <Text>메세지함</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.profileIcon}>
                        <Ionicons name="person-add-outline" size={30} color="#6C4AB6" />
                        <Text>친구추가</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.profileIcon}>
                        <Ionicons name="people-outline" size={30} color="#6C4AB6" />
                        <Text>친구목록</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={signOutUser}
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
        paddingVertical: 10,
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

    
    profileCard: { //프로필 상자 상하위치
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#6C4AB6',
        bottom: -10,
    },
    icon: { //프로필아이콘 위치
        bottom: -140,
    },
    userName: {
        fontSize: 23,
        fontWeight: 'bold',
        marginVertical: 5,
        bottom: -120,
    },
    userEmail: {
        fontSize: 21,
        color: 'gray',
        textAlign: 'center',
        bottom: '6%',
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        bottom: '-15%',
    },
    profileIcon: {
        alignItems: 'center',
        bottom: -60,
    },
    logoutButton: {
        position: 'absolute',
        bottom: 700,
        width: '90%',
        paddingVertical: 15,
        backgroundColor: '#E0E0E0',
        alignItems: 'center',
        borderRadius: 5,
    },
    logoutButtonText: {
        color: '#888888',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        width: '100%',
        height: 60,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#EDE7F6',
        position: 'absolute',
        bottom: 0,
    },
    footerButton: {
        alignItems: 'center',
    },
    footerText: {
        fontSize: 20,
        color: '#6C4AB6',
    },
});
