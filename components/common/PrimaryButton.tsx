import { StyleSheet, Text, TouchableOpacity } from "react-native";

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
};

export default function PrimaryButton({ label, onPress }: PrimaryButtonProps) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Text style={styles.btnText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#f7c948",
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#b06a0a",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  btnText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a0a2e",
    letterSpacing: 1,
  },
});