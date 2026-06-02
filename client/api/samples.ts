import api from './axios'
import type { Sample, SampleStatus } from './types'

export interface CreateSampleData {
  examTypeId: number
  researcherId: number
  scheduledAt: string
}

export interface ApproveSampleData {
  approved: boolean
  employeeId: number
}

export async function findAllSamples(): Promise<Sample[]> {
  const response = await api.get<Sample[]>('/samples')
  return response.data
}

export async function findSampleById(id: number): Promise<Sample> {
  const response = await api.get<Sample>(`/samples/${id}`)
  return response.data
}

export async function findSampleByProtocol(
  protocol: string,
): Promise<Sample> {
  const response = await api.get<Sample>(`/samples/protocol/${protocol}`)
  return response.data
}

export async function createSample(
  data: CreateSampleData,
): Promise<Sample> {
  const response = await api.post<Sample>('/samples', data)
  return response.data
}

export async function updateSampleStatus(
  id: number,
  status: SampleStatus,
): Promise<Sample> {
  const response = await api.patch<Sample>(`/samples/${id}`, { status })
  return response.data
}

export async function approveSample(
  id: number,
  data: ApproveSampleData,
): Promise<Sample> {
  const response = await api.patch<Sample>(`/samples/approve/${id}`, data)
  return response.data
}

export async function deleteSample(id: number): Promise<void> {
  await api.delete(`/samples/${id}`)
}