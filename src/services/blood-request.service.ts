import api, { safeRequest } from "../lib/api";

export interface BloodRequest {
  id: string;
  bloodGroup: string;
  unitsRequired: number;
  urgency: string;
  status: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  hospitalName: string;
  region: string;
  town: string;
  requiredBy: string;
  medicalReason?: string;
  createdAt: string;
  updatedAt: string;
  summary?: {
    donorsContacted: number;
    donorsAvailable: number;
    bloodBanksContacted: number;
    bloodBanksAvailable: number;
    hasFeedback: boolean;
  };
  formattedDate?: string;
  formattedTime?: string;
  timeAgo?: string;
}

export interface BloodRequestResponse {
  data: BloodRequest[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface BloodRequestDetail extends BloodRequest {
  donorResponses?: Array<{
    availability: string;
    donor: {
      id: string;
      name: string;
      bloodGroup: string;
    };
  }>;
  bloodBankResponses?: Array<{
    available: boolean;
    unitsAvailable: number;
    bloodBank: {
      id: string;
      name: string;
      phone?: string;
    };
  }>;
  hasFeedback: boolean;
  feedback?: {
    id: string;
    overallRating: number;
    createdAt: string;
  };
}

export const bloodRequestService = {
  // Get all requests for the logged-in doctor
  getMyRequests: async (
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<BloodRequestResponse> => {
    const params: any = { page, limit };
    if (status && status !== 'ALL') {
      params.status = status;
    }
    return safeRequest(
      api.get('blood-requests/my-requests', { searchParams: params }).json<BloodRequestResponse>()
    );
  },

  // Get a specific request by ID
  getMyRequestById: async (id: string): Promise<BloodRequestDetail> => {
    return safeRequest(
      api.get(`blood-requests/my-requests/${id}`).json<BloodRequestDetail>()
    );
  },

  // Get progress for a request
  getProgress: async (id: string): Promise<any> => {
    return safeRequest(
      api.get(`blood-requests/${id}/progress`).json<any>()
    );
  },
};