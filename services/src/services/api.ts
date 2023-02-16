import axiosInstance from "__mocks"
import { removeEmptyProps } from "utils/object"

export const apiUrl = process.env.REACT_APP_API_URL

export const apiEndpoint = {
  // User
  GET_USER: '/user',
  LOGIN: '/login',
  // Project
  GET_PROJECTS: '/projects',
}

export async function fetchProjects(params: { keyword: string, status: string }) {
  const formatedParams = removeEmptyProps(params)
  const res = await axiosInstance.get(apiUrl + '/projects', { params: formatedParams }).then(res => res.data)
  return res.data
}

export async function fetchProjectByIdOrName(id: string | undefined) {
  const res = await axiosInstance.get(apiUrl + `/projects/${id}`).then(res => res.data)
  return res.data
}

export async function createProject(data: any) {
  const res = await axiosInstance.post(apiUrl + '/projects', data).then(res => res.data)
  return res
}

export async function updateProject(id: string | undefined, data: any) {
  const res = await axiosInstance.put(apiUrl + `/projects/${id}`, data).then(res => res.data)
  return res
}

export async function deleteProject(id: number | string | null) {
  const res = await axiosInstance.delete(apiUrl + `/projects/${id}`).then(res => res.data)
  return res
}

export async function fetchMembers(params?: any) {
  const res = await axiosInstance.get(apiUrl + '/members', params).then(res => res.data)
  return res
}
