export interface BloodRequest {
  id: string;
  bloodType: string;
  quantity: number;
  urgency: string;
  status: string;
  createdAt: string;
  doctorId: string;
  hospitalId: string;
}

class BloodRequestService {
  // ... existing methods ...

  async getRequestById(id: string): Promise<BloodRequest> {
    const response = await api.get(`/blood-requests/${id}`);
    return response.data;
  }
}
