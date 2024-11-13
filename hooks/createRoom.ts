import { supabase } from "@/lib/supabase";

export async function createRoom({
  departure_time,
  origin,
  destination,
  limit_people,
  users = [],
  details,
}: {
  departure_time: string;
  origin: string;
  destination: string;
  limit_people: number;
  users: string[];
  details: string;
}) {
  var roomData = {
    departure_time: departure_time,
    origin: origin,
    destination: destination,
    // 최대 인원은 4명으로 고정됨
    // limit_people: limit_people,
    users: users,
    details: details,
  };
  console.log("roomData:", roomData);

  try {
    // 방을 생성하고 생성된 방 데이터를 반환
    const { data: insertedData, error } = await supabase
      .from("rooms")
      .insert([roomData])
      .select();

    if (error) {
      throw error.message;
    }
    console.log("Room created successfully");
    // 성공적으로 생성된 방 데이터 반환
    console.log("insertedData:", insertedData.at(0));
    return insertedData.at(0);
  } catch (error) {
    // 오류
    console.error("Failed to create room:", error);
  }
  return null;
}
