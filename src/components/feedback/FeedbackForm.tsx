import type React from "react";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AgentResponseFeedback,
  type CreateFeedbackDto,
} from "../../services/feedback.service";
import { FeedbackRating } from "./FeedbackRating";

interface FeedbackFormProps {
  requestId: string;
  requestBloodType?: string;
  requestQuantity?: number;
  onSubmit: (data: CreateFeedbackDto) => Promise<void>;
  isSubmitting?: boolean;
  initialData?: Partial<CreateFeedbackDto>;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  requestId,
  requestBloodType,
  requestQuantity,
  onSubmit,
  isSubmitting = false,
  initialData,
}) => {
  const [formData, setFormData] = useState<Partial<CreateFeedbackDto>>({
    requestId,
    overallRating: initialData?.overallRating || 0,
    responseTimeRating: initialData?.responseTimeRating || 0,
    donorAvailabilityRating: initialData?.donorAvailabilityRating,
    bloodBankAvailabilityRating: initialData?.bloodBankAvailabilityRating,
    comments: initialData?.comments || "",
    suggestions: initialData?.suggestions || "",
    wasResolved: initialData?.wasResolved ?? true,
    resolutionTimeMinutes: initialData?.resolutionTimeMinutes,
    agentResponses: initialData?.agentResponses || [],
  });

  const [showResolutionTime, setShowResolutionTime] = useState(
    !!formData.resolutionTimeMinutes,
  );

  const handleSubmit = async () => {
    // Validate required fields
    if (formData.overallRating === 0) {
      Alert.alert("Validation Error", "Please provide an overall rating");
      return;
    }
    if (formData.responseTimeRating === 0) {
      Alert.alert("Validation Error", "Please rate the response time");
      return;
    }

    try {
      await onSubmit(formData as CreateFeedbackDto);
    } catch (error) {
      Alert.alert("Error", "Failed to submit feedback. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Rate Your Experience</Text>
        <Text style={styles.subtitle}>
          Your feedback helps us improve blood request coordination
        </Text>
      </View>

      {requestBloodType && (
        <View style={styles.requestInfo}>
          <Text style={styles.requestInfoText}>
            Request: {requestBloodType} • {requestQuantity} units
          </Text>
        </View>
      )}

      <View style={styles.form}>
        <FeedbackRating
          label="Overall Experience"
          value={formData.overallRating || 0}
          onChange={(rating) =>
            setFormData({ ...formData, overallRating: rating })
          }
          required
          description="How satisfied were you with the blood request process?"
        />

        <FeedbackRating
          label="Response Time"
          value={formData.responseTimeRating || 0}
          onChange={(rating) =>
            setFormData({ ...formData, responseTimeRating: rating })
          }
          required
          description="How fast did you receive results from the coordination system?"
        />

        <FeedbackRating
          label="Donor Availability"
          value={formData.donorAvailabilityRating || 0}
          onChange={(rating) =>
            setFormData({ ...formData, donorAvailabilityRating: rating })
          }
          description="Were there enough available donors for your request?"
        />

        <FeedbackRating
          label="Blood Bank Availability"
          value={formData.bloodBankAvailabilityRating || 0}
          onChange={(rating) =>
            setFormData({ ...formData, bloodBankAvailabilityRating: rating })
          }
          description="Were there enough blood banks with available stock?"
        />

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.switchLabel}>
              Request Resolved Successfully?
            </Text>
            <Text style={styles.switchDescription}>
              Was the blood request fulfilled successfully?
            </Text>
          </View>
          <Switch
            value={formData.wasResolved}
            onValueChange={(value) =>
              setFormData({ ...formData, wasResolved: value })
            }
            trackColor={{ false: "#e5e7eb", true: "#10b981" }}
            thumbColor={formData.wasResolved ? "#ffffff" : "#ffffff"}
          />
        </View>

        <TouchableOpacity
          style={styles.timeToggle}
          onPress={() => setShowResolutionTime(!showResolutionTime)}
        >
          <Text style={styles.timeToggleText}>
            {showResolutionTime ? "✓" : "+"} Add resolution time
          </Text>
        </TouchableOpacity>

        {showResolutionTime && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Resolution Time (minutes)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="e.g., 45"
              value={formData.resolutionTimeMinutes?.toString() || ""}
              onChangeText={(text) =>
                setFormData({
                  ...formData,
                  resolutionTimeMinutes: text ? parseInt(text) : undefined,
                })
              }
            />
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Additional Comments</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
            placeholder="What worked well? What could be improved?"
            value={formData.comments}
            onChangeText={(text) =>
              setFormData({ ...formData, comments: text })
            }
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Suggestions for Improvement</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
            placeholder="How can we make blood requests better?"
            value={formData.suggestions}
            onChangeText={(text) =>
              setFormData({ ...formData, suggestions: text })
            }
          />
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    padding: 20,
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  requestInfo: {
    backgroundColor: "#eff6ff",
    padding: 12,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 8,
  },
  requestInfoText: {
    color: "#1e40af",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  form: {
    padding: 20,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  switchLabelContainer: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 12,
    color: "#6b7280",
  },
  timeToggle: {
    marginBottom: 16,
  },
  timeToggleText: {
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: "500",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#ffffff",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#3b82f6",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
