import { supabase } from "@/lib/supabase";
import { User } from "./user";

/**
 * 새로운 방을 생성합니다.
 */
export async function CreateRoom({
  departure_time,
  origin,
  destination,
  details,
  room_name,
  meetingPlace,
}: {
  departure_time: string;
  origin: string;
  destination: string;
  details: string;
  room_name: string;
  meetingPlace: string;
}) {
  let room = {
    departure_time: departure_time,
    origin: origin,
    destination: destination,
    details: meetingPlace,
    room_name: room_name,
  };

  const user = await User();
  if (!user?.id) throw Error("사용자 정보가 없습니다.");

  try {
    // 방을 생성하고 생성된 방 데이터를 반환
    const { data, error } = await supabase
      .from("rooms")
      .insert([room])
      .select();

    if (error) throw error;

    // meetingPlace 값을 clothes 컬럼에 업데이트
    const { error: updateError } = await supabase
      .from("users")
      .update({ clothes: details }) // meetingPlace 값을 clothes로 설정
      .eq("user_id", user.id); // `uuid` 컬럼으로 조건 변경

    if (updateError) throw updateError;

    // 성공적으로 생성된 방 데이터 반환
    return data.at(0);
  } catch (error) {
    // 오류
    console.error("Failed to create room or update clothes:", error);
    throw error;
  }
}
