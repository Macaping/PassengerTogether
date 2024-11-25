import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase_type";
import { useEffect, useState } from "react";
import { useUser } from "./useUser";

type Message = Database["public"]["Tables"]["messages"]["Row"];
type User = Database["public"]["Tables"]["users"]["Row"];

export default function useChat() {
  const { user } = useUser();
  const [roomId, setRoomId] = useState<User["current_party"] | null>(null);
  const [messages, setMessages] = useState<(Message & { nickname?: string })[]>(
    [],
  ); // 닉네임 포함
  const [newMessage, setNewMessage] = useState<string>("");
  const [noRoomMessage, setNoRoomMessage] = useState<boolean>(false);
  const [messageChannel, setMessageChannel] = useState<any>(null);
  const [userChannel, setUserChannel] = useState<any>(null);

  useEffect(() => {
    const fetchUserIdAndRoomId = async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from("users")
          .select("current_party")
          .eq("user_id", user?.id)
          .single();
        if (error) console.error("Room ID fetch error:", error.message);
        else if (data?.current_party) {
          setRoomId(data.current_party);
          setNoRoomMessage(false);
          if (!userChannel) subscribeToCurrentParty(user?.id);
        } else setNoRoomMessage(true);
      }
    };

    fetchUserIdAndRoomId();
    return () => {
      if (userChannel) {
        supabase.removeChannel(userChannel);
        setUserChannel(null);
      }
    };
  }, [user]);

  useEffect(() => {
    let channel: any;
    if (roomId) {
      fetchMessagesWithNicknames(roomId);
      if (messageChannel) supabase.removeChannel(messageChannel);
      channel = supabase
        .channel("messages:" + roomId)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "messages",
            filter: `room_id=eq.${roomId}`,
          },
          async (payload) => {
            if (payload.eventType === "INSERT") {
              const newMessage = payload.new as Message;

              // 사용자 닉네임 가져오기
              const { data: userData, error: userError } = await supabase
                .from("users")
                .select("nickname")
                .eq("user_id", newMessage.user_id)
                .single();
              if (userError) console.error("Nickname fetch error:", userError);

              // 닉네임 포함하여 메시지 추가
              setMessages((prev) => [
                ...prev,
                { ...newMessage, nickname: userData?.nickname },
              ]);
            }
          },
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") setMessageChannel(channel);
        });
    } else {
      setMessages([]);
      if (messageChannel) supabase.removeChannel(messageChannel);
    }

    return () => {
      if (channel) supabase.removeChannel(channel);
      setMessageChannel(null);
    };
  }, [roomId]);

  const fetchMessagesWithNicknames = async (roomId: string) => {
    const { data: messageData, error: messageError } = await supabase
      .from("messages")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true });

    if (messageError) {
      console.error("Message fetch error:", messageError.message);
      return;
    }

    // 닉네임 매핑
    const messagesWithNicknames = await Promise.all(
      messageData.map(async (message) => {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("nickname")
          .eq("user_id", message.user_id)
          .single();
        if (userError) console.error("Nickname fetch error:", userError);

        return { ...message, nickname: userData?.nickname };
      }),
    );

    setMessages(messagesWithNicknames);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !roomId) return;
    const { error } = await supabase
      .from("messages")
      .insert([{ room_id: roomId, user_id: user?.id, message: newMessage }]);
    if (error) console.error("Message send error:", error.message);
    else setNewMessage("");
  };

  return {
    messages,
    newMessage,
    noRoomMessage,
    setNewMessage,
    handleSendMessage,
  };
}
