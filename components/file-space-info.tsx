// components/file-space-info.tsx
'use client'

import React, { useState} from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FileSpaceResponse {
  code: number
  msg: string
  request_id: string
  data: {
    useSize: number
    hasSize: number
    totalSize: number
  } | null
}

export function FileSpaceInfo() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<FileSpaceResponse | null>(null)

  const fetchFileSpace = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/devices/file-space')
      const data = await response.json()
      setData(data)
    } catch (error) {
      console.error('Error fetching file space:', error)
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>File Storage Space</CardTitle>
      </CardHeader>
      <CardContent>
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
                        {data.data.useSize} MB
                      </p>
                    </div>
                    <div className='p-4 bg-slate-100 rounded-lg'>
                      <p className='text-sm text-muted-foreground'>
                        Available Space
                      </p>
                      <p className='text-2xl font-bold'>
                        {data.data.hasSize} MB
                      </p>
                    </div>
                    <div className='p-4 bg-slate-100 rounded-lg'>
                      <p className='text-sm text-muted-foreground'>
                        Total Space
                      </p>
                      <p className='text-2xl font-bold'>
                        {data.data.totalSize} MB
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className='w-full bg-slate-200 rounded-full h-2.5'>
                    <div
                      className='bg-blue-600 h-2.5 rounded-full'
                      style={{
                        width: `${
                          (data.data.useSize / data.data.totalSize) * 100
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
      </CardContent>
    </Card>
  )
}
