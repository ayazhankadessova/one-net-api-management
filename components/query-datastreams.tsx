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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// V1 Response interface
interface DatastreamResponseV1 {
  errno: number
  error: string
  data?: {
    update_at: string
    id: string
    create_time: string
    current_value: string | number | Record<string, string>
  }[]
}

// V2 Response interfaces
interface DataPoint {
  at: string
  value: string | number | Record<string, string>
}

interface Datastream {
  id: string
  datapoints: DataPoint[]
}

interface DatastreamResponseV2 {
  code: number
  msg: string
  request_id: string
  data: {
    cursor?: string
    count: number
    datastreams: Datastream[]
  }
}

type DatastreamResponse = DatastreamResponseV1 | DatastreamResponseV2

// Form data interfaces
interface FormDataV1 {
  device_id: string
  datastream_ids: string
}

interface FormDataV2 {
  product_id: string
  device_name: string
  imei?: string
  datastream_id: string
  start?: string
  end?: string
  duration?: number
  limit: number
  cursor?: string
  sort: 'DESC' | 'ASC'
}

const initialFormDataV1: FormDataV1 = {
  device_id: '',
  datastream_ids: '',
}

const initialFormDataV2: FormDataV2 = {
  product_id: '',
  device_name: '',
  imei: '',
  datastream_id: '',
  start: '',
  end: '',
  duration: undefined,
  limit: 100,
  cursor: '',
  sort: 'DESC',
}

