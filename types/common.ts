export interface Location {
  lon: number | null
  lat: number | null
}

export type Other = Record<string, string>;

export interface ApiResponse {
  errno: number
  error: string
  data?: {
    device_id?: string
  }
}

export type AuthProps = {
  version: 'v1' | 'v2'
  apiKey?: string
  token?: string
}
