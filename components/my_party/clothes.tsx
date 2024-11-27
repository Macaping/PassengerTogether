import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function clothes({ text }: { text: string | null }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>방장의 옷차림</Text>
      <ScrollView>
        {!text ? (
          <Text style={styles.text}>
            상세사항으로 받은 데이터를 만남의장소와 옷차림으로 쪼개서 db로 //
            받고 글자수 제한 필요어디까지 받을건지 확인 필요 3줄 정도만
          </Text>
        ) : (
          <Text style={styles.text}>{text}</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  label: {
    fontSize: 20,
    color: "#6F6F6F",
  },
  text: {
    fontSize: 20,
    color: "#000000",
  },
});
