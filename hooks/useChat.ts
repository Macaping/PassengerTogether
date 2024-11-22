import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase_type";
import { useEffect, useState } from "react";
import { useUser } from "./useUser";

type Message = Database["public"]["Tables"]["messages"]["Row"];
type User = Database["public"]["Tables"]["users"]["Row"];

export default function useChat() {
  const { user } = useUser();
  const [roomId, setRoomId] = useState<User["current_party"] | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
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
      fetchMessages(roomId);
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
          (payload) => {
            if (payload.eventType === "INSERT")
              setMessages((prev) => [...prev, payload.new as Message]);
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

  const subscribeToCurrentParty = (userId: string) => {
    const userChannel = supabase
      .channel("user_updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const updatedCurrentParty = (payload.new as User).current_party;
          if (updatedCurrentParty === null)
            setNoRoomMessage(true), setRoomId(null);
          else if (updatedCurrentParty !== roomId)
            setRoomId(updatedCurrentParty), setNoRoomMessage(false);
        },
      )
      .subscribe();
    setUserChannel(userChannel);
  };

  const fetchMessages = async (roomId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true });
    if (error) console.error("Message fetch error:", error.message);
    else setMessages(data || []);
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
