import useJoinRoom from '@/hooks/useJoinRoom';
import useLoadRooms from '@/hooks/useLoadRooms';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from 'react-native-vector-icons';

const { width, height } = Dimensions.get('window');



const Header = ({ origin, destination }: { origin: string, destination: string }) => (
    <View style={headerStyles.headerContainer}>
        <Text style={headerStyles.title}>방 리스트</Text>
        <Text style={headerStyles.date}>10월 30일(월)</Text>
        <View style={headerStyles.routeContainer}>
            <Text style={headerStyles.locationName}>{origin}</Text>
            <Ionicons name="arrow-forward" size={24} color="#ffffff" style={headerStyles.arrowIcon} />
            <Text style={headerStyles.locationName}>{destination}</Text>
        </View>
    </View>
);

const headerStyles = StyleSheet.create({
    headerContainer: {
        alignItems: 'center',
        backgroundColor: '#6049E2',
        height: '22%'
    },
    title: {
        paddingTop: '1%',
        fontSize: 20,
        color: '#ffffff',
    },
    date: {
        color: '#ffffff',
        fontSize: 20,
        paddingTop: '5%'
    },

    routeContainer: {
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'center',
        paddingTop: '2%',
        width: '90%',
        paddingBottom: '5%'

    },
    locationName: {
        fontSize: 30,
        color: '#ffffff',
        fontWeight: '600',
        alignItems: 'center',

        width: '40%',
        textAlign: 'center'

    },
    arrowIcon: {
        marginHorizontal: 10, // 화살표와 텍스트 사이 간격
        alignSelf: 'center',
        top: '1.5%'

    },
});


type Room = {
    id: string;
    created_at: string;
    departure_time: Date;
    limit_people: number;
    users: string[];
    status: string;
};

type RoomDetailModalProps = {
    visible: boolean;
    room: Room | null;
    onClose: () => void;
    onJoin: () => void;
};

const RoomDetailModal = ({ visible, room, onClose, onJoin }: RoomDetailModalProps) => {

    if (!room) return null;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={modalStyles.centeredView}
                >
                    <View style={modalStyles.modalContent}>
                        <View style={modalStyles.handleBar} />

                        <View style={modalStyles.headerSection}>
                            <Text style={modalStyles.modalTime}>
                                출발 시각: {new Date(room.departure_time).getHours().toString().padStart(2, '0')}:
                                {new Date(room.departure_time).getMinutes().toString().padStart(2, '0')}
                            </Text>
                            <Text style={modalStyles.modalMembers}>
                                인원: {room.users ? room.users.length : 0}/{room.limit_people}
                            </Text>
                        </View>

                        <View style={modalStyles.divider} />

                        <View style={modalStyles.messageContainer}>
                            <Text style={modalStyles.detailText}>상세사항</Text>
                            <Text style={modalStyles.messageText}>
                                아무거나 내용 입력..
                            </Text>
                        </View>

                        <View style={modalStyles.inputContainer}>
                            <Text style={modalStyles.inputLabel}>나의 옷차림</Text>
                            <TextInput
                                style={modalStyles.input}
                                placeholder="서로를 알아볼 수 있도록 자세히 입력해주세요."
                                multiline={true}
                                numberOfLines={3}
                                placeholderTextColor="#999"
                            />
                        </View>

                        <TouchableOpacity
                            style={modalStyles.joinButton}
                            onPress={onJoin}
                            activeOpacity={0.8}
                        >
                            <Text style={modalStyles.joinButtonText}>참가 하기</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const modalStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        height: '80%',
    },
    handleBar: {
        width: 40,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 20,
    },
    headerSection: {
        marginBottom: 20,
    },
    modalTime: {
        fontSize: 20,
        color: '#6049E2',
        fontWeight: '600',
        marginBottom: 8,
    },
    modalMembers: {
        fontSize: 16,
        color: '#000000',
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 20,
    },
    messageContainer: {
        marginBottom: 24,
    },
    detailText: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: '#000000',
    },
    messageText: {
        fontSize: 14,
        color: '#666666',
        lineHeight: 20,
    },
    inputContainer: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: '#000000',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        padding: 16,
        height: 120,
        textAlignVertical: 'top',
        fontSize: 14,
        backgroundColor: '#FFFFFF',
    },
    joinButton: {
        backgroundColor: '#6049E2',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 'auto',
    },
    joinButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

