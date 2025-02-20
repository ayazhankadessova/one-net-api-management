// components/device-file-upload.tsx
'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Upload } from 'lucide-react'
import { FieldLabel } from '@/components/field-label'
import { FileUploadRequest, FileUploadResponse } from '@/types/fileUpload'

interface Props {
  apiKey: string
}

export function DeviceFileUpload({ apiKey }: Props) {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<FileUploadResponse | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState<Omit<FileUploadRequest, 'file'>>({
    product_id: '',
    device_name: '',
    imei: undefined
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Check file type
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/bmp',
        'image/gif',
        'image/webp',
        'image/tiff',
        'text/plain',
      ]
      if (!allowedTypes.includes(file.type)) {
        alert(
          'Unsupported file type. Please upload .jpg, .jpeg, .png, .bmp, .gif, .webp, .tiff, or .txt files.'
        )
        return
      }
      // Check file size (20MB = 20 * 1024 * 1024 bytes)
      if (file.size > 20 * 1024 * 1024) {
        alert('File size should not exceed 20MB.')
        return
      }
      setSelectedFile(file)
    }
  }

  const handleSubmit = async () => {
    if (
      !selectedFile ||
      (!formData.product_id && !formData.device_name)
    ) {
      alert(
        'Please provide a file and at least one identifier (Product ID, Device Name, or IMEI)'
      )
      return
    }

    setLoading(true)
    try {
      const submitFormData = new FormData()
      if (selectedFile) {
        submitFormData.append('file', selectedFile)
      }
      if (formData.product_id)
        submitFormData.append('product_id', formData.product_id)
      if (formData.device_name)
        submitFormData.append('device_name', formData.device_name)

      const response = await fetch('/api/devices/file-upload', {
        method: 'POST',
        body: submitFormData,
      })

      const data = await response.json()
      setResponse(data)
    } catch (error) {
      setResponse({
        code: -1,
        msg: error instanceof Error ? error.message : 'An error occurred',
        request_id: '',
        data: { fid: '' },
      })
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Device File</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {/* Device Identifiers */}
          <div className='space-y-4'>
            <div className='space-y-2'>
              <FieldLabel
                label='Product ID'
                description='Product ID (req)'
              />
              <Input
                value={formData.product_id}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    product_id: e.target.value,
                  }))
                }
                placeholder='Enter product ID'
              />
            </div>

            <div className='space-y-2'>
              <FieldLabel
                label='Device Name'
                description='Device Name (required if Product ID and IMEI not provided)'
              />
              <Input
                value={formData.device_name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    device_name: e.target.value,
                  }))
                }
                placeholder='Enter Device Name'
              />
            </div>

            {/* File Upload */}
            <div className='space-y-2'>
              <FieldLabel
                label='File'
                required
                description='Supported formats: .jpg, .jpeg, .png, .bmp, .gif, .webp, .tiff, .txt (max 20MB)'
              />
              <div className='flex items-center gap-4'>
                <Input
                  type='file'
                  onChange={handleFileChange}
                  accept='.jpg,.jpeg,.png,.bmp,.gif,.webp,.tiff,.txt'
                />
                {selectedFile && (
                  <span className='text-sm text-muted-foreground'>
                    {selectedFile.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Button
            className='w-full'
            onClick={handleSubmit}
            disabled={loading || !selectedFile}
          >
            {loading ? (
              'Uploading...'
            ) : (
              <>
                <Upload className='mr-2 h-4 w-4' /> Upload File
              </>
            )}
          </Button>

          {/* Response */}
          {response && (
            <div className='space-y-4'>
              {response.code === 0 ? (
                <Alert>
                  <AlertDescription className='space-y-2'>
                    <p className='font-medium text-green-600'>
                      File uploaded successfully!
                    </p>
                    <p>File ID: {response.data.fid}</p>
                    <p>Request ID: {response.request_id}</p>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant='destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertDescription>{response.msg}</AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
