// types/fileUpload.ts
export interface FileUploadRequest {
  did: string
  file: File
}

export interface FileUploadResponse {
  code: number
  msg: string
  request_id: string
  data: {
    fid: string
  }
}
