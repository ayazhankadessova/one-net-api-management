import { Location, Other, ApiResponse } from './common'

export interface NewEquipmentRequest {
  title: string // required
  desc?: string // optional
  tags?: string[] // optional
  location?: Location // optional
  private?: boolean // optional, default true
  auth_info?: string // optional
  other?: Other // optional
}

export interface NewEquipmentResponse extends ApiResponse {
  data: {
    device_id: string
  }
}