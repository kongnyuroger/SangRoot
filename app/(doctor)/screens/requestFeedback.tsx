// import { Ionicons } from "@expo/vector-icons";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { colors } from "../../src/constants/theme";
// import { feedbackService } from "../../src/services/feedback.service";
// import type { FeedbackResponse } from "../../src/types/feedback.types";

// // Rating Stars Component
// const RatingStars = ({
//   rating,
//   onRating,
//   label,
// }: {
//   rating?: number;
//   onRating: (value: number) => void;
//   label: string;
// }) => {
//   return (
//     <View className="mb-4">
//       <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
//       <View className="flex-row gap-2">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <TouchableOpacity
//             key={star}
//             onPress={() => onRating(star)}
//             className="p-1"
//           >
//             <Ionicons
//               name={star <= (rating || 0) ? "star" : "star-outline"}
//               size={28}
//               color={star <= (rating || 0) ? colors.primary : colors.neutralGray}
//             />
//           </TouchableOpacity>
//         ))}
//       </View>
//     </View>
//   );
// };

// // Response Summary Component
// const ResponseSummary = ({ feedback }: { feedback: FeedbackResponse }) => {
//   const summary = feedback.agentResponseSummary;

//   if (!summary) return null;

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "FULFILLED":
//         return "text-green-600";
//       case "IN_PROGRESS":
//         return "text-blue-600";
//       case "EXPIRED":
//       case "CANCELLED":
//         return "text-red-600";
//       default:
//         return "text-gray-600";
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "FULFILLED":
//         return "checkmark-circle";
//       case "IN_PROGRESS":
//         return "time";
//       case "EXPIRED":
//         return "alert-circle";
//       case "CANCELLED":
//         return "close-circle";
//       default:
//         return "information-circle";
//     }
//   };

//   return (
//     <View className="bg-gray-50 rounded-xl p-4 mb-6">
//       <Text className="text-lg font-bold text-gray-800 mb-3">
//         Agent Response Summary
//       </Text>

//       {/* Request Details */}
//       <View className="bg-white rounded-lg p-3 mb-3">
//         <View className="flex-row justify-between items-center mb-2">
//           <Text className="text-sm text-gray-500">Blood Type</Text>
//           <Text className="text-base font-semibold text-gray-800">
//             {summary.bloodType.replace("_", " ")}
//           </Text>
//         </View>
//         <View className="flex-row justify-between items-center mb-2">
//           <Text className="text-sm text-gray-500">Quantity</Text>
//           <Text className="text-base font-semibold text-gray-800">
//             {summary.quantity} units
//           </Text>
//         </View>
//         <View className="flex-row justify-between items-center mb-2">
//           <Text className="text-sm text-gray-500">Urgency</Text>
//           <Text
//             className={`text-base font-semibold ${
//               summary.urgency === "CRITICAL"
//                 ? "text-red-600"
//                 : summary.urgency === "URGENT"
//                 ? "text-orange-600"
//                 : "text-blue-600"
//             }`}
//           >
//             {summary.urgency}
//           </Text>
//         </View>
//         <View className="flex-row justify-between items-center">
//           <Text className="text-sm text-gray-500">Status</Text>
//           <View className="flex-row items-center gap-1">
//             <Ionicons
//               name={getStatusIcon(feedback.request.status)}
//               size={16}
//               color={
//                 feedback.request.status === "FULFILLED"
//                   ? "#059669"
//                   : feedback.request.status === "IN_PROGRESS"
//                   ? "#2563eb"
//                   : "#dc2626"
//               }
//             />
//             <Text className={`text-base font-semibold ${getStatusColor(feedback.request.status)}`}>
//               {feedback.request.status}
//             </Text>
//           </View>
//         </View>
//       </View>

