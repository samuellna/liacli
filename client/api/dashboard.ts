const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

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
  const res = await fetch(`${API_URL}/`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch dashboard data");
  return res.json() as Promise<BackendDashboardData>;
}
