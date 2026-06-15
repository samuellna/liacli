import api from "./axios";
import type { SampleResult } from "./types";

export interface CreateSampleResultData {
  sampleId: number;
  examTypeId: number;
  resultData: Record<string, unknown>;
  observations?: string;
}

export async function createSampleResult(
  data: CreateSampleResultData,
): Promise<SampleResult> {
  const response = await api.post<SampleResult>("/results", data);
  return response.data;
}

export async function findResultsByProtocol(
  protocol: string,
): Promise<SampleResult[]> {
  const response = await api.get<SampleResult[]>(`/results/${protocol}`);
  return response.data;
}

export async function findAllResults(): Promise<SampleResult[]> {
  const response = await api.get<SampleResult[]>(`/results?unique=true`);
  return response.data;
}

export async function validateResult(id: number): Promise<void> {
  await api.patch(`/results/${id}`);
}

export async function findResultsBySampleId(
  sampleId: number,
): Promise<SampleResult[]> {
  const response = await api.get<SampleResult[]>(`/results/sample/${sampleId}`);
  return response.data;
}

export async function validateAllResultsBySample(
  sampleId: number,
): Promise<void> {
  await api.patch(`/results/validate-sample/${sampleId}`);
}

export async function rejectSampleResults(sampleId: number): Promise<void> {
  await api.patch(`/results/reject-sample/${sampleId}`);
}
