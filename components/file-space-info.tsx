// components/file-space-info.tsx
'use client'
import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuthProps } from '@/types/common'

// Match the actual API response structure
interface FileSpaceResponse {
  code: number
  msg: string
  request_id: string
  data: {
    use_size: number // Changed from useSize
    has_size: number // Changed from hasSize
    total_size: number // Changed from totalSize
  } | null
}

export function FileSpaceInfo({ auth }: { auth: AuthProps }) {
  const { version, token, apiKey } = auth
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<FileSpaceResponse | null>(null)

  const fetchFileSpace = async () => {
    setLoading(true)
    try {
      const headers: Record<string, string> = {}
      if (version === 'v2' && token) {
        headers.Authorization = token
      } else if (version === 'v1' && apiKey) {
        headers['api-key'] = apiKey
      }

      const response = await fetch('/api/devices/file-space', {
        headers,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setData(data)
    } catch (error) {
      console.error('Error fetching file space:', error)
      setData({
        code: 500,
        msg: error instanceof Error ? error.message : 'An error occurred',
        request_id: '',
        data: null,
      })
    }
    setLoading(false)
  }

  // Convert bytes to MB with 2 decimal places
  const bytesToMB = (bytes: number) => (bytes / (1024 * 1024)).toFixed(2)

  return (
    <Card>
      <CardHeader>
        <CardTitle>File Storage Space</CardTitle>
      </CardHeader>
      <CardContent>
        {version == 'v1' ? (
          <div className='space-y-4'>
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>
                {'This service is not supported by legacy version.'}
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className='space-y-4'>
            <Button onClick={fetchFileSpace} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh Storage Info'}
            </Button>
            {data && (
              <>
                {data.code === 0 && data.data ? (
                  <div className='space-y-2'>
                    <div className='grid grid-cols-3 gap-4'>
                      <div className='p-4 bg-slate-100 rounded-lg'>
                        <p className='text-sm text-muted-foreground'>
                          Used Space
                        </p>
                        <p className='text-2xl font-bold'>
                          {bytesToMB(data.data.use_size)} MB
                        </p>
                      </div>
                      <div className='p-4 bg-slate-100 rounded-lg'>
                        <p className='text-sm text-muted-foreground'>
                          Available Space
                        </p>
                        <p className='text-2xl font-bold'>
                          {bytesToMB(data.data.has_size)} MB
                        </p>
                      </div>
                      <div className='p-4 bg-slate-100 rounded-lg'>
                        <p className='text-sm text-muted-foreground'>
                          Total Space
                        </p>
                        <p className='text-2xl font-bold'>
                          {bytesToMB(data.data.total_size)} MB
                        </p>
                      </div>
                    </div>
                    <div className='w-full bg-slate-200 rounded-full h-2.5'>
                      <div
                        className='bg-blue-600 h-2.5 rounded-full'
                        style={{
                          width: `${
                            (data.data.use_size / data.data.total_size) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <Alert variant='destructive'>
                    <AlertCircle className='h-4 w-4' />
                    <AlertDescription>{data.msg}</AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
