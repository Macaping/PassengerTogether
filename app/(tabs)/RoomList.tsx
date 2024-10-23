import useLoadRooms from '@/hooks/useLoadRooms';
import { useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Header = ({ origin, destination }: { origin: string, destination: string }) => (
    <View style={headerStyles.headerContainer}>
        <Text style={headerStyles.title}>방 리스트</Text>
        <Text style={headerStyles.locationName}>{origin}  {'->'}  {destination}</Text>
    </View>
);

const headerStyles = StyleSheet.create({
    headerContainer: {
        alignItems: 'center',
        backgroundColor: '#6049E2',
        padding: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: '#ffffff',
        bottom: 20,
    },
    locationName: {
        fontSize: 24,
        color: '#ffffff',
        fontWeight: '900',
    },
});

const listStyles = StyleSheet.create({
    listContainer: {
        flexGrow: 1,
        padding: 16,
    },
    separator: {
        height: 16,
    },
    columnCrossline: {
        position: "absolute",
        borderLeftWidth: 3,
        borderLeftColor: "#A594F9",
        top: '0%',
        left: '12.5%',
        height: '100%',
    }
});

const Item = ({ created_at, departure_time, limit_people, users, status }: { created_at: string, departure_time: Date, limit_people: number, users: string[], status: string }) => (
    <View style={itemStyles.container}>
        {/* 출발 시각 00:00으로 표현 */}
        <Text style={itemStyles.시각}>{new Date(departure_time).getHours().toString().padStart(2, '0')}:{new Date(departure_time).getMinutes().toString().padStart(2, '0')}</Text>
        {/* 방 번호 */}
        <Text style={itemStyles.방_번호}>{"방 번호: "}{created_at.slice(-10, -6)}</Text>
        {/* 현재인원/최대인원 */}
        <Text style={itemStyles.현재인원_최대인원}>{users ? users.length : '0'}/{limit_people}</Text>
        {/* <Text style={itemStyles.현재인원_최대인원}>방 상태: {status}</Text> */}
    </View>
);

const itemStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#A594F9',
        borderRadius: 8,
        padding: 16,
    },
    시각: {
        color: '#6049E2',
        fontSize: 16,
        fontWeight: 'bold',
    },
    방_번호: {
        flex: 1,
        textAlign: 'left',
        color: '#000000',
        fontSize: 16,
        marginLeft: 16,
    },
    현재인원_최대인원: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default function RoomList() {
    const { rooms, loading, error } = useLoadRooms();

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text>Error: {error}</Text>
            </View>
        );
    }

    return (
        // Todo: 디자인 검토 필요
        <SafeAreaView style={styles.container}>
            {/* Header 컴포넌트를 사용하여 화면 상단에 제목과 부제목을 표시합니다. */}
            <Header origin="Everywhere" destination="Everywhere" />
            {/* FlatList 컴포넌트를 사용하여 방 목록을 표시합니다. */}
            <View style={styles.container}>
                <View style={listStyles.columnCrossline} />
                <FlatList
                    data={rooms}
                    style={listStyles.listContainer}
                    ItemSeparatorComponent={() => <View style={listStyles.separator} />}
                    renderItem={({ item }) => (
                        // Item 컴포넌트에 전달할 props를 정의합니다.
                        <Item
                            created_at={item.created_at}
                            departure_time={item.departure_time}
                            limit_people={item.limit_people}
                            users={item.users}
                            status={item.status}
                        />
                    )}
                    keyExtractor={item => item.id}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
});
