import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useChat from "@/hooks/useChat";
import { useAuthUser } from "@/hooks/useAuthUser";

export default function ChatView() {
  const {
    messages,
    newMessage,
    noRoomMessage,
    setNewMessage,
    handleSendMessage,
  } = useChat();
  const { user } = useAuthUser();

  if (!user) {
    // user가 없으면 로딩 화면 표시
    return (
      <View style={styles.container}>
        <Text>사용자 정보를 불러오는 중입니다...</Text>
      </View>
    );
  }

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
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMessageItem}
            style={styles.messageList}
          />

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  messageList: {
    flex: 1,
  },
  messageItem: {
    padding: 8,
    marginVertical: 4,
    borderRadius: 5,
    maxWidth: "75%", // 메시지 폭 제한
    backgroundColor: "#f0f0f0",
  },
  myMessage: {
    alignSelf: "flex-end", // 오른쪽 정렬
    backgroundColor: "#6049E2", // 본인 메시지의 배경색
  },
  otherMessage: {
    alignSelf: "flex-start", // 왼쪽 정렬
    backgroundColor: "#EBEBEB", // 상대방 메시지의 배경색
  },
  myMessageText: {
    color: "#FFFFFF", // 본인 메시지의 글자 색
  },
  otherMessageText: {
    color: "#080808", // 상대방 메시지의 글자 색
  },
  myTimestampText: {
    fontSize: 10,
    color: "#FFFFFF", // 본인 메시지의 타임스탬프 색
    alignSelf: "flex-end",
  },
  otherTimestampText: {
    fontSize: 10,
    color: "#080808", // 상대방 메시지의 타임스탬프 색
    alignSelf: "flex-end",
  },
  userId: {
    fontSize: 12,
    color: "#888",
  },
  messageText: {
    fontSize: 16,
    marginVertical: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 8,
  },
  input: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    marginRight: 8,
  },
  noRoomText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
});
