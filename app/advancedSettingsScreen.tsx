import { StyleSheet, Text, View } from "react-native";

export default function PageName() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Advanced Settings Screen In Progress</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    justifyContent: "center",
    alignItems: "center",
  },
});
