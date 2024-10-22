import useLoadRooms from '@/hooks/useLoadRooms';
import React from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, ScrollView } from 'react-native';

const Item = ({ id, created_at, departure_time, origin, destination, limit_people, users, status }) => (
    <View style={styles.item}>
        <Text style={styles.time}>방 번호: {id}</Text>
        <Text style={styles.details}>방 생성 날짜: {new Date(created_at).toLocaleString()}</Text>
        <Text style={styles.details}>출발시간: {new Date(departure_time).toLocaleString()}</Text>
        <Text style={styles.details}>출발지: {origin}</Text>
        <Text style={styles.details}>목적지: {destination}</Text>
        <Text style={styles.details}>인원수 제한: {limit_people}</Text>
        <Text style={styles.details}>이용자 목록: {users ? users.join(', ') : '없음'}</Text>
        <Text style={styles.details}>방 상태: {status}</Text>
    </View>
);

export default function App() {
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
                <Text>Error: {error.message}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>방 리스트</Text>
                <Text style={styles.subHeader}>천안아산역 → 선문대본관</Text>
            </View>
            <FlatList
                data={rooms}
                renderItem={({ item }) => (
                    <Item
                        id={item.id}
                        created_at={item.created_at}
                        departure_time={item.departure_time}
                        origin={item.origin}
                        destination={item.destination}
                        limit_people={item.limit_people}
                        users={item.users}
                        status={item.status}
                    />
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    headerContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subHeader: {
        fontSize: 16,
        color: '#666',
    },
    listContainer: {
        flexGrow: 1,
    },
    item: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    time: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    details: {
        fontSize: 14,
        color: '#666',
    },
});
