import api, { safeRequest } from "../lib/api";
import type {
  CreateFeedbackDto,
  FeedbackListResponse,
  FeedbackResponse,
  FeedbackStats,
} from "../types/feedback.types";

export const feedbackService = {
  // Create or update feedback for a blood request
  createOrUpdate: async (
    data: CreateFeedbackDto,
  ): Promise<FeedbackResponse> => {
    return safeRequest(
      api.post("feedback", { json: data }).json<FeedbackResponse>(),
    );
  },

  // Get feedback for a specific request
  getByRequestId: async (
    requestId: string,
  ): Promise<FeedbackResponse | null> => {
    return safeRequest(
      api.get(`feedback/request/${requestId}`).json<FeedbackResponse | null>(),
    );
  },

  // Get all feedback for the current doctor
  getAll: async (
    page: number = 1,
    limit: number = 20,
  ): Promise<FeedbackListResponse> => {
    return safeRequest(
      api
        .get(`feedback/my-feedback`, {
          searchParams: { page: String(page), limit: String(limit) },
        })
        .json<FeedbackListResponse>(),
    );
  },

  // Get feedback statistics
  getStats: async (): Promise<FeedbackStats> => {
    return safeRequest(api.get("feedback/stats").json<FeedbackStats>());
  },
};
