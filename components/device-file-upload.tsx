// components/device-file-upload.tsx
'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Upload } from 'lucide-react'
import { FieldLabel } from '@/components/field-label'

interface Props {
  apiKey: string
}

export function DeviceFileUpload({ apiKey }: Props) {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [deviceId, setDeviceId] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Check file size (20MB = 20 * 1024 * 1024 bytes)
      if (file.size > 20 * 1024 * 1024) {
        alert('File size should not exceed 20MB.')
        return
      }
      setSelectedFile(file)
    }
  }

  const handleSubmit = async () => {
    if (!selectedFile || !deviceId) {
      alert('Please provide both a file and Device ID')
      return
    }

    setLoading(true)
    try {
      const submitFormData = new FormData()
      submitFormData.append('did', deviceId)
      submitFormData.append('file', selectedFile)

      const response = await fetch('/api/devices/file-upload', {
        method: 'POST',
        headers: {
          'api-key': apiKey,
        },
        body: submitFormData,
      })

      const data = await response.json()
      setResponse(data)
    } catch (error) {
      setResponse({
        code: -1,
        msg: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Device File</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <FieldLabel
                label='Device ID'
                required
                description='The ID of the device to upload the file to'
              />
              <Input
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                placeholder='Enter Device ID'
                required
              />
            </div>

            <div className='space-y-2'>
              <FieldLabel
                label='File'
                required
                description='Select a file to upload (max 20MB)'
              />
              <div className='flex items-center gap-4'>
                <Input type='file' onChange={handleFileChange} required />
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
            disabled={loading || !selectedFile || !deviceId}
          >
            {loading ? (
              'Uploading...'
            ) : (
              <>
                <Upload className='mr-2 h-4 w-4' /> Upload File
              </>
            )}
          </Button>

          {response && (
            <div className='space-y-4'>
              {response.code === 0 ? (
                <Alert>
                  <AlertDescription className='space-y-2'>
                    <p className='font-medium text-green-600'>
                      File uploaded successfully!
                    </p>
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
