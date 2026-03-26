import type React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface FeedbackRatingProps {
  label: string;
  value: number;
  onChange: (rating: number) => void;
  maxRating?: number;
  required?: boolean;
  description?: string;
}

export const FeedbackRating: React.FC<FeedbackRatingProps> = ({
  label,
  value,
  onChange,
  maxRating = 5,
  required = false,
  description,
}) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => onChange(i)}
          style={styles.starButton}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.star,
              i <= value ? styles.starFilled : styles.starEmpty,
            ]}
          >
            ★
          </Text>
        </TouchableOpacity>,
      );
    }
    return stars;
  };

  const getRatingLabel = () => {
    if (value === 1) return "Very Poor";
    if (value === 2) return "Poor";
    if (value === 3) return "Average";
    if (value === 4) return "Good";
    if (value === 5) return "Excellent";
    return "";
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
        {value > 0 && (
          <Text style={styles.ratingLabel}>{getRatingLabel()}</Text>
        )}
      </View>
      {description && <Text style={styles.description}>{description}</Text>}
      <View style={styles.starsContainer}>{renderStars()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  required: {
    color: "#ef4444",
  },
  ratingLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontStyle: "italic",
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
  star: {
    fontSize: 32,
    fontWeight: "400",
  },
  starFilled: {
    color: "#fbbf24",
  },
  starEmpty: {
    color: "#d1d5db",
  },
});
