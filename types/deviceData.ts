// types/deviceData.ts
export interface DeviceDataRequest {
  datastream_id?: string
  start?: string
  end?: string
  duration?: number
  limit?: number
  cursor?: string
  sort?: 'DESC' | 'ASC'
}

interface Datapoint {
  at: string
  value: string | number
}

interface Datastream {
  id: string
  datapoints: Datapoint[]
}

export interface DeviceDataResponse {
  errno: number
  error: string
  data: {
    count: string
    cursor?: string
    datastreams: Datastream[]
  }
}
