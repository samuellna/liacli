import axios from "axios";
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
    const baseURL =
      typeof window === "undefined"
        ? process.env.API_URL // server-side: usa rede interna do Docker
        : process.env.NEXT_PUBLIC_API_URL; // client-side: usa pelo browser
    console.log("Fetching dashboard data from:", baseURL);

    const data = await axios.get<BackendDashboardData>("/", { baseURL });
    return data.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}
