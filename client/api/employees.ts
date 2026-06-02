import api from './axios'
import type { Employee } from './types'

export interface CreateEmployeeData {
  name: string
  email: string
  password: string
  role: string
}

export type UpdateEmployeeData = Partial<CreateEmployeeData>

export async function findAllEmployees(): Promise<Employee[]> {
  const response = await api.get<Employee[]>('/employees')
  return response.data
}

export async function findEmployeeById(id: number): Promise<Employee> {
  const response = await api.get<Employee>(`/employees/${id}`)
  return response.data
}

export async function createEmployee(
  data: CreateEmployeeData,
): Promise<Employee> {
  const response = await api.post<Employee>('/employees', data)
  return response.data
}

export async function updateEmployee(
  id: number,
  data: UpdateEmployeeData,
): Promise<Employee> {
  const response = await api.patch<Employee>(`/employees/${id}`, data)
  return response.data
}

export async function deleteEmployee(id: number): Promise<void> {
  await api.delete(`/employees/${id}`)
}