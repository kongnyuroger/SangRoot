import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../../src/constants/theme";
import { bloodRequestService, BloodRequestDetail } from "../../../src/services/blood-request.service";

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'FULFILLED':
        return { bg: '#DCFCE7', text: '#166534', icon: 'checkmark-circle' };
      case 'IN_PROGRESS':
        return { bg: '#DBEAFE', text: '#1E40AF', icon: 'time' };
      case 'PENDING':
        return { bg: '#FEF3C7', text: '#92400E', icon: 'hourglass' };
      case 'CANCELLED':
        return { bg: '#FEE2E2', text: '#991B1B', icon: 'close-circle' };
      default:
        return { bg: '#F3F4F6', text: '#4B5563', icon: 'help-circle' };
    }
  };

  const config = getStatusConfig();
  
  return (
    <View className={`px-3 py-1 rounded-full self-start flex-row items-center gap-1`} style={{ backgroundColor: config.bg }}>
      <Ionicons name={config.icon as any} size={14} color={config.text} />
      <Text className="text-sm font-medium" style={{ color: config.text }}>
        {status}
      </Text>
    </View>
  );
};

export default function RequestDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [request, setRequest] = useState<BloodRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadRequest();
    }
  }, [id]);

  const loadRequest = async () => {
    try {
      setLoading(true);
      const data = await bloodRequestService.getMyRequestById(id);
      setRequest(data);
    } catch (error) {
      console.error('Error loading request:', error);
      Alert.alert('Error', 'Failed to load request details');
    } finally {
      setLoading(false);
    }
  };

  const handleProvideFeedback = () => {
    router.push({
      pathname: "/(doctor)/screens/requestFeedback",
      params: { requestId: id }
    });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!request) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-600">Request not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-[#E31837]">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const bloodTypeDisplay = request.bloodGroup.replace('_', ' ');

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white px-4 pt-12 pb-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <Ionicons name="arrow-back" size={24} color={colors.textDark} />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">Request Details</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <View className="p-4">
        {/* Status Section */}
        <View className="bg-gray-50 rounded-xl p-4 mb-4">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-sm text-gray-500">Request ID</Text>
              <Text className="text-xs text-gray-400 mt-1">{request.id.slice(0, 8)}...</Text>
            </View>
            <StatusBadge status={request.status} />
          </View>
          <View className="flex-row justify-between mt-3">
            <Text className="text-sm text-gray-500">Created</Text>
            <Text className="text-sm text-gray-800">
              {new Date(request.createdAt).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Blood Requirements */}
        <View className="bg-gray-50 rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Blood Requirements</Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Blood Type</Text>
            <Text className="font-semibold text-gray-800">{bloodTypeDisplay}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Quantity</Text>
            <Text className="font-semibold text-gray-800">{request.unitsRequired} units</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Urgency</Text>
            <Text className={`font-semibold ${
              request.urgency === 'CRITICAL' ? 'text-red-600' : 
              request.urgency === 'URGENT' ? 'text-orange-600' : 'text-blue-600'
            }`}>
              {request.urgency}
            </Text>
          </View>
        </View>

        {/* Patient Information */}
        <View className="bg-gray-50 rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Patient Information</Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Name</Text>
            <Text className="font-medium text-gray-800">{request.patientName}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Age</Text>
            <Text className="font-medium text-gray-800">{request.patientAge} years</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Gender</Text>
            <Text className="font-medium text-gray-800">{request.patientGender}</Text>
          </View>
        </View>

        {/* Hospital Information */}
        <View className="bg-gray-50 rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Hospital Information</Text>
          <Text className="font-medium text-gray-800">{request.hospitalName}</Text>
          <Text className="text-gray-600 mt-1">{request.town}, {request.region}</Text>
          {request.medicalReason && (
            <View className="mt-3 pt-3 border-t border-gray-200">
              <Text className="text-gray-600 text-sm">Medical Reason</Text>
              <Text className="text-gray-800 mt-1">{request.medicalReason}</Text>
            </View>
          )}
        </View>

        {/* Responses Summary (if completed) */}
        {request.status === 'FULFILLED' && request.summary && (
          <View className="bg-green-50 rounded-xl p-4 mb-4">
            <Text className="text-lg font-semibold text-green-800 mb-3">Response Summary</Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-green-700">Donors Available</Text>
              <Text className="font-bold text-green-800">{request.summary.donorsAvailable}/{request.summary.donorsContacted}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-green-700">Blood Banks with Stock</Text>
              <Text className="font-bold text-green-800">{request.summary.bloodBanksAvailable}/{request.summary.bloodBanksContacted}</Text>
            </View>
          </View>
        )}

        {/* Feedback Button */}
        {request.status === 'FULFILLED' && (
          <TouchableOpacity
            onPress={handleProvideFeedback}
            className={`py-4 rounded-xl ${request.hasFeedback ? 'bg-gray-400' : 'bg-[#E31837]'}`}
            disabled={request.hasFeedback}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {request.hasFeedback ? 'Feedback Already Provided' : 'Provide Feedback'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}