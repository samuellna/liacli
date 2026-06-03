import api from "./axios";
import type { ResearchProject } from "./types";

export interface CreateResearchProjectData {
  researcherId: number;
  title: string;
  course: string;
  researchLab: string;
  animalSpecies: string;
  totalAnimals: number;
  expectedShipments: number;
  preferredDate: string;
  examTypeIds: number[];
}

export type UpdateResearchProjectData = Partial<
  Omit<CreateResearchProjectData, "researcherId">
>;

export async function findAllProjects(): Promise<ResearchProject[]> {
  const response = await api.get<ResearchProject[]>("/researcher-projects");
  return response.data;
}

export async function findProjectsByResearcher(
  researcherId: number,
): Promise<ResearchProject[]> {
  const response = await api.get<ResearchProject[]>(
    `/researcher-projects/by-researcher/${researcherId}`,
  );
  return response.data;
}

export async function findProjectById(id: number): Promise<ResearchProject> {
  const response = await api.get<ResearchProject>(`/researcher-projects/${id}`);
  return response.data;
}

export async function createProject(
  data: CreateResearchProjectData,
): Promise<ResearchProject> {
  const response = await api.post<ResearchProject>("/researcher-projects", data);
  return response.data;
}

export async function updateProject(
  id: number,
  data: UpdateResearchProjectData,
): Promise<ResearchProject> {
  const response = await api.patch<ResearchProject>(
    `/researcher-projects/${id}`,
    data,
  );
  return response.data;
}

export async function deleteProject(id: number): Promise<void> {
  await api.delete(`/researcher-projects/${id}`);
}
