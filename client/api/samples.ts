import axios from "axios";
import api from "./axios";
import type { Sample } from "./types";

export interface CreateSampleData {
  researchProjectId: number;
  animalsInThisShipment: number;
  scheduledAt: string;
}

export interface ApproveSampleData {
  approved: boolean;
  employeeId: number;
  decisionReason?: string;
}

export async function findAllSamples(): Promise<Sample[]> {
  const response = await api.get<Sample[]>("/samples");
  return response.data;
}

export async function findActiveScheduledDates(): Promise<string[]> {
  const response = await api.get<string[]>("/samples/scheduled/active");
  return response.data;
}

export async function findSampleById(id: number): Promise<Sample> {
  const response = await api.get<Sample>(`/samples/${id}`);
  return response.data;
}

export async function findSampleByProtocol(
  protocol: string,
): Promise<Sample | null> {
  const baseURL =
    typeof window === "undefined"
      ? process.env.API_URL // server-side: usa rede interna do Docker
      : process.env.NEXT_PUBLIC_API_URL; // client-side: usa pelo browser

  const response = await axios.get<Sample>(`/samples/protocol/${protocol}`, {
    baseURL,
  });
  return response.data;
}

export async function createSample(data: CreateSampleData): Promise<Sample> {
  const response = await api.post<Sample>("/samples", data);
  return response.data;
}

export async function updateSampleStatus(
  id: number,
  status: string,
): Promise<Sample> {
  const response = await api.patch<Sample>(`/samples/${id}/status`, { status });
  return response.data;
}

export async function approveSample(
  id: number,
  data: ApproveSampleData,
): Promise<Sample> {
  const response = await api.patch<Sample>(`/samples/approve/${id}`, data);
  return response.data;
}

export async function deleteSample(id: number): Promise<void> {
  await api.delete(`/samples/${id}`);
}
