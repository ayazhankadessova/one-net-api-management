interface Location {
  lon: number | null
  lat: number | null
}

interface Other {
  version: string
  manufacturer: string
}

interface BaseEquipmentData {
  title: string
  desc: string
  tags: string[]
  location: Location
  auth_info: string
  private: boolean
  other: Other
}

interface UpdateEquipmentData extends BaseEquipmentData {
  device_id: string
}

export interface ApiEndpoint {
  id: 'new-equipment' | 'update-equipment'
  name: string
  method: 'POST' | 'PUT'
  url: string
  defaultBody: BaseEquipmentData
}

export interface FormData {
  'new-equipment': BaseEquipmentData
  'update-equipment': UpdateEquipmentData
}

export interface ApiResponse {
  errno?: number
  error?: string
  data?: {
    device_id?: string
  }
}
