import { Location, Other } from './common'

export interface UpdateEquipmentRequest {
  device_id: string // required in URL
  title?: string // optional
  desc?: string // optional
  tags?: string[] // optional
  location?: Location // optional
  private?: boolean // optional
  auth_info?: string // optional
  other?: Other // optional
}

// export interface UpdateEquipmentResponse extends ApiResponse {
//   // No additional fields for update response
// }
