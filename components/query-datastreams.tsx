'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { AlertCircle } from 'lucide-react'
import { FieldLabel } from '@/components/field-label'
import { DeviceSelector } from '@/components/device-selector'
import { AuthProps } from '@/types/common'

interface DatastreamResponse {
  errno: number
  error: string
  data?: {
    update_at: string
    id: string
    create_time: string
    current_value: string | number | Record<string, string>
  }[]
}

export function QueryDatastreamsForm({ auth }: { auth: AuthProps }) {
  const { version, apiKey } = auth
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<DatastreamResponse | null>(null)
  const [formData, setFormData] = useState({
    device_id: '',
    datastream_ids: '',
  })

  const isFormValid = () => {
    return !!formData.device_id
  }

  const handleSubmit = async () => {
    if (!isFormValid()) {
      return
    }

    setLoading(true)
    try {
      let url = `/api/equipment?device_id=${formData.device_id}`
      if (formData.datastream_ids) {
        url += `&datastream_ids=${formData.datastream_ids}`
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: apiKey ? { 'api-key': apiKey } : {},
      })
      const data = await response.json()
      setResponse(data)
    } catch (error) {
      setResponse({
        errno: -1,
        error: error instanceof Error ? error.message : 'An error occurred',
      })
    }
    setLoading(false)
  }

  const formatCurrentValue = (
    value: string | number | Record<string, string>
  ) => {
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2)
    }
    return value?.toString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Query Datastreams</CardTitle>
      </CardHeader>
      <CardContent>
        {version == 'v2' ? (
          <div className='space-y-4'>
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>
                {'This service is not supported by new version yet.'}
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className='space-y-6'>
            {/* Device ID */}
            <div className='space-y-4'>
              <div className='space-y-2'>
                <FieldLabel
                  label='Device ID'
                  required
                  description='The unique identifier of the device to query'
                />
                <DeviceSelector
                  value={formData.device_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, device_id: value }))
                  }
                />
              </div>
            </div>

            <Separator />

            {/* Datastream IDs */}
            <div className='space-y-4'>
              <div className='space-y-2'>
                <FieldLabel
                  label='Datastream IDs'
                  description='Optional: Comma-separated list of datastream IDs to query'
                />
                <Input
                  value={formData.datastream_ids}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      datastream_ids: e.target.value,
                    }))
                  }
                  placeholder='e.g. temperature,humidity'
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              className='w-full'
              onClick={handleSubmit}
              disabled={loading || !isFormValid() || !apiKey}
            >
              {loading ? 'Querying Datastreams...' : 'Query Datastreams'}
            </Button>

            {/* Response Display */}
            {response && (
              <div className='space-y-4'>
                {response.errno === 0 ? (
                  <Alert>
                    <AlertDescription className='space-y-2'>
                      <p className='font-medium text-green-600'>
                        Datastreams queried successfully
                      </p>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant='destructive'>
                    <AlertCircle className='h-4 w-4' />
                    <AlertDescription>{response.error}</AlertDescription>
                  </Alert>
                )}

                {response.data && response.data.length > 0 && (
                  <div className='space-y-4'>
                    {response.data.map((stream) => (
                      <div
                        key={stream.id}
                        className='rounded-lg border p-4 space-y-2'
                      >
                        <div className='flex justify-between items-center'>
                          <h4 className='font-medium'>
                            Stream ID: {stream.id}
                          </h4>
                        </div>
                        <div className='grid grid-cols-2 gap-2 text-sm'>
                          <div>
                            <span className='text-gray-500'>Created: </span>
                            {stream.create_time}
                          </div>
                          <div>
                            <span className='text-gray-500'>Updated: </span>
                            {stream.update_at}
                          </div>
                        </div>
                        <div className='space-y-1'>
                          <span className='text-gray-500 text-sm'>
                            Current Value:
                          </span>
                          <pre className='text-sm bg-slate-50 p-2 rounded overflow-x-auto'>
                            {formatCurrentValue(stream.current_value)}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className='rounded-md bg-slate-100 p-4'>
                  <pre className='text-sm whitespace-pre-wrap'>
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
