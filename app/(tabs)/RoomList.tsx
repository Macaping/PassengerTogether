import useLoadRooms from '@/hooks/useLoadRooms';
import { useFocusEffect } from 'expo-router';
import React, { useCallback , useState } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    FlatList, 
    ActivityIndicator,
    Modal,
    TouchableOpacity,
    TextInput,
    Platform,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
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
        top: '0%',
        left: '15.6%',
        height: '100%',
    }
});
type Room = {
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

const Item = ({ created_at, departure_time, limit_people, users, status,onPress  }: { created_at: string, departure_time: Date, limit_people: number, users: string[], status: string,onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} style={itemStyles.container}>
        {/* 출발 시각 00:00으로 표현 */}
        <Text style={itemStyles.시각}>
            {new Date(departure_time).getHours().toString().padStart(2, '0')}:
            {new Date(departure_time).getMinutes().toString().padStart(2, '0')}</Text>
        {/* 방 번호 */}
        <Text style={itemStyles.방_번호}>{"방 번호: "}{created_at.slice(-10, -6)}</Text>
        {/* 현재인원/최대인원 */}
        <Text style={itemStyles.현재인원_최대인원}>{users ? users.length : '0'}/{limit_people}</Text>
        {/* <Text style={itemStyles.현재인원_최대인원}>방 상태: {status}</Text> */}
    </TouchableOpacity>
);

const itemStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 0.5,
        borderColor: '#A594F9',
        borderRadius: 8,
        padding: 16,
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
    },
});

export default function RoomList() {
    const { rooms, loading, error } = useLoadRooms();
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const handleRoomPress = (room) => {
        setSelectedRoom(room);
        setModalVisible(true);
    };

    const handleJoinRoom = () => {
        // TODO: Implement join room logic here
        setModalVisible(false);
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
        // Todo: 디자인 검토 필요
        <SafeAreaView style={styles.container}>
            {/* Header 컴포넌트를 사용하여 화면 상단에 제목과 부제목을 표시합니다. */}
            <Header origin="Everywhere" destination="Everywhere" />
            {/* FlatList 컴포넌트를 사용하여 방 목록을 표시합니다. */}
            <View style={styles.container}>
                <View style={listStyles.columnCrossline} />
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
            <RoomDetailModal
                visible={modalVisible}
                room={selectedRoom}
                onClose={() => setModalVisible(false)}
                onJoin={handleJoinRoom}
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
