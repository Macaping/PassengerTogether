import { useRoomList } from "@/hooks/useRoomList";
import { Database } from "@/lib/supabase_type";
import { JoinRoom } from "@/services/join_room";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { height } = Dimensions.get("window");

function Header({
  origin,
  destination,
  date: date,
}: {
  origin: string;
  destination: string;
  date: Date;
}) {
  // 날짜 포맷을 변경합니다.
  date = new Date(date);
  const formattedDate = date.toLocaleTimeString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  return (
    <View style={headerStyles.headerContainer}>
      <Text style={headerStyles.date}>{formattedDate}</Text>
      <View style={headerStyles.routeContainer}>
        <Text style={headerStyles.locationName}>{origin}</Text>
        <Ionicons
          name="arrow-forward"
          size={24}
          color="#ffffff"
          style={headerStyles.arrowIcon}
        />
        <Text style={headerStyles.locationName}>{destination}</Text>
      </View>
    </View>
  );
}

const headerStyles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    backgroundColor: "#6049E2",
    height: height * 0.2,
  },
  date: {
    width: "80%",
    color: "#ffffff",
    fontSize: 20,
    paddingTop: height * 0.03,
  },

  routeContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "center",
    // paddingTop: '2%',
    width: "90%",
    // paddingBottom: '5%'
  },
  locationName: {
    fontSize: 30,
    color: "#ffffff",
    fontWeight: "600",
    alignItems: "center",

    width: "40%",
    textAlign: "center",
  },
  arrowIcon: {
    marginHorizontal: 10, // 화살표와 텍스트 사이 간격
    alignSelf: "center",
    top: "1.5%",
  },
  headerContainerWithModal: {
    alignItems: "center",
    backgroundColor: "#6049E2",
    height: "22%",
    zIndex: 1, // 모달 오버레이 아래에 위치하도록 설정
  },
});

type Room = Database["public"]["Tables"]["rooms"]["Row"];

type RoomDetailModalProps = {
  visible: boolean;
  room: Room | null;
  onClose: () => void;
  onJoin: () => void;
};

const RoomDetailModal = ({
  visible,
  room,
  onClose,
  onJoin,
}: RoomDetailModalProps) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!room) return null;

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="none"
    >
      <View style={modalStyles.container}>
        <Animated.View
          style={[
            modalStyles.backdrop,
            {
              opacity: fadeAnim,
              transform: [{ translateY: height * 0.2 }], // Header height
            },
          ]}
        >
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={modalStyles.backdropTouchable} />
          </TouchableWithoutFeedback>
        </Animated.View>

        <Animated.View
          style={[
            modalStyles.modalContent,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={modalStyles.handleBar} />
          <Text style={modalStyles.modalName}>
            🏠 {room.created_at.slice(-10, -6)}
          </Text>

          {/* 출발 시각과 인원을 한 줄로 배치 */}
          <View style={modalStyles.headerSection}>
            <Text style={modalStyles.modalTime}>
              <Text style={modalStyles.labelText}>출발 시각: </Text>
              <Text style={modalStyles.timeText}>
                {new Date(room.departure_time)
                  .getHours()
                  .toString()
                  .padStart(2, "0")}
                :
                {new Date(room.departure_time)
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}
              </Text>
            </Text>
            <Text style={modalStyles.modalMembers}>
              <Text style={modalStyles.labelText}>인원: </Text>
              <Text style={modalStyles.timeText}>
                {room.users ? room.users.length : 0}/{room.limit_people}
              </Text>
            </Text>
          </View>

          <View style={modalStyles.divider} />

          <View style={modalStyles.messageContainer}>
            <Text style={modalStyles.detailText}>만남의 장소</Text>
            <Text style={modalStyles.messageText}>{room.details}</Text>
          </View>
          <View style={modalStyles.messageContainer}>
            <Text style={modalStyles.detailText}> 자신의 옷차림</Text>
            <TextInput
              style={modalStyles.inputField}
              placeholder="서로를 알아볼 수 있도록 자세히 입력해주세요."
              value={userInput}
              onChangeText={setUserInput}
            />
          </View>

          <TouchableOpacity
            style={modalStyles.joinButton}
            onPress={onJoin}
            activeOpacity={0.8}
          >
            <Text style={modalStyles.joinButtonText}>참가 하기</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdropTouchable: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 25,
    height: height * 0.45,
    width: "100%",
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  modalName: {
    fontSize: 20,
    fontWeight: "600",
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "5%",
    marginTop: "3%",
  },
  modalTime: {
    fontSize: 20,
    color: "#000000",
  },
  modalMembers: {
    fontSize: 20,
    color: "#000000",
  },
  labelText: {
    fontSize: 20,
    fontWeight: "400", // 얇은 글꼴
    color: "#000000",
  },
  timeText: {
    fontWeight: "600", // 굵은 글꼴
    color: "#000000",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: "5%",
  },
  messageContainer: {},
  detailText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#000000",
  },
  messageText: {
    fontSize: 18,
    color: "#666666",
    lineHeight: 20,
  },
  joinButton: {
    backgroundColor: "#6049E2",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 20,
  },
  inputField: {
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16, // 참가하기 버튼과 간격 조정
    fontSize: 16,
    color: "#333333",
  },
  joinButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

const Item = ({
  created_at,
  departure_time,
  limit_people,
  users,
  status,
  onPress,
}: {
  created_at: string;
  departure_time: Date;
  limit_people: number;
  users: string[];
  status: string;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={itemStyles.container}
    activeOpacity={1}
  >
    {/* 출발 시각 00:00으로 표현 */}
    <View style={itemStyles.header}></View>
    <Text style={itemStyles.시각}>
      {new Date(departure_time).getHours().toString().padStart(2, "0")}:
      {new Date(departure_time).getMinutes().toString().padStart(2, "0")}
    </Text>
    {/* 방 번호 */}
    <Text style={itemStyles.방_번호}>{created_at.slice(-10, -6)}</Text>
    {/* 현재인원/최대인원 */}
    <Text style={itemStyles.현재인원_최대인원}>
      {users ? users.length : "0"}/{limit_people}
    </Text>
    {/* <Text style={itemStyles.현재인원_최대인원}>방 상태: {status}</Text> */}
  </TouchableOpacity>
);

const itemStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#A594F9",
    borderRadius: 8,
    padding: 20,
    top: "-4%",
  },
  header: {
    backgroundColor: "#A594F9",
    position: "absolute",
    top: 0,
    bottom: 0, // 추가
    left: 0,
    width: "2%",
    borderTopLeftRadius: 8, // borderRadius 값을 container와 맞춤
    borderBottomLeftRadius: 8, // 하단 왼쪽도 둥글게 처리
  },

  시각: {
    color: "#6049E2",
    fontSize: 20,
    fontWeight: "bold",
  },
  방_번호: {
    width: "50%",
    textAlign: "left",
    color: "#000000",
    fontSize: 20,
    fontWeight: "500",
  },
  현재인원_최대인원: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "600",
    right: "20%",
    top: "3%",
  },
});

