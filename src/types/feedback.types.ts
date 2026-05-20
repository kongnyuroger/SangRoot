// Types for feedback system

export interface CreateFeedbackDto {
  requestId: string;
  responseAccuracy?: number; // 1-5
  responseSpeed?: number; // 1-5
  communication?: number; // 1-5
  overallRating?: number; // 1-5
  comments?: string;
  whatWorked?: string;
  whatNeedsImprovement?: string;
}

export interface FeedbackResponse {
  id: string;
  requestId: string;
  doctorId: string;
  responseAccuracy?: number;
  responseSpeed?: number;
  communication?: number;
  overallRating?: number;
  comments?: string;
  whatWorked?: string;
  whatNeedsImprovement?: string;
  agentResponseSummary: {
    bloodType: string;
    quantity: number;
    urgency: string;
    status: string;
    completedAt: string | null;
    donorSummary: {
      total: number;
      available: number;
    };
    bloodBankSummary: {
      total: number;
      available: number;
    };
  };
  status: string;
  createdAt: string;
  updatedAt: string;
  request: {
    id: string;
    bloodType: string;
    quantity: number;
    urgency: string;
    status: string;
    createdAt: string;
    completedAt: string | null;
  };
}

export interface FeedbackStats {
  total: number;
  avgOverall: number;
  avgAccuracy: number;
  avgSpeed: number;
  avgCommunication: number;
}

export interface FeedbackListResponse {
  data: FeedbackResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
