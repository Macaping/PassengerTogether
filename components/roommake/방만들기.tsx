import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/useUser";

interface CreateRoomButtonProps {
  onPress: () => void; // 버튼 클릭 시 호출할 함수
  disabled?: boolean; // 버튼 비활성화 여부
  text: string; // 버튼 텍스트
}

export default function CreateRoomButton({
  onPress,
  disabled = false,
  text,
}: CreateRoomButtonProps) {
  const { user } = useUser();
  const [currentParty, setCurrentParty] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserParty = async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from("users")
          .select("current_party")
          .eq("user_id", user.id)
          .single();

        if (data) {
          setCurrentParty(data.current_party);
        }
      }
    };

    fetchUserParty();
  }, [user]);
  return (
    <TouchableOpacity
      style={[
        styles.button,
        (disabled || currentParty) && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled || !!currentParty}
    >
      <Text style={styles.buttonText}>
        {currentParty ? "이미 참여 중인 방이 있습니다" : text}
      </Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#6B59CC",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
