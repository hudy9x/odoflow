const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

console.log('process.env.NEXT_PUBLIC_API_URL API services:', process.env.NEXT_PUBLIC_API_URL)


export type ApiResponse<T> = {
  success: boolean;
  error?: string;
} & T

export const getAuthToken = () => {
  try {
    const data = localStorage.getItem('auth')
    if (!data) return null
    const parsed = JSON.parse(data)
    return parsed?.data?.token || null
  } catch (err) {
    console.error('Error parsing auth token:', err)
    return null
  }
}

const getUserId = () => {
  try {
    const data = localStorage.getItem('auth')
    if (!data) return null
    const parsed = JSON.parse(data)
    return parsed?.data?.id || null
  } catch (err) {
    console.error('Error parsing user ID:', err)
    return null
  }
}

const checkAuth = () => {
  const token = getAuthToken()
  const userId = getUserId()
  
  if (!token || !userId) {
    throw new Error('Authentication required')
  }
  
  return { token, userId }
}

const createHeaders = (token: string, additionalHeaders: HeadersInit = {}) => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...additionalHeaders
  }
}

export async function get<T>(endpoint: string, headers: HeadersInit = {}): Promise<ApiResponse<T>> {
  const { token } = checkAuth()
  const response = await fetch(`${API_URL}/api${endpoint}`, {
    headers: createHeaders(token, headers)
  })
  return response.json()
}

export async function post<T>(endpoint: string, body: Record<string, unknown>, headers: HeadersInit = {}): Promise<ApiResponse<T>> {
  const { token } = checkAuth()
  const response = await fetch(`${API_URL}/api${endpoint}`, {
    method: 'POST',
    headers: createHeaders(token, headers),
    body: JSON.stringify(body)
  })
  return response.json()
}

export async function put<T>(endpoint: string, body: Record<string, unknown>, headers: HeadersInit = {}): Promise<ApiResponse<T>> {
  const { token } = checkAuth()
  const response = await fetch(`${API_URL}/api${endpoint}`, {
    method: 'PUT',
    headers: createHeaders(token, headers),
    body: JSON.stringify(body)
  })
  return response.json()
}

export async function del<T>(endpoint: string, headers: HeadersInit = {}): Promise<ApiResponse<T>> {
  const { token } = checkAuth()
  const response = await fetch(`${API_URL}/api${endpoint}`, {
    method: 'DELETE',
    headers: createHeaders(token, headers)
  })
  return response.json()
}
