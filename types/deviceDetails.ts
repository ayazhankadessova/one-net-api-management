// types/devices.ts
import { Location, Other } from './common'

export interface QueryDevicesRequest {
  key_words?: string
  auth_info?: string
  tag?: string[]
  online?: boolean
  private?: boolean
  page?: number
  per_page?: number
  device_id?: string
  begin?: string
  end?: string
}

export interface Device {
  protocol: string
  create_time: string
  online: boolean
  id: string
  auth_info: string
  title: string
  desc?: string
  tags?: string[]
  location?: Location
  other?: Other
}

export interface QueryDevicesResponse {
  errno: number
  error: string
  data: {
    total_count: number
    page: number
    per_page: number
    devices: Device[]
  }
}
