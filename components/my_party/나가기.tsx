import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { PostgrestSingleResponse, UserResponse } from "@supabase/supabase-js";
import { router } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "./icon_styles";

export default function 나가기() {
  const handleLeaveRoom = async () => {
    supabase.auth
      .getUser()
      // 사용자 정보 가져오기
      .then((value: UserResponse) => {
        if (value.error) throw value.error;
        return value.data.user.id;
      })
      // 사용자를 방에서 나가게 하기
      .then((userId: string) => {
        supabase
          .from("users")
          .update({ current_party: null })
          .eq("user_id", userId)
          .then((value: PostgrestSingleResponse<null>) => {
            if (value.error) throw value.error;
            return value.data;
          });
      })
      // 처음 페이지로 이동
      .then(() => router.replace("/(tabs)"))
      // 오류 처리
      .catch((error: Error) => {
        console.error("사용자 정보 가져오기 오류:", error);
      });
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleLeaveRoom}>
      <Ionicons name="people-outline" size={32} color="#666666" />
      <Text style={styles.buttonText}>나가기</Text>
    </TouchableOpacity>
  );
}