//       {/* Outreach Results */}
//       <Text className="text-md font-semibold text-gray-700 mb-2">Outreach Results</Text>
//       <View className="bg-white rounded-lg p-3 mb-3">
//         <View className="flex-row justify-between items-center mb-2">
//           <Text className="text-sm text-gray-500">Donors Contacted</Text>
//           <Text className="text-base font-semibold text-gray-800">
//             {summary.donorSummary.total}
//           </Text>
//         </View>
//         <View className="flex-row justify-between items-center mb-2">
//           <Text className="text-sm text-gray-500">Donors Available</Text>
//           <Text className="text-base font-semibold text-green-600">
//             {summary.donorSummary.available}
//           </Text>
//         </View>
//         <View className="flex-row justify-between items-center mb-2">
//           <Text className="text-sm text-gray-500">Blood Banks Contacted</Text>
//           <Text className="text-base font-semibold text-gray-800">
//             {summary.bloodBankSummary.total}
//           </Text>
//         </View>
//         <View className="flex-row justify-between items-center">
//           <Text className="text-sm text-gray-500">Blood Banks with Stock</Text>
//           <Text className="text-base font-semibold text-green-600">
//             {summary.bloodBankSummary.available}
//           </Text>
//         </View>
//       </View>

//       {/* Completion Time */}
//       {feedback.request.completedAt && (
//         <View className="bg-white rounded-lg p-3">
//           <Text className="text-sm text-gray-500 mb-1">Completed On</Text>
//           <Text className="text-sm text-gray-800">
//             {new Date(feedback.request.completedAt).toLocaleString()}
//           </Text>
//         </View>
//       )}
//     </View>
//   );
// };

// export default function RequestFeedbackScreen() {
//   const router = useRouter();
//   const { requestId } = useLocalSearchParams<{ requestId: string }>();
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
//   const [formData, setFormData] = useState({
//     responseAccuracy: undefined as number | undefined,
//     responseSpeed: undefined as number | undefined,
//     communication: undefined as number | undefined,
//     overallRating: undefined as number | undefined,
//     comments: "",
//     whatWorked: "",
//     whatNeedsImprovement: "",
//   });

//   useEffect(() => {
//     if (requestId) {
//       loadFeedback();
//     }
//   }, [requestId]);

//   const loadFeedback = async () => {
//     try {
//       setLoading(true);
//       const existingFeedback = await feedbackService.getByRequestId(requestId);
//       if (existingFeedback) {
//         setFeedback(existingFeedback);
//         // Populate form with existing feedback
//         setFormData({
//           responseAccuracy: existingFeedback.responseAccuracy,
//           responseSpeed: existingFeedback.responseSpeed,
//           communication: existingFeedback.communication,
//           overallRating: existingFeedback.overallRating,
//           comments: existingFeedback.comments || "",
//           whatWorked: existingFeedback.whatWorked || "",
//           whatNeedsImprovement: existingFeedback.whatNeedsImprovement || "",
//         });
//       }
//     } catch (error) {
//       console.error("Error loading feedback:", error);
//       Alert.alert("Error", "Failed to load feedback data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!requestId) return;

//     // Validate at least one rating
//     const hasRating =
//       formData.responseAccuracy ||
//       formData.responseSpeed ||
//       formData.communication ||
//       formData.overallRating;

//     if (!hasRating && !formData.comments && !formData.whatWorked) {
//       Alert.alert(
//         "Incomplete Feedback",
//         "Please provide at least one rating or comment to submit feedback."
//       );
//       return;
//     }

//     setSubmitting(true);
//     try {
//       await feedbackService.createOrUpdate({
//         requestId,
//         ...formData,
//       });
//       Alert.alert(
//         "Thank You!",
//         "Your feedback has been submitted successfully. It helps us improve our AI agent.",
//         [{ text: "OK", onPress: () => router.back() }]
//       );
//     } catch (error) {
//       console.error("Error submitting feedback:", error);
//       Alert.alert("Error", "Failed to submit feedback. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View className="flex-1 justify-center items-center bg-white">
//         <ActivityIndicator size="large" color={colors.primary} />
//         <Text className="mt-4 text-gray-600">Loading feedback data...</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView className="flex-1 bg-white">
//       {/* Header */}
//       <View className="px-4 pt-12 pb-4 bg-white border-b border-gray-200">
//         <View className="flex-row items-center justify-between">
//           <TouchableOpacity onPress={() => router.back()} className="p-2">
//             <Ionicons name="arrow-back" size={24} color={colors.gray800} />
//           </TouchableOpacity>
//           <Text className="text-xl font-bold text-gray-800">
//             Request Feedback
//           </Text>
//           <View style={{ width: 40 }} />
//         </View>
//         <Text className="text-sm text-gray-500 mt-2 text-center">
//           Help us improve our blood coordination system
//         </Text>
//       </View>

