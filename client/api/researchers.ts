import api from "./axios";
import type { Researcher } from "./types";

export enum ResearchLevel {
  SCIENTIFIC_INITIATION = "SCIENTIFIC_INITIATION",
  MASTERS = "MASTERS",
  DOCTORATE = "DOCTORATE",
  POST_DOCTORATE = "POST_DOCTORATE",
  OTHER = "OTHER",
}

export interface CreateResearcherData {
  name: string;
  email: string;
  institution: string;
  phone?: string;
  advisorName?: string;
  level?: ResearchLevel;
}

export type UpdateResearcherData = Partial<CreateResearcherData>;

export async function findAllResearchers(): Promise<Researcher[]> {
  const response = await api.get<Researcher[]>("/researchers");
  return response.data;
}

export async function findResearcherById(id: number): Promise<Researcher> {
  const response = await api.get<Researcher>(`/researchers/${id}`);
  return response.data;
}

export async function createResearcher(
  data: CreateResearcherData,
): Promise<Researcher> {
  const response = await api.post<Researcher>("/researchers", data);
  return response.data;
}

export async function updateResearcher(
  id: number,
  data: UpdateResearcherData,
): Promise<Researcher> {
  const response = await api.patch<Researcher>(`/researchers/${id}`, data);
  return response.data;
}

export async function deleteResearcher(id: number): Promise<void> {
  await api.delete(`/researchers/${id}`);
}
