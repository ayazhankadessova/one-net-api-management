export interface Location {
  lon: number | null
  lat: number | null
}

export interface Other {
  version: string
  manufacturer: string
}

export interface ApiResponse {
  errno: number
  error: string
  data?: {
    device_id?: string
  }
}
