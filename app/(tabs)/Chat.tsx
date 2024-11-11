import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { supabase } from '@/lib/supabase';
import { getCurrentUserId } from '@/utils/authHelpers';

export default function ChatView() {
    const [userId, setUserId] = useState(null);
    const [roomId, setRoomId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchUserIdAndRoomId = async () => {
            const id = await getCurrentUserId();
            console.log('Fetched user ID:', id);
            setUserId(id);

            if (id) {
                const { data, error } = await supabase
                    .from('users')
                    .select('current_party')
                    .eq('user_id', id)
                    .single();

                if (error) {
                    console.error('Room ID fetch error:', error.message);
                } else {
                    console.log('Fetched room ID:', data.current_party);
                    setRoomId(data.current_party);
                    if (data.current_party) {
                        fetchMessages(data.current_party);
                        subscribeToMessages(data.current_party);
                    }
                }
            }
        };

        fetchUserIdAndRoomId();

        return () => {
            supabase.removeAllSubscriptions();
        };
    }, []);

    const subscribeToMessages = (roomId) => {
        console.log('Subscribing to messages in room:', roomId);
        const messageChannel = supabase
            .channel("messages")
            .on("postgres_changes",
                {
                    event: "*",  // 모든 이벤트 감지 (INSERT, UPDATE, DELETE)
                    schema: "public",
                    table: "messages",
                    filter: `room_id=eq.${roomId}`
                },
                (payload) => {
                    if (payload.eventType === "INSERT") {
                        console.log('New message received:', payload.new);
                        setMessages((prevMessages) => [...prevMessages, payload.new]);
                    }
                }
            )
            .subscribe();


        return () => {
            supabase.removeSubscription(messageChannel);
        };
    };

    const fetchMessages = async (roomId) => {
        console.log('Fetching messages for room:', roomId);
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('room_id', roomId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Message fetch error:', error.message);
        } else {
            console.log('Fetched messages:', data);
            setMessages(data);
        }
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() === '' || !roomId) return;

        console.log('Sending message:', newMessage);
        const { error } = await supabase
            .from('messages')
            .insert([
                {
                    room_id: roomId,
                    user_id: userId,
                    message: newMessage,
                },
            ]);

        if (error) {
            console.error('Message send error:', error.message);
        } else {
            console.log('Message sent successfully');
            setNewMessage('');
        }
    };

    const renderMessageItem = ({ item }) => (
        <View style={styles.messageItem}>
            <Text style={styles.userId}>{item.user_id}</Text>
            <Text style={styles.messageText}>{item.message}</Text>
            <Text style={styles.timestamp}>{new Date(item.created_at).toLocaleTimeString()}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    messageList: {
        flex: 1,
    },
    messageItem: {
        padding: 8,
        marginVertical: 4,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
    },
    userId: {
        fontSize: 12,
        color: '#888',
    },
    messageText: {
        fontSize: 16,
        marginVertical: 4,
    },
    timestamp: {
        fontSize: 10,
        color: '#aaa',
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ddd',
        paddingTop: 8,
    },
    input: {
        flex: 1,
        padding: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        marginRight: 8,
    },
});
