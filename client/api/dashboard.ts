import api from "./axios";

export interface BackendDashboardData {
  samples: {
    inAnalysis: number;
    pendingApproval: number;
    approvedPendingCollection: number;
    finished: number;
  };
  pendingApproval: {
    protocol: string;
    researcher: string;
    date: string;
    firstTime: boolean;
  }[];
}

export async function fetchDashboard(): Promise<BackendDashboardData> {
  try {
    const data = await api.get<BackendDashboardData>("/");
    return data.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}
