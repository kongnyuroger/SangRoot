import type React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface FeedbackSuccessProps {
  onClose: () => void;
  onViewHistory?: () => void;
}

export const FeedbackSuccess: React.FC<FeedbackSuccessProps> = ({
  onClose,
  onViewHistory,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>✓</Text>
      </View>
      <Text style={styles.title}>Thank You for Your Feedback!</Text>
      <Text style={styles.message}>
        Your input helps us improve the blood request coordination system and
        better serve patients in need.
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
        {onViewHistory && (
          <TouchableOpacity
            style={styles.historyButton}
            onPress={onViewHistory}
          >
            <Text style={styles.historyButtonText}>View My Feedback</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#10b981",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  icon: {
    fontSize: 48,
    color: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  closeButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  historyButton: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  historyButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
});
