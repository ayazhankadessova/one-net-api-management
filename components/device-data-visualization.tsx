'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { AlertCircle } from 'lucide-react'
import { FieldLabel } from '@/components/field-label'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { DeviceDataRequest, DeviceDataResponse } from '@/types/deviceData'
import { DeviceSelector } from '@/components/device-selector'
import { format as formatDate } from 'date-fns'
import { AuthProps } from '@/types/common'

export function DeviceDataVisualization({ auth }: { auth: AuthProps }) {
  const { version, apiKey } = auth
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<DeviceDataResponse | null>(null)
  const [deviceId, setDeviceId] = useState('')
  const [formData, setFormData] = useState<DeviceDataRequest>({
    datastream_id: '',
    start: '',
    end: '',
    limit: 100,
    sort: 'ASC',
  })

  const downloadAsCSV = () => {
    if (!response?.data?.datastreams?.length) return

    // Create headers
    const headers = [
      'Timestamp',
      ...response.data.datastreams.map((ds) => ds.id),
    ]

    // Create a map of timestamps to values
    const dataMap = new Map<string, Record<string, string | number>>()

    // Process each datastream
    response.data.datastreams.forEach((datastream) => {
      datastream.datapoints.forEach((point) => {
        const timestamp = formatDate(new Date(point.at), 'yyyy-MM-dd HH:mm:ss')
        if (!dataMap.has(timestamp)) {
          dataMap.set(timestamp, { Timestamp: timestamp })
        }
        const row = dataMap.get(timestamp)!
        row[datastream.id] = point.value
      })
    })

    // Convert map to array of rows
    const rows = Array.from(dataMap.values())

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        headers
          .map((header) =>
            header === 'Timestamp' ? row[header] : row[header] ?? ''
          )
          .join(',')
      ),
    ].join('\n')

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const fileName = `one-net-${formatDate(new Date(), 'yyyy-MM-dd')}.csv`

    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const fetchData = async () => {
    if (!deviceId) return

    setLoading(true)
    try {
      // Build query parameters
      const params = new URLSearchParams()
      if (formData.datastream_id)
        params.append('datastream_id', formData.datastream_id)
      if (formData.start) params.append('start', formData.start)
      if (formData.end) params.append('end', formData.end)
      if (formData.limit) params.append('limit', formData.limit.toString())
      if (formData.cursor) params.append('cursor', formData.cursor)
      if (formData.sort) params.append('sort', formData.sort)

      const response = await fetch(
        `/api/devices/${deviceId}/datapoints?${params.toString()}`,
        {
          headers: apiKey ? { 'api-key': apiKey } : {},
        }
      )
      const data = await response.json()
      setResponse(data)
    } catch (error) {
      setResponse({
        errno: -1,
        error: error instanceof Error ? error.message : 'An error occurred',
        data: { count: '0', datastreams: [] },
      })
    }
    setLoading(false)
  }

  const isNumericData = (datapoints: Array<{ value: string | number }>) => {
    return datapoints.every((point) => !isNaN(Number(point.value)))
  }

  const renderVisualization = (
    datastream: DeviceDataResponse['data']['datastreams'][0]
  ) => {
    const isNumeric = isNumericData(datastream.datapoints)

    if (isNumeric) {
      const chartData = datastream.datapoints.map((point) => ({
        time: format(new Date(point.at), 'yyyy-MM-dd HH:mm:ss'),
        value: Number(point.value),
      }))

      return (
        <div className='h-[400px] mt-4'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart
              data={chartData}
              margin={{
                // Add margin to ensure labels are visible
                top: 20,
                right: 30,
                left: 20,
                bottom: 100,
              }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='time'
                angle={-45}
                textAnchor='end'
                height={90} // Increase height
                interval='preserveStartEnd' // Show only start and end ticks
                tick={{
                  fontSize: 12,
                  dy: 25, // Move labels down
                }}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(label) =>
                  format(new Date(label.split('\n')[0]), 'yyyy-MM-dd HH:mm:ss')
                }
              />
              <Line
                type='monotone'
                dataKey='value'
                stroke='#8884d8'
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )
    } else {
      return (
        <div className='mt-4'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datastream.datapoints.map((point, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {format(new Date(point.at), 'yyyy-MM-dd HH:mm:ss')}
                  </TableCell>
                  <TableCell>{point.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Historical Data</CardTitle>
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
            <div className='space-y-2'>
              <FieldLabel
                label='Device ID'
                required
                description='The device ID to query'
              />

              <DeviceSelector
                value={deviceId}
                onValueChange={(value) => setDeviceId(value)}
              />
            </div>

            <Separator />

            {/* Query Parameters */}
            <div className='space-y-4'>
              <h3 className='font-medium'>Query Parameters</h3>

              <div className='space-y-2'>
                <FieldLabel
                  label='Datastream ID'
                  description='Data stream ID, separate multiple IDs with commas'
                />
                <Input
                  value={formData.datastream_id}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      datastream_id: e.target.value,
                    }))
                  }
                  placeholder='e.g. ds1,ds2'
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <FieldLabel
                    label='Start Time'
                    description='Format: YYYY-MM-DDTHH:mm:ss'
                  />
                  <Input
                    type='datetime-local'
                    value={formData.start}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        start: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <FieldLabel
                    label='End Time'
                    description='Format: YYYY-MM-DDTHH:mm:ss'
                  />
                  <Input
                    type='datetime-local'
                    value={formData.end}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, end: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <FieldLabel
                  label='Limit'
                  description='Maximum number of data points (0-6000)'
                />
                <Input
                  type='number'
                  min='0'
                  max='6000'
                  value={formData.limit}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      limit: parseInt(e.target.value),
                    }))
                  }
                />
              </div>
            </div>

            <Button
              className='w-full'
              onClick={fetchData}
              disabled={loading || !deviceId || !apiKey}
            >
              {loading ? 'Fetching Data...' : 'Fetch Data'}
            </Button>

            {/* Results */}
            {response && (
              <div className='space-y-4'>
                {response.errno === 0 ? (
                  <>
                    {/* Add download button at the top of results */}
                    {response.data.datastreams.length > 0 && (
                      <Button
                        variant='outline'
                        onClick={downloadAsCSV}
                        className='w-full'
                      >
                        Save as CSV
                      </Button>
                    )}

                    {response.data.datastreams.map((datastream) => (
                      <div key={datastream.id} className='space-y-4'>
                        <h4 className='font-medium'>
                          Datastream: {datastream.id}
                        </h4>
                        {renderVisualization(datastream)}
                      </div>
                    ))}
                    {response.data.cursor && (
                      <Button
                        variant='outline'
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            cursor: response.data.cursor,
                          }))
                        }
                      >
                        Load More
                      </Button>
                    )}
                  </>
                ) : (
                  <Alert variant='destructive'>
                    <AlertCircle className='h-4 w-4' />
                    <AlertDescription>{response.error}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
