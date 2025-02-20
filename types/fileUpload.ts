// types/fileUpload.ts
export interface FileUploadRequest {
  product_id: string;
  device_name: string;
  file: File
  imei?: string
}

export interface FileUploadResponse {
  code: number
  msg: string
  request_id: string
  data: {
    fid: string
  }
}
