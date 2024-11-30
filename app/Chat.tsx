import useChat from "@/hooks/useChat";
import { useUser } from "@/hooks/useUser";
import React from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * ChatView 컴포넌트
 *
 * - 채팅 기능을 제공하는 화면입니다.
 * - 사용자는 메시지를 전송하거나 다른 사용자의 메시지를 확인할 수 있습니다.
 * - 참여 중인 방이 없을 경우 안내 메시지를 표시합니다.
 *
 * 주요 기능:
 * 1. `useChat` 훅을 사용하여 채팅 데이터 및 메시지 전송 로직 처리.
 * 2. `useUser` 훅을 사용해 현재 사용자의 정보를 확인.
 * 3. 메시지를 본인과 상대방의 구분에 따라 스타일링하여 표시.
 * 4. 참여 중인 방이 없는 경우 안내 메시지 표시.
 *
 * @returns {React.ReactElement} 채팅 화면 UI.
 */
export default function ChatView() {
  const {
    messages, // 메시지 목록
    newMessage, // 새 메시지 입력 값
    noRoomMessage, // 방 참여 여부 확인
    setNewMessage, // 새 메시지 입력 상태 업데이트
    handleSendMessage, // 메시지 전송 함수
  } = useChat();

  const { user } = useUser(); // 현재 사용자 정보 가져오기

  if (!user) {
    // user가 없으면 로딩 화면 표시
    return (
      <View style={styles.container}>
        <Text>사용자 정보를 불러오는 중입니다...</Text>
      </View>
    );
  }

  /**
   * 메시지 항목 렌더링
   *
   * @param {Object} item - 메시지 데이터 객체.
   * @returns {React.ReactElement} 렌더링된 메시지 항목.
   */
  const renderMessageItem = ({
    item,
  }: {
    item: {
      user_id: string | null;
      message: string;
      created_at: string | null;
      nickname?: string; // 닉네임 추가
    };
  }) => {
    const isMyMessage = item.user_id === user?.id; // 현재 로그인한 사용자와 메시지 발신자를 비교

    return (
      <View
        style={[
          styles.messageItem,
          isMyMessage ? styles.myMessage : styles.otherMessage, // 본인 메시지인지에 따라 스타일 적용
        ]}
      >
        {!isMyMessage && (
          <Text style={styles.userId}>{item.nickname ?? "Unknown User"}</Text>
        )}
        <Text
          style={[
            styles.messageText,
            isMyMessage ? styles.myMessageText : styles.otherMessageText, // 텍스트 색상 스타일 적용
          ]}
        >
          {item.message}
        </Text>
        <Text
          style={[
            styles.timestamp,
            isMyMessage ? styles.myTimestampText : styles.otherTimestampText, // 타임스탬프 색상 동적으로 적용
          ]}
        >
          {item.created_at
            ? new Date(item.created_at).toLocaleTimeString()
            : ""}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {noRoomMessage ? (
        <Text style={styles.noRoomText}>참여 중인 방이 없습니다.</Text>
      ) : (
        <>
          {/* 메시지 리스트 */}
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMessageItem}
            style={styles.messageList}
          />

          {/* 메시지 입력 및 전송 */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="메시지를 입력하세요..."
              value={newMessage}
              onChangeText={setNewMessage}
            />
            <Button title="전송" onPress={handleSendMessage} />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

/**
 * 스타일 정의
 */
const styles = StyleSheet.create({
  // 전체 컨테이너 스타일
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  // 메시지 리스트 스타일
  messageList: {
    flex: 1,
  },
  // 메시지 항목 스타일
  messageItem: {
    padding: 8,
    marginVertical: 4,
    borderRadius: 5,
    maxWidth: "75%", // 메시지 폭 제한
    backgroundColor: "#f0f0f0",
  },
  // 본인 메시지 스타일
  myMessage: {
    alignSelf: "flex-end", // 오른쪽 정렬
    backgroundColor: "#6049E2", // 본인 메시지 배경색
  },
  // 상대방 메시지 스타일
  otherMessage: {
    alignSelf: "flex-start", // 왼쪽 정렬
    backgroundColor: "#EBEBEB", // 상대방 메시지 배경색
  },
  // 본인 메시지 텍스트 스타일
  myMessageText: {
    color: "#FFFFFF",
  },
  // 상대방 메시지 텍스트 스타일
  otherMessageText: {
    color: "#080808",
  },
  // 본인 메시지 타임스탬프 스타일
  myTimestampText: {
    fontSize: 10,
    color: "#FFFFFF",
    alignSelf: "flex-end",
  },
  // 상대방 메시지 타임스탬프 스타일
  otherTimestampText: {
    fontSize: 10,
    color: "#080808",
    alignSelf: "flex-end",
  },
  // 메시지 발신자 닉네임 스타일
  userId: {
    fontSize: 12,
    color: "#888",
  },
  // 메시지 텍스트 스타일
  messageText: {
    fontSize: 16,
    marginVertical: 4,
  },
  // 메시지 입력 컨테이너 스타일
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 8,
  },
  // 메시지 입력 필드 스타일
  input: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    marginRight: 8,
  },
  // 참여 중인 방이 없을 때 텍스트 스타일
  noRoomText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
});
