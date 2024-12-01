import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase_type";
import { useEffect, useState } from "react";
import { useUser } from "./useUser";

/**
 * 타입 정의
 */
type Message = Database["public"]["Tables"]["messages"]["Row"]; // "messages" 테이블의 행 타입
type User = Database["public"]["Tables"]["users"]["Row"]; // "users" 테이블의 행 타입

/**
 * React에서 채팅 기능을 제공하는 커스텀 훅입니다.
 *
 * 주요 기능:
 * - 현재 사용자가 속한 채팅방 정보를 가져옵니다.
 * - 채팅방에 존재하는 메시지를 불러오고, 실시간으로 추가되는 메시지를 수신합니다.
 * - 사용자가 메시지를 작성하고 전송할 수 있도록 지원합니다.
 *
 * @returns {Object} 다음 값들을 반환합니다:
 * - `messages`: 채팅방의 메시지 목록 (닉네임 포함)
 * - `newMessage`: 새로 작성 중인 메시지
 * - `noRoomMessage`: 사용자가 속한 방이 없을 경우 표시되는 플래그
 * - `setNewMessage`: 작성 중인 메시지를 업데이트하는 함수
 * - `handleSendMessage`: 작성한 메시지를 전송하는 함수
 */
export default function useChat() {
  const { user } = useUser(); // 현재 로그인한 사용자 정보
  const [roomId, setRoomId] = useState<User["current_party"] | null>(null); // 현재 사용자가 속한 채팅방 ID
  const [messages, setMessages] = useState<(Message & { nickname?: string })[]>(
    [],
  ); // 닉네임이 포함된 메시지 목록
  const [newMessage, setNewMessage] = useState<string>(""); // 새로 작성 중인 메시지
  const [noRoomMessage, setNoRoomMessage] = useState<boolean>(false); // 사용자가 속한 방이 없는 경우 true
  const [messageChannel, setMessageChannel] = useState<any>(null); // 메시지 실시간 구독 채널
  const [userChannel, setUserChannel] = useState<any>(null); // 사용자 정보 관련 실시간 구독 채널

  /**
   * 현재 사용자가 속한 방 ID를 데이터베이스에서 가져옵니다.
   * - 사용자가 방에 속해 있다면 방 ID를 설정하고 메시지 구독을 시작합니다.
   * - 사용자가 방에 속하지 않은 경우 메시지 목록을 초기화합니다.
   */
  useEffect(() => {
    const fetchUserIdAndRoomId = async () => {
      if (user?.id) {
        // "users" 테이블에서 current_party 값을 가져옴
        const { data, error } = await supabase
          .from("users")
          .select("current_party")
          .eq("user_id", user?.id)
          .single();
        if (error) console.error("Room ID 가져오기 오류:", error.message);
        else if (data?.current_party) {
          setRoomId(data.current_party); // 방 ID 설정
          setNoRoomMessage(false); // 방이 있음을 표시
          if (!userChannel) subscribeToCurrentParty(user?.id); // 사용자 관련 실시간 구독 시작
        } else setNoRoomMessage(true); // 사용자가 속한 방이 없는 경우
      }
    };

    fetchUserIdAndRoomId();

    // 컴포넌트가 언마운트될 때 구독 해제
    return () => {
      if (userChannel) {
        supabase.removeChannel(userChannel);
        setUserChannel(null);
      }
    };
  }, [user]);

  /**
   * 채팅방의 메시지를 불러오고 실시간 메시지 구독을 설정합니다.
   * - 방 ID가 변경될 때마다 새롭게 메시지를 가져오고, 구독 채널을 초기화합니다.
   */
  useEffect(() => {
    let channel: any;
    if (roomId) {
      fetchMessagesWithNicknames(roomId); // 방의 메시지와 닉네임을 불러옴
      if (messageChannel) supabase.removeChannel(messageChannel); // 기존 채널 제거
      channel = supabase
        .channel("messages:" + roomId) // 채팅방 ID 기반 구독 채널 생성
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "messages",
            filter: `room_id=eq.${roomId}`, // 특정 방 ID로 필터링
          },
          async (payload) => {
            if (payload.eventType === "INSERT") {
              const newMessage = payload.new as Message;

              // 새 메시지의 작성자 닉네임을 가져옴
              const { data: userData, error: userError } = await supabase
                .from("users")
                .select("nickname")
                .eq("user_id", newMessage.user_id)
                .single();
              if (userError) console.error("닉네임 가져오기 오류:", userError);

              // 새 메시지와 닉네임을 추가
              setMessages((prev) => [
                ...prev,
                { ...newMessage, nickname: userData?.nickname },
              ]);
            }
          },
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") setMessageChannel(channel); // 채널 상태 업데이트
        });
    } else {
      setMessages([]); // 방 ID가 없는 경우 메시지 목록 초기화
      if (messageChannel) supabase.removeChannel(messageChannel); // 기존 채널 제거
    }

    // 컴포넌트가 언마운트될 때 채널 제거
    return () => {
      if (channel) supabase.removeChannel(channel);
      setMessageChannel(null);
    };
  }, [roomId]);

  /**
   * 주어진 방 ID에 해당하는 모든 메시지를 가져오고, 각 메시지에 작성자의 닉네임을 추가합니다.
   * @param {string} roomId - 메시지를 가져올 방의 ID
   */
  const fetchMessagesWithNicknames = async (roomId: string) => {
    const { data: messageData, error: messageError } = await supabase
      .from("messages")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true }); // 작성 시간 순 정렬

    if (messageError) {
      console.error("메시지 가져오기 오류:", messageError.message);
      return;
    }

    const messagesWithNicknames = await Promise.all(
      messageData.map(async (message) => {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("nickname")
          .eq("user_id", message.user_id)
          .single();
        if (userError) console.error("닉네임 가져오기 오류:", userError);

        return { ...message, nickname: userData?.nickname }; // 닉네임 추가
      }),
    );

    setMessages(messagesWithNicknames); // 메시지 목록 업데이트
  };

  /**
   * 사용자가 입력한 메시지를 현재 채팅방에 전송합니다.
   */
  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !roomId) return; // 메시지가 비었거나 방 ID가 없으면 실행하지 않음
    const { error } = await supabase
      .from("messages")
      .insert([{ room_id: roomId, user_id: user?.id, message: newMessage }]); // 새 메시지 삽입
    if (error) console.error("메시지 전송 오류:", error.message);
    else setNewMessage(""); // 메시지 입력 필드 초기화
  };

  // 훅에서 반환되는 값
  return {
    messages, // 현재 메시지 목록
    newMessage, // 작성 중인 새 메시지
    noRoomMessage, // 방이 없는 상태
    setNewMessage, // 새 메시지 설정 함수
    handleSendMessage, // 메시지 전송 함수
  };
}
