import { supabase } from "@/lib/supabase";

export default async function useJoinRoom(roomId: string) {
  // 현재 사용자 가져오기
  const user = await supabase.auth.getUser();
  const userId = user.data?.user?.id;
  const userEmail = user.data?.user?.email; // 추가: 사용자 이메일 가져오기 (로그에 사용)
  console.log("userId:", userId);

  if (userId) {
    // 방 데이터 배열 가져오기
    const { data: roomData, error: fetchError } = await supabase
      .from("rooms")
      .select("users")
      .eq("id", roomId)
      .single();

    console.log("roomData:", roomData);
    if (fetchError) {
      // 오류 처리
      console.error(fetchError);
    } else {
      // 방에 사용자가 포함되어 있지 않으면 추가
      const users = roomData.users || [];
      if (!users.includes(userId)) {
        users.push(userId);

        // 방 데이터 업데이트
        const { error: updateError } = await supabase
          .from("rooms")
          .update({ users })
          .eq("id", roomId);
        console.log("users:", users);

        if (updateError) {
          // 오류 처리
          console.error(updateError);
        } else {
          // 사용자 테이블에 방 추가
          const { error: insertError } = await supabase
            .from("users")
            .update({ current_party: roomId })
            .eq("user_id", userId)
            .single();

          if (insertError) {
            // 오류 처리
            console.error(insertError);
          } else {
            // 사용자 자신을 제외한 방의 모든 사용자에게 알림 전송
            const usersToNotify = users.filter((id) => id !== userId);

            if (usersToNotify.length > 0) {
              // 방에 참가한 후 알림을 보내기 위해 서버로 POST 요청
              try {
                await fetch("http://192.168.34.9:3000/send-notification", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    roomId: roomId,
                    newUserId: userId,
                    newUserEmail: userEmail, // 추가: 사용자 이메일도 서버에 전달
                    usersToNotify: usersToNotify, // 추가: 알림을 받을 사용자 목록
                  }),
                });
                console.log("푸시 알림 전송 요청 성공");
              } catch (error) {
                console.error("푸시 알림 전송 요청 중 오류 발생:", error);
              }
            } else {
              console.log("알림을 받을 사용자가 없습니다.");
            }
          }
        }
      }
    }
  } else {
    // 인증되지 않은 사용자 처리
    console.error("User not authenticated");
  }
}