export function QueryDatastreamsForm({ auth }: { auth: AuthProps }) {
  const { version, token, apiKey } = auth
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<DatastreamResponse | null>(null)
  const [formDataV1, setFormDataV1] = useState<FormDataV1>(initialFormDataV1)
  const [formDataV2, setFormDataV2] = useState<FormDataV2>(initialFormDataV2)

  const isFormValid = () => {
    if (version === 'v1') {
      return !!formDataV1.device_id
    } else {
      return !!formDataV2.product_id && !!formDataV2.device_name
    }
  }

  const handleSubmit = async () => {
    if (!isFormValid()) return

    setLoading(true)
    try {
      if (version === 'v1') {
        let url = `/api/equipment?device_id=${formDataV1.device_id}`
        if (formDataV1.datastream_ids) {
          url += `&datastream_ids=${formDataV1.datastream_ids}`
        }

        const response = await fetch(url, {
          headers: { 'api-key': apiKey || '' },
        })
        const data = await response.json()
        setResponse(data)
      } else {
        // Build query string for V2
        const params = new URLSearchParams({
          product_id: formDataV2.product_id,
          device_name: formDataV2.device_name,
          ...(formDataV2.datastream_id && {
            datastream_id: formDataV2.datastream_id,
          }),
          ...(formDataV2.imei && { imei: formDataV2.imei }),
          ...(formDataV2.start && { start: formDataV2.start }),
          ...(formDataV2.end && { end: formDataV2.end }),
          ...(formDataV2.duration && {
            duration: formDataV2.duration.toString(),
          }),
          limit: formDataV2.limit.toString(),
          ...(formDataV2.cursor && { cursor: formDataV2.cursor }),
          sort: formDataV2.sort,
        })

        const response = await fetch(
          `/api/datapoints/history?${params.toString()}`,
          {
            headers: { Authorization: token || '' },
          }
        )
        const data = await response.json()
        setResponse(data)
      }
    } catch (error) {
      setResponse(
        version === 'v1'
          ? {
              errno: -1,
              error:
                error instanceof Error ? error.message : 'An error occurred',
            }
          : {
              code: -1,
              msg: error instanceof Error ? error.message : 'An error occurred',
              request_id: '',
              data: { count: 0, datastreams: [] },
            }
      )
    }
    setLoading(false)
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Query Datastreams</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {version === 'v1' ? (
            // V1 Form

            <div className='space-y-4'>
              <div className='space-y-2'>
                <FieldLabel
                  label='Device ID'
                  required
                  description='The unique identifier of the device to query'
                />
                <DeviceSelector
                  value={formDataV1.device_id}
                  onValueChange={(value) =>
                    setFormDataV1((prev) => ({ ...prev, device_id: value }))
                  }
                />
              </div>

              <div className='space-y-2'>
                <FieldLabel
                  label='Datastream IDs'
                  description='Optional: Comma-separated list of datastream IDs to query'
                />
                <Input
                  value={formDataV1.datastream_ids}
                  onChange={(e) =>
                    setFormDataV1((prev) => ({
                      ...prev,
                      datastream_ids: e.target.value,
                    }))
                  }
                  placeholder='e.g. temperature,humidity'
                />
              </div>
            </div>
          ) : (
            // V2 Form

            <div className='space-y-4'>
              {/* Device Identifiers */}
              <div className='space-y-2'>
                <FieldLabel
                  label='Product ID'
                  required
                  description='Product ID'
                />
                <Input
                  value={formDataV2.product_id}
                  onChange={(e) =>
                    setFormDataV2((prev) => ({
                      ...prev,
                      product_id: e.target.value,
                    }))
                  }
                  placeholder='Enter Product ID'
                />
              </div>

              <div className='space-y-2'>
                <FieldLabel
                  label='Device Name'
                  required
                  description='Device Name'
                />
                <Input
                  value={formDataV2.device_name}
                  onChange={(e) =>
                    setFormDataV2((prev) => ({
                      ...prev,
                      device_name: e.target.value,
                    }))
                  }
                  placeholder='Enter Device Name'
                />
              </div>

              <div className='space-y-2'>
                <FieldLabel
                  label='IMEI'
                  description='Device IMEI (required for LwM2M devices)'
                />
                <Input
                  value={formDataV2.imei}
                  onChange={(e) =>
                    setFormDataV2((prev) => ({
                      ...prev,
                      imei: e.target.value,
                    }))
                  }
                  placeholder='Enter IMEI'
                />
              </div>

              <Separator />

              {/* Query Parameters */}
              <div className='space-y-2'>
                <FieldLabel
                  label='Datastream ID'
                  description='Comma-separated list of datastream IDs'
                />
                <Input
                  value={formDataV2.datastream_id}
                  onChange={(e) =>
                    setFormDataV2((prev) => ({
                      ...prev,
                      datastream_id: e.target.value,
                    }))
                  }
                  placeholder='e.g. temperature,humidity'
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <FieldLabel
                    label='Start Time'
                    description='Format: YYYY-MM-DDThh:mm:ss'
                  />
                  <Input
                    type='datetime-local'
                    value={formDataV2.start}
                    onChange={(e) =>
                      setFormDataV2((prev) => ({
                        ...prev,
                        start: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <FieldLabel
                    label='End Time'
                    description='Format: YYYY-MM-DDThh:mm:ss'
                  />
                  <Input
                    type='datetime-local'
                    value={formDataV2.end}
                    onChange={(e) =>
                      setFormDataV2((prev) => ({
                        ...prev,
                        end: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <FieldLabel
                    label='Duration'
                    description='Time interval in seconds'
                  />
                  <Input
                    type='number'
                    min={0}
                    value={formDataV2.duration}
                    onChange={(e) =>
                      setFormDataV2((prev) => ({
                        ...prev,
                        duration: parseInt(e.target.value) || undefined,
                      }))
                    }
                    placeholder='Enter duration in seconds'
                  />
                </div>
                <div className='space-y-2'>
                  <FieldLabel
                    label='Limit'
                    description='Max number of datapoints (1-6000)'
                  />
                  <Input
                    type='number'
                    min={1}
                    max={6000}
                    value={formDataV2.limit}
                    onChange={(e) =>
                      setFormDataV2((prev) => ({
                        ...prev,
                        limit: parseInt(e.target.value) || 100,
                      }))
                    }
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <FieldLabel
                  label='Sort Order'
                  description='Time sorting order'
                />
                <Select
                  value={formDataV2.sort}
                  onValueChange={(value: 'DESC' | 'ASC') =>
                    setFormDataV2((prev) => ({ ...prev, sort: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select sort order' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='DESC'>Descending</SelectItem>
                    <SelectItem value='ASC'>Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formDataV2.cursor && (
                <div className='space-y-2'>
                  <FieldLabel
                    label='Cursor'
                    description='Continuation token for pagination'
                  />
                  <Input
                    value={formDataV2.cursor}
                    onChange={(e) =>
                      setFormDataV2((prev) => ({
                        ...prev,
                        cursor: e.target.value,
                      }))
                    }
                    placeholder='Enter cursor value'
                  />
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <Button
            className='w-full'
            onClick={handleSubmit}
            disabled={loading || !isFormValid()}
          >
            {loading ? 'Querying...' : 'Query Data'}
          </Button>

          {/* Response Display */}
          {response && (
            <div className='space-y-4'>
              {'errno' in response ? (
                // V1 Response
                <>
                  {response.errno === 0 ? (
                    <Alert>
                      <AlertDescription>Success</AlertDescription>
                    </Alert>
                  ) : (
                    <Alert variant='destructive'>
                      <AlertCircle className='h-4 w-4' />
                      <AlertDescription>{response.error}</AlertDescription>
                    </Alert>
                  )}

                  {response.data && (
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
                              {typeof stream.current_value === 'object'
                                ? JSON.stringify(stream.current_value, null, 2)
                                : stream.current_value}
                            </pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                // V2 Response
                <>
                  {response.code === 0 ? (
                    <Alert>
                      <AlertDescription className='space-y-2'>
                        <p className='font-medium text-green-600'>
                          Query successful
                        </p>
                        <p className='text-sm'>
                          Found {response.data.count} datapoints
                          {response.data.cursor && ' (more available)'}
                        </p>
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert variant='destructive'>
                      <AlertCircle className='h-4 w-4' />
                      <AlertDescription>{response.msg}</AlertDescription>
                    </Alert>
                  )}

                  {response.data.datastreams.length > 0 && (
                    <div className='space-y-4'>
                      {response.data.datastreams.map((stream) => (
                        <div
                          key={stream.id}
                          className='rounded-lg border p-4 space-y-2'
                        >
                          <div className='flex justify-between items-center'>
                            <h4 className='font-medium'>
                              Stream ID: {stream.id}
                            </h4>
                          </div>

                          <div className='space-y-2'>
                            <div className='text-sm text-gray-500'>
                              Datapoints:
                            </div>
                            <div className='max-h-60 overflow-y-auto'>
                              <table className='min-w-full divide-y divide-gray-200'>
                                <thead className='bg-gray-50'>
                                  <tr>
                                    <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
                                      Timestamp
                                    </th>
                                    <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
                                      Value
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className='bg-white divide-y divide-gray-200'>
                                  {stream.datapoints.map((point, index) => (
                                    <tr key={index}>
                                      <td className='px-4 py-2 text-sm text-gray-900'>
                                        {formatDateTime(point.at)}
                                      </td>
                                      <td className='px-4 py-2 text-sm text-gray-900'>
                                        <pre className='font-mono text-xs'>
                                          {typeof point.value === 'object'
                                            ? JSON.stringify(
                                                point.value,
                                                null,
                                                2
                                              )
                                            : point.value.toString()}
                                        </pre>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      ))}

                      {response.data.cursor && (
                        <div className='flex items-center justify-between pt-4'>
                          <p className='text-sm text-gray-500'>
                            More data available
                          </p>
                          <Button
                            variant='outline'
                            onClick={() => {
                              setFormDataV2((prev) => ({
                                ...prev,
                                cursor: response.data.cursor,
                              }))
                              handleSubmit()
                            }}
                          >
                            Load More
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              <div className='rounded-md bg-slate-100 p-4'>
                <pre className='text-sm whitespace-pre-wrap'>
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
