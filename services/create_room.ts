import { supabase } from "@/lib/supabase";

export async function CreateRoom({
  departure_time,
  origin,
  destination,
  users = [],
  details,
}: {
  departure_time: string;
  origin: string;
  destination: string;
  users: string[];
  details: string;
}) {
  var room = {
    departure_time: departure_time,
    origin: origin,
    destination: destination,
    users: users,
    details: details,
  };

  try {
    // 방을 생성하고 생성된 방 데이터를 반환
    const { data, error } = await supabase
      .from("rooms")
      .insert([room])
      .select();

    if (error) throw error;
    // 성공적으로 생성된 방 데이터 반환
    return data.at(0);
  } catch (error) {
    // 오류
    console.error("Failed to create room:", error);
    throw error;
  }
}