//       <View className="p-4">
//         {/* Response Summary */}
//         {feedback && <ResponseSummary feedback={feedback} />}

//         {/* Feedback Form */}
//         <View className="mb-6">
//           <Text className="text-lg font-bold text-gray-800 mb-4">
//             Rate Your Experience
//           </Text>

//           <RatingStars
//             label="Response Accuracy"
//             rating={formData.responseAccuracy}
//             onRating={(value) => setFormData({ ...formData, responseAccuracy: value })}
//           />
//           <Text className="text-xs text-gray-500 -mt-2 mb-3">
//             How accurate was the AI agent's response to your request?
//           </Text>

//           <RatingStars
//             label="Response Speed"
//             rating={formData.responseSpeed}
//             onRating={(value) => setFormData({ ...formData, responseSpeed: value })}
//           />
//           <Text className="text-xs text-gray-500 -mt-2 mb-3">
//             How quickly did you receive the response?
//           </Text>

//           <RatingStars
//             label="Communication Clarity"
//             rating={formData.communication}
//             onRating={(value) => setFormData({ ...formData, communication: value })}
//           />
//           <Text className="text-xs text-gray-500 -mt-2 mb-3">
//             Was the information clear and easy to understand?
//           </Text>

//           <RatingStars
//             label="Overall Satisfaction"
//             rating={formData.overallRating}
//             onRating={(value) => setFormData({ ...formData, overallRating: value })}
//           />
//           <Text className="text-xs text-gray-500 -mt-2 mb-4">
//             Your overall experience with the blood request process
//           </Text>

//           {/* Text Feedback */}
//           <View className="mb-4">
//             <Text className="text-sm font-medium text-gray-700 mb-2">
//               What worked well?
//             </Text>
//             <TextInput
//               className="border border-gray-300 rounded-xl p-3 text-gray-800 min-h-[80px]"
//               multiline
//               numberOfLines={3}
//               placeholder="e.g., Quick response time, accurate donor matching..."
//               value={formData.whatWorked}
//               onChangeText={(text) => setFormData({ ...formData, whatWorked: text })}
//             />
//           </View>

//           <View className="mb-4">
//             <Text className="text-sm font-medium text-gray-700 mb-2">
//               What needs improvement?
//             </Text>
//             <TextInput
//               className="border border-gray-300 rounded-xl p-3 text-gray-800 min-h-[80px]"
//               multiline
//               numberOfLines={3}
//               placeholder="e.g., Better donor location filtering, faster response time..."
//               value={formData.whatNeedsImprovement}
//               onChangeText={(text) =>
//                 setFormData({ ...formData, whatNeedsImprovement: text })
//               }
//             />
//           </View>

//           <View className="mb-6">
//             <Text className="text-sm font-medium text-gray-700 mb-2">
//               Additional Comments
//             </Text>
//             <TextInput
//               className="border border-gray-300 rounded-xl p-3 text-gray-800 min-h-[100px]"
//               multiline
//               numberOfLines={4}
//               placeholder="Any other feedback you'd like to share..."
//               value={formData.comments}
//               onChangeText={(text) => setFormData({ ...formData, comments: text })}
//             />
//           </View>

//           {/* Submit Button */}
//           <TouchableOpacity
//             className={`py-4 rounded-xl ${
//               submitting ? "bg-gray-400" : "bg-[#E31837]"
//             }`}
//             onPress={handleSubmit}
//             disabled={submitting}
//           >
//             {submitting ? (
//               <ActivityIndicator color="white" />
//             ) : (
//               <Text className="text-white text-center font-semibold text-lg">
//                 Submit Feedback
//               </Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }