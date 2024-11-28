import { supabase } from "@/lib/supabase";

export default async function JoinRoom(roomId: string) {
  // 현재 사용자 가져오기
  const user = await supabase.auth.getUser();
  const userId = user.data?.user?.id;
  const userEmail = user.data?.user?.email; // 사용자 이메일 가져오기
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
          console.error(updateError);
        } else {
          // 사용자 테이블에 방 추가
          const { error: insertError } = await supabase
            .from("users")
            .update({ current_party: roomId })
            .eq("user_id", userId)
            .single();

          if (insertError) {
            console.error(insertError);
          } else {
            // 사용자 자신을 제외한 방의 모든 사용자에게 알림 전송
            const usersToNotify = users.filter((id) => id !== userId);

            if (usersToNotify.length > 0) {
              // 방에 참가한 후 알림을 보내기 위해 서버로 POST 요청
              const BACKEND_API = process.env.EXPO_PUBLIC_BACKEND_API || "";
              try {
                const response = await fetch(BACKEND_API, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    roomId: roomId,
                    newUserId: userId,
                    newUserEmail: userEmail,
                  }),
                });

                if (response.ok) {
                  const text = await response.text(); // 응답을 텍스트로 처리
                  console.log("푸시 알림 전송 요청 성공:", text);
                } else {
                  console.error(
                    "푸시 알림 전송 요청 실패:",
                    response.status,
                    response.statusText,
                  );
                }
              } catch (error) {
                console.error("푸시 알림 전송 요청 중 오류 발생:", error);
              }
            }
          }
        }
      }
    }
  } else {
    console.error("User not authenticated");
  }
}
