// components/query-devices-form.tsx
'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { FieldLabel } from '@/components/field-label'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { QueryDevicesRequest, QueryDevicesResponse } from '@/types/deviceDetails'

interface Props {
  apiKey: string
}

export function QueryDevicesForm({ apiKey }: Props) {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<QueryDevicesResponse | null>(null)
  const [formData, setFormData] = useState<QueryDevicesRequest>({
    key_words: '',
    per_page: 2,
    page: 1,
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      setResponse(data)
    } catch (error) {
      setResponse({
        errno: -1,
        error: error instanceof Error ? error.message : 'An error occurred',
        data: { devices: [], total_count: 0, page: 1, per_page: 30 },
      })
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Query Devices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {/* Search Fields */}
          <div className='space-y-4'>
            <div className='space-y-2'>
              <FieldLabel
                label='Keywords'
                description='Match keywords in ID and title fields'
              />
              <Input
                value={formData.key_words}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    key_words: e.target.value,
                  }))
                }
                placeholder='Search keywords...'
              />
            </div>

            <div className='space-y-2'>
              <FieldLabel
                label='Device IDs'
                description='Comma-separated list of device IDs (max 100)'
              />
              <Input
                value={formData.device_id}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    device_id: e.target.value,
                  }))
                }
                placeholder='e.g. 35282992,35271941'
              />
            </div>

            <div className='space-y-2'>
              <FieldLabel
                label='Tags'
                description='Comma-separated list of tags'
              />
              <Input
                value={formData.tag?.join(', ')}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tag: e.target.value.split(',').map((t) => t.trim()),
                  }))
                }
                placeholder='e.g. china, mobile'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <FieldLabel label='Begin Date' />
                <Input
                  type='date'
                  value={formData.begin}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, begin: e.target.value }))
                  }
                />
              </div>
              <div className='space-y-2'>
                <FieldLabel label='End Date' />
                <Input
                  type='date'
                  value={formData.end}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, end: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className='flex items-center space-x-4'>
              <Switch
                checked={formData.online}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, online: checked }))
                }
              />
              <FieldLabel label='Online Only' />
            </div>
          </div>

          <Button
            className='w-full'
            onClick={fetchData}
            disabled={loading || !apiKey}
          >
            {loading ? 'Searching...' : 'Search Devices'}
          </Button>

          {/* Results */}
          {response && (
            <div className='space-y-4'>
              {response.errno === 0 ? (
                <div className='space-y-4'>
                  <div className='text-sm text-muted-foreground'>
                    Found {response.data.total_count} devices
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {response.data.devices.map((device) => (
                        <TableRow key={device.id}>
                          <TableCell>{device.id}</TableCell>
                          <TableCell>{device.title}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                device.online
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {device.online ? 'Online' : 'Offline'}
                            </span>
                          </TableCell>
                          <TableCell>
                            {format(
                              new Date(device.create_time),
                              'yyyy-MM-dd HH:mm:ss'
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  <div className='flex justify-between items-center'>
                    <div className='text-sm text-muted-foreground'>
                      Page {response.data.page} of{' '}
                      {Math.ceil(
                        response.data.total_count / response.data.per_page
                      )}
                    </div>
                    <div className='space-x-2'>
                      <Button
                        variant='outline'
                        disabled={response.data.page === 1}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            page: Math.max(1, (prev.page || 1) - 1),
                          }))
                        }
                      >
                        Previous
                      </Button>
                      <Button
                        variant='outline'
                        disabled={
                          response.data.page >=
                          Math.ceil(
                            response.data.total_count / response.data.per_page
                          )
                        }
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            page: (prev.page || 1) + 1,
                          }))
                        }
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <Alert variant='destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertDescription>{response.error}</AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
