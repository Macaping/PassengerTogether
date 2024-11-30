import { supabase } from "@/lib/supabase";

/**
 * 사용자를 주어진 방에 추가하고, 방에 참가한 사용자에게 푸시 알림을 전송합니다.
 *
 * @param {string} roomId - 사용자가 참가할 방의 ID
 *
 * 주요 동작:
 * 1. 현재 로그인된 사용자 정보를 가져옵니다.
 * 2. 주어진 방의 사용자 목록에 현재 사용자를 추가합니다.
 * 3. 사용자 정보(`current_party`)를 업데이트하여 현재 참가한 방을 설정합니다.
 * 4. 방에 참가한 새로운 사용자 정보를 기존 사용자들에게 알립니다.
 *
 * @returns {Promise<void>} 반환값 없음
 */
export default async function JoinRoom(roomId: string) {
  // Step 1: 현재 사용자 가져오기
  const user = await supabase.auth.getUser();
  const userId = user.data?.user?.id; // 현재 사용자 ID
  const userEmail = user.data?.user?.email; // 현재 사용자 이메일
  console.log("userId:", userId);

  if (userId) {
    // Step 2: 주어진 방의 사용자 목록 가져오기
    const { data: roomData, error: fetchError } = await supabase
      .from("rooms")
      .select("users")
      .eq("id", roomId)
      .single();

    console.log("roomData:", roomData);
    if (fetchError) {
      console.error("방 데이터 가져오기 실패:", fetchError);
    } else {
      const users = roomData.users || []; // 방에 등록된 사용자 ID 배열

      // Step 3: 방에 현재 사용자가 없으면 추가
      if (!users.includes(userId)) {
        users.push(userId); // 사용자 ID 추가

        // Step 4: 방 데이터 업데이트
        const { error: updateError } = await supabase
          .from("rooms")
          .update({ users })
          .eq("id", roomId);
        console.log("users:", users);

        if (updateError) {
          console.error("방 업데이트 실패:", updateError);
        } else {
          // Step 5: 사용자 정보 업데이트 (current_party 설정)
          const { error: insertError } = await supabase
            .from("users")
            .update({ current_party: roomId }) // 현재 참가 중인 방 ID 업데이트
            .eq("user_id", userId)
            .single();

          if (insertError) {
            console.error("사용자 정보 업데이트 실패:", insertError);
          } else {
            // Step 6: 사용자 자신을 제외한 방의 다른 사용자들에게 알림 전송
            const usersToNotify = users.filter((id) => id !== userId);

            if (usersToNotify.length > 0) {
              const BACKEND_API = process.env.EXPO_PUBLIC_BACKEND_API || ""; // 백엔드 API URL
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
                  const text = await response.text(); // 응답 메시지 처리
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
    console.error("사용자가 인증되지 않았습니다."); // 인증되지 않은 경우
  }
}