const Item = ({ created_at, departure_time, limit_people, users, status, onPress }: { created_at: string, departure_time: Date, limit_people: number, users: string[], status: string, onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} style={itemStyles.container}>
        {/* 출발 시각 00:00으로 표현 */}
        <View style={itemStyles.header}>
        </View>
        <Text style={itemStyles.시각}>
            {new Date(departure_time).getHours().toString().padStart(2, '0')}:
            {new Date(departure_time).getMinutes().toString().padStart(2, '0')}</Text>
        {/* 방 번호 */}
        <Text style={itemStyles.방_번호}>{created_at.slice(-10, -6)}</Text>
        {/* 현재인원/최대인원 */}
        <Text style={itemStyles.현재인원_최대인원}>{users ? users.length : '0'}/{limit_people}</Text>
        {/* <Text style={itemStyles.현재인원_최대인원}>방 상태: {status}</Text> */}
    </TouchableOpacity>
);

const itemStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        borderWidth: 0.5,
        borderColor: '#A594F9',
        borderRadius: 8,
        padding: 20,
        top: '-4%'
    },
    header: {
        backgroundColor: '#A594F9',
        position: 'absolute',
        top: 0,
        bottom: 0,  // 추가
        left: 0,
        width: '3%',
        borderTopLeftRadius: 8,  // borderRadius 값을 container와 맞춤
        borderBottomLeftRadius: 8,  // 하단 왼쪽도 둥글게 처리
    },

    시각: {
        color: '#6049E2',
        fontSize: 20,
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
        top: 13,
        left: 5
    },
});

export default function RoomList() {
    const { rooms, loading, error } = useLoadRooms();
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const { selectedDeparture = '출발지', selectedDestination = '도착지', date = new Date().toISOString() } = useLocalSearchParams();


    const handleRoomPress = (room) => {
        setSelectedRoom(room);
        setModalVisible(true);
    };

    const handleJoinRoom = (room) => {
        if (!room) return
        useJoinRoom(room.id);
        setModalVisible(false);
        router.replace('/RoomDetailView');
    };



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
        <SafeAreaView style={styles.container}>
            {/* Header 컴포넌트를 사용하여 화면 상단에 제목과 부제목을 표시합니다. */}
            <Header origin={selectedDeparture} destination={selectedDestination} />
            {/* FlatList 컴포넌트를 사용하여 방 목록을 표시합니다. */}
            <View style={styles.container}>
                <View style={listStyles.columnCrossline} />

                <View style={listStyles.indexContainer}>
                    <Text style={listStyles.indexText}>출발 시각</Text>
                    <Text style={listStyles.indexText}>방 내용</Text>
                    <Text style={listStyles.indexText}>인원수</Text>

                </View>
                <View style={listStyles.Container}>

                    <FlatList
                        data={rooms}
                        // 컴포넌트 자체의 스타일을 정의합니다.
                        style={listStyles.listContainer}
                        // 아이템들을 구분할 구분선을 정의합니다.
                        ItemSeparatorComponent={() => <View style={listStyles.separator} />}
                        // 내용물 컨테이너의 스타일을 정의합니다.
                        contentContainerStyle={listStyles.contentContainer}
                        renderItem={({ item }) => (
                            // Item 컴포넌트에 전달할 props를 정의합니다.
                            <Item
                                created_at={item.created_at}
                                departure_time={item.departure_time}
                                limit_people={item.limit_people}
                                users={item.users}
                                status={item.status}
                                onPress={() => handleRoomPress(item)}
                            />
                        )}
                        keyExtractor={item => item.id}
                    />
                </View>
            </View>
            <RoomDetailModal
                visible={modalVisible}
                room={selectedRoom}
                onClose={() => setModalVisible(false)}
                onJoin={() => handleJoinRoom(selectedRoom)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
});
const listStyles = StyleSheet.create({
    Container: {
        flex: 1,

    },

    indexContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: '1%',
        // borderBottomWidth: 1, 
        paddingBottom: '1%',

    },
    indexText: {
        color: "#747474"
    },
    listContainer: {
        flexGrow: 1,


    },
    contentContainer: {
        padding: 16,

    },
    separator: {
        height: 16,
    },
    columnCrossline: {
        position: "absolute",
        borderLeftWidth: 2,
        borderLeftColor: "#6049E2",
        top: '5.6%',
        left: '15.6%',
        height: '100%',

    }
});
