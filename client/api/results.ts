import api from './axios'
import type { SampleResult } from './types'

export interface CreateSampleResultData {
  sampleId: number
  resultData: Record<string, unknown>
}

export async function createSampleResult(
  data: CreateSampleResultData,
): Promise<SampleResult> {
  const response = await api.post<SampleResult>('/results', data)
  return response.data
}

export async function findResultByProtocol(
  protocol: string,
): Promise<SampleResult> {
  const response = await api.get<SampleResult>(`/results/${protocol}`)
  return response.data
}