export default function RoomListView() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // href에서 넘겨준 파라미터를 가져옵니다.
  const {
    departure = "출발지",
    destination = "도착지",
    date = new Date(),
  } = useLocalSearchParams() as unknown as {
    departure: string;
    destination: string;
    date: Date;
  };

  // 출발지, 도착지, 기준 시간을 파라미터로 실시간으로 방 목록을 조회합니다.
  const { loading, roomList } = useRoomList({ departure, destination, date });

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // 방이 없을 경우
  if (!roomList) {
    return (
      <View style={styles.container}>
        <Text>
          방 목록을 조회할 조건이 없습니다. 방 탐색 버튼을 통해 이동해주세요.
        </Text>
      </View>
    );
  }

  // 방이 있는 경우

  const handleRoomPress = (room: Room) => {
    setSelectedRoom(room);
    setModalVisible(true);
  };

  const handleJoinRoom = (room: Room) => {
    if (!room) return;
    JoinRoom(room.id)
      .then(() => {
        router.replace("/(tabs)/RoomDetail");
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setModalVisible(false);
      });
  };

  return (
    <View style={styles.container}>
      {/* Header 컴포넌트를 사용하여 화면 상단에 제목과 부제목을 표시합니다. */}
      <Header origin={departure} destination={destination} date={date} />
      {/* FlatList 컴포넌트를 사용하여 방 목록을 표시합니다. */}
      <View style={listStyles.indexContainer}>
        <Text style={listStyles.indexText}>출발 시각</Text>
        <Text style={listStyles.indexText}>방 내용</Text>
        <Text style={listStyles.indexText}>인원수</Text>

        <RoomDetailModal
          visible={modalVisible}
          room={selectedRoom}
          onClose={() => setModalVisible(false)}
          // 선택된 방이 있고 참가 버튼을 누르면 참가합니다.
          onJoin={() => selectedRoom && handleJoinRoom(selectedRoom)}
        />
      </View>
      <View style={styles.container}>
        <View style={listStyles.columnCrossline} />
        <View style={listStyles.Container}>
          <FlatList
            data={roomList}
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
                departure_time={
                  item.departure_time
                    ? new Date(item.departure_time)
                    : new Date()
                }
                limit_people={item.limit_people ?? 0}
                users={item.users ?? []}
                status={item.status}
                onPress={() => handleRoomPress(item)}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
});
const listStyles = StyleSheet.create({
  Container: {
    flex: 1,
  },

  indexContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: "1%",
    // borderBottomWidth: 1,
    paddingBottom: "1%",
  },
  indexText: {
    color: "#747474",
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
    top: "1%",
    left: "17%",
    height: "100%",
  },
});
