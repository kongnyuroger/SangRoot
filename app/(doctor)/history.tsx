import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../src/constants/theme";
import { bloodRequestService, BloodRequest } from "../../src/services/blood-request.service";

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'FULFILLED':
        return { bg: '#DCFCE7', text: '#166534', icon: 'checkmark-circle', label: 'Fulfilled' };
      case 'IN_PROGRESS':
        return { bg: '#DBEAFE', text: '#1E40AF', icon: 'time', label: 'In Progress' };
      case 'PENDING':
        return { bg: '#FEF3C7', text: '#92400E', icon: 'hourglass', label: 'Pending' };
      case 'CANCELLED':
        return { bg: '#FEE2E2', text: '#991B1B', icon: 'close-circle', label: 'Cancelled' };
      case 'EXPIRED':
        return { bg: '#F3F4F6', text: '#4B5563', icon: 'alert-circle', label: 'Expired' };
      default:
        return { bg: '#F3F4F6', text: '#4B5563', icon: 'help-circle', label: status };
    }
  };

  const config = getStatusConfig();
  
  return (
    <View className={`px-2 py-1 rounded-full flex-row items-center gap-1`} style={{ backgroundColor: config.bg }}>
      <Ionicons name={config.icon as any} size={12} color={config.text} />
      <Text className="text-xs font-medium" style={{ color: config.text }}>
        {config.label}
      </Text>
    </View>
  );
};

// Urgency badge component
const UrgencyBadge = ({ urgency }: { urgency: string }) => {
  const getUrgencyConfig = () => {
    switch (urgency) {
      case 'CRITICAL':
        return { bg: '#FEE2E2', text: '#DC2626', icon: 'alert-circle', label: 'Critical' };
      case 'URGENT':
        return { bg: '#FFEDD5', text: '#EA580C', icon: 'warning', label: 'Urgent' };
      default:
        return { bg: '#EFF6FF', text: '#2563EB', icon: 'information-circle', label: 'Routine' };
    }
  };

  const config = getUrgencyConfig();
  
  return (
    <View className={`px-2 py-1 rounded-full flex-row items-center gap-1`} style={{ backgroundColor: config.bg }}>
      <Ionicons name={config.icon as any} size={12} color={config.text} />
      <Text className="text-xs font-medium" style={{ color: config.text }}>
        {config.label}
      </Text>
    </View>
  );
};

