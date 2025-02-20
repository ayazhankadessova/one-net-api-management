// types/updateEquipmentV2.ts
export interface UpdateEquipmentV2Request {
  product_id: string
  device_name?: string
  imei?: string
  imsi?: string
  psk?: string
  auth_code?: string
  desc?: string
  lat?: string
  lon?: string
}

export interface UpdateEquipmentV2Response {
  code: number
  msg: string
  request_id: string
  data: {
    did: number | string
    pid: string
    device_name: string
    imei?: string
  }
}
