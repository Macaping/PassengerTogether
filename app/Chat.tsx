import useChat from "@/hooks/useChat";
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

export default function ChatView() {
  const {
    messages,
    newMessage,
    noRoomMessage,
    setNewMessage,
    handleSendMessage,
  } = useChat();

  const renderMessageItem = ({
    item,
  }: {
    item: {
      user_id: string | null;
      message: string;
      created_at: string | null;
    };
  }) => (
    <View style={styles.messageItem}>
      <Text style={styles.userId}>{item.user_id ?? "Unknown User"}</Text>
      <Text style={styles.messageText}>{item.message}</Text>
      <Text style={styles.timestamp}>
        {item.created_at ? new Date(item.created_at).toLocaleTimeString() : ""}
      </Text>
    </View>
  );

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
    backgroundColor: "#f0f0f0",
  },
  userId: {
    fontSize: 12,
    color: "#888",
  },
  messageText: {
    fontSize: 16,
    marginVertical: 4,
  },
  timestamp: {
    fontSize: 10,
    color: "#aaa",
    alignSelf: "flex-end",
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