// Request card component
const RequestCard = ({ request, onPress }: { request: BloodRequest; onPress: () => void }) => {
  const getBloodTypeColor = (bloodType: string) => {
    const colors: Record<string, string> = {
      'O_NEGATIVE': '#DC2626',
      'O_POSITIVE': '#DC2626',
      'A_NEGATIVE': '#059669',
      'A_POSITIVE': '#059669',
      'B_NEGATIVE': '#7C3AED',
      'B_POSITIVE': '#7C3AED',
      'AB_NEGATIVE': '#D97706',
      'AB_POSITIVE': '#D97706',
    };
    return colors[bloodType] || '#6B7280';
  };

  const bloodTypeDisplay = request.bloodGroup.replace('_', ' ');

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
      activeOpacity={0.7}
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-row items-center gap-2">
          <View
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: getBloodTypeColor(request.bloodGroup) + '20' }}
          >
            <Text className="font-bold text-sm" style={{ color: getBloodTypeColor(request.bloodGroup) }}>
              {bloodTypeDisplay}
            </Text>
          </View>
          <View>
            <Text className="font-semibold text-gray-800">{request.unitsRequired} units needed</Text>
            <Text className="text-xs text-gray-500">{request.timeAgo || request.formattedDate}</Text>
          </View>
        </View>
        <StatusBadge status={request.status} />
      </View>

      <View className="flex-row justify-between items-center mt-2">
        <View className="flex-1">
          <Text className="text-sm text-gray-600">Patient: {request.patientName}, {request.patientAge}y</Text>
          <Text className="text-sm text-gray-600">{request.hospitalName}</Text>
        </View>
        <UrgencyBadge urgency={request.urgency} />
      </View>

      {request.summary && request.status === 'FULFILLED' && (
        <View className="mt-3 pt-3 border-t border-gray-100 flex-row justify-between">
          <View className="flex-row items-center gap-1">
            <Ionicons name="people-outline" size={14} color={colors.neutralGray} />
            <Text className="text-xs text-gray-500">
              {request.summary.donorsAvailable}/{request.summary.donorsContacted} donors
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Ionicons name="business-outline" size={14} color={colors.neutralGray} />
            <Text className="text-xs text-gray-500">
              {request.summary.bloodBanksAvailable}/{request.summary.bloodBanksContacted} banks
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

// Empty state component
const EmptyState = ({ onRefresh }: { onRefresh: () => void }) => (
  <View className="flex-1 justify-center items-center py-12">
    <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
      <Ionicons name="document-text-outline" size={40} color={colors.neutralGray} />
    </View>
    <Text className="text-lg font-semibold text-gray-700 mb-2">No requests yet</Text>
    <Text className="text-sm text-gray-500 text-center px-8 mb-6">
      You haven't made any blood requests. Tap the Request tab to create one.
    </Text>
    <TouchableOpacity
      onPress={onRefresh}
      className="bg-[#E31837] px-6 py-3 rounded-xl"
    >
      <Text className="text-white font-medium">Refresh</Text>
    </TouchableOpacity>
  </View>
);

// Filter chips component
const FilterChips = ({ selectedFilter, onFilterChange }: { selectedFilter: string; onFilterChange: (filter: string) => void }) => {
  const filters = [
    { id: 'ALL', label: 'All' },
    { id: 'PENDING', label: 'Pending' },
    { id: 'IN_PROGRESS', label: 'In Progress' },
    { id: 'FULFILLED', label: 'Fulfilled' },
    { id: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
      <View className="flex-row gap-2 px-4">
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            onPress={() => onFilterChange(filter.id)}
            className={`px-4 py-2 rounded-full ${
              selectedFilter === filter.id
                ? 'bg-[#E31837]'
                : 'bg-gray-100'
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                selectedFilter === filter.id ? 'text-white' : 'text-gray-600'
              }`}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default function HistoryScreen() {
  const router = useRouter();
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const loadRequests = async (page: number = 1, filter: string = selectedFilter) => {
    try {
      setLoading(true);
      const response = await bloodRequestService.getMyRequests(page, 10, filter);
      setRequests(response.data);
      setPagination({
        page: response.meta.page,
        totalPages: response.meta.totalPages,
        hasNextPage: response.meta.hasNextPage,
        hasPrevPage: response.meta.hasPrevPage,
      });
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRequests(1, selectedFilter);
    }, [selectedFilter])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadRequests(1, selectedFilter);
  }, [selectedFilter]);

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    loadRequests(1, filter);
  };

  const handleRequestPress = (requestId: string) => {
    router.push({
      pathname: "/_screens/request-detail",
      params: { id: requestId }
    });
  };

  const loadMore = () => {
    if (pagination.hasNextPage && !loading) {
      loadRequests(pagination.page + 1, selectedFilter);
    }
  };

  if (loading && requests.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="mt-4 text-gray-600">Loading requests...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 pt-12 pb-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">Blood Requests</Text>
        <Text className="text-sm text-gray-500 mt-1">
          View all your blood requests and their status
        </Text>
      </View>

      {/* Filters */}
      <FilterChips selectedFilter={selectedFilter} onFilterChange={handleFilterChange} />

      {/* Requests List */}
      {requests.length === 0 ? (
        <EmptyState onRefresh={onRefresh} />
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RequestCard
              request={item}
              onPress={() => handleRequestPress(item.id)}
            />
          )}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            pagination.hasNextPage ? (
              <View className="py-4">
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}