import api from "./axios";
import type { ExamType, ParameterGroups } from "./types";

export interface CreateExamTypeData {
  name: string;
  description: string;
  material?: string;
  observations?: string;
  groups?: ParameterGroups[];
}

export type UpdateExamTypeData = Partial<CreateExamTypeData>;

export async function findAllExamTypes(): Promise<ExamType[]> {
  const response = await api.get<ExamType[]>("/exams");
  return response.data;
}

export async function findExamTypeById(id: number): Promise<ExamType> {
  const response = await api.get<ExamType>(`/exams/${id}`);
  return response.data;
}

export async function findExamTypeByName(name: string): Promise<ExamType> {
  const response = await api.get<ExamType>(`/exams/search?name=${name}`);
  return response.data;
}

export async function createExamType(
  data: CreateExamTypeData,
): Promise<ExamType> {
  const response = await api.post<ExamType>("/exams", data);
  return response.data;
}

export async function updateExamType(
  id: number,
  data: UpdateExamTypeData,
): Promise<ExamType> {
  const response = await api.patch<ExamType>(`/exams/${id}`, data);
  return response.data;
}

export async function deleteExamType(id: number): Promise<void> {
  await api.delete(`/exams/${id}`);
}
