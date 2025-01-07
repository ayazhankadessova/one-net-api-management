'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { AlertCircle } from 'lucide-react'
import { FieldLabel } from '@/components/field-label'

import { NewEquipmentResponse, NewEquipmentRequest} from '@/types/newEquipment'
import {
  Location,
} from '@/types/common'


const initialFormData: NewEquipmentRequest = {
  title: '',
  desc: '',
  tags: [],
  location: {
    lon: null,
    lat: null,
  },
  private: true,
  auth_info: '',
  other: {},
}

interface Props {
  apiKey: string
}

export function NewEquipmentForm({ apiKey }: Props) {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<NewEquipmentResponse | null>(null)
  const [formData, setFormData] = useState<NewEquipmentRequest>(initialFormData)

  const handleLocationChange = (field: keyof Location, value: string) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...(prev.location || { lon: null, lat: null }),
        [field]: value ? parseFloat(value) : null,
      },
    }))
  }

  const handleSubmit = async () => {
    if (!formData.title) {
      return
    }

    // Remove empty optional fields before sending
    const requestData = {
      title: formData.title,
      ...(formData.desc && { desc: formData.desc }),
      ...(formData.tags?.length && { tags: formData.tags }),
      ...(formData.location?.lon && formData.location?.lat
        ? { location: formData.location }
        : {}),
      ...(formData.private !== undefined && { private: formData.private }),
      ...(formData.auth_info && { auth_info: formData.auth_info }),
      ...(formData.other ? { other: formData.other }
        : {}),
    }

    setLoading(true)
    try {
      const response = await fetch(
        'http://api.onenet.hk.chinamobile.com/devices',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey,
          },
          body: JSON.stringify(requestData),
        }
      )
      const data = await response.json()
      setResponse(data)
    } catch (error) {
      setResponse({
        errno: -1,
        error: error instanceof Error ? error.message : 'An error occurred',
        data: {
          device_id: '',
        },
      })
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Equipment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {/* Basic Information */}
          <div className='space-y-4'>
            <h3 className='font-medium'>Basic Information</h3>

            {/* Title */}
            <div className='space-y-2'>
              <FieldLabel
                label='Device Name'
                required
                description='The name of your device (required)'
              />
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder='Enter device name'
                required
              />
            </div>

            {/* Description */}
            <div className='space-y-2'>
              <FieldLabel
                label='Description'
                description='Optional description of your device'
              />
              <Input
                value={formData.desc}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, desc: e.target.value }))
                }
                placeholder='Enter device description'
              />
            </div>

            {/* Tags */}
            <div className='space-y-2'>
              <FieldLabel
                label='Tags'
                description='Comma-separated list of tags for categorizing your device'
              />
              <Input
                value={formData.tags?.join(', ')}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tags: e.target.value.split(',').map((tag) => tag.trim()),
                  }))
                }
                placeholder='e.g. china, mobile'
              />
            </div>
          </div>

          <Separator />

          {/* Location Information */}
          <div className='space-y-4'>
            <h3 className='font-medium'>Location Information</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <FieldLabel
                  label='Longitude'
                  description='Geographic longitude coordinate'
                />
                <Input
                  type='number'
                  value={formData.location?.lon ?? ''}
                  onChange={(e) => handleLocationChange('lon', e.target.value)}
                  step='any'
                  placeholder='e.g. 109'
                />
              </div>
              <div className='space-y-2'>
                <FieldLabel
                  label='Latitude'
                  description='Geographic latitude coordinate'
                />
                <Input
                  type='number'
                  value={formData.location?.lat ?? ''}
                  onChange={(e) => handleLocationChange('lat', e.target.value)}
                  step='any'
                  placeholder='e.g. 23.54'
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Additional Settings */}
          <div className='space-y-4'>
            <h3 className='font-medium'>Additional Settings</h3>
            {/* Privacy Setting */}
            <div className='flex items-center justify-between rounded-lg border p-4'>
              <div className='space-y-0.5'>
                <FieldLabel
                  label='Private Device'
                  description='Controls visibility of device information in shared links'
                />
              </div>
              <Switch
                checked={formData.private}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, private: checked }))
                }
              />
            </div>
            {/* Auth Info */}
            <div className='space-y-2'>
              <FieldLabel
                label='Auth Info'
                description='Authentication information (recommended: product serial number)'
              />
              <Input
                value={formData.auth_info}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    auth_info: e.target.value,
                  }))
                }
                placeholder='Enter authentication info'
              />
            </div>
            {/* Other Information */}
            <div className='space-y-4'>
              <h3 className='font-medium'>Custom Information</h3>
              <div className='space-y-2'>
                <FieldLabel
                  label='Custom Fields'
                  description='Add custom key-value pairs'
                />
                <div className='space-y-2'>
                  {/* Add new field button */}
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        other: {
                          ...prev.other,
                          '': '', // Add new empty field
                        },
                      }))
                    }}
                  >
                    Add Custom Field
                  </Button>

                  {/* Dynamic fields */}
                  {Object.entries(formData.other || {}).map(
                    ([key, value], index) => (
                      <div key={index} className='flex gap-2'>
                        <Input
                          placeholder='Key'
                          value={key}
                          onChange={(e) => {
                            const newOther = { ...formData.other }
                            const oldKey = key
                            delete newOther[oldKey]
                            newOther[e.target.value] = value
                            setFormData((prev) => ({
                              ...prev,
                              other: newOther,
                            }))
                          }}
                        />
                        <Input
                          placeholder='Value'
                          value={value}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              other: {
                                ...prev.other,
                                [key]: e.target.value,
                              },
                            }))
                          }}
                        />
                        <Button
                          variant='destructive'
                          onClick={() => {
                            const newOther = { ...formData.other }
                            delete newOther[key]
                            setFormData((prev) => ({
                              ...prev,
                              other: newOther,
                            }))
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            className='w-full'
            onClick={handleSubmit}
            disabled={loading || !formData.title || !apiKey}
          >
            {loading ? 'Creating Equipment...' : 'Create Equipment'}
          </Button>

          {/* Response Display */}
          {response && (
            <div className='space-y-4'>
              {response.errno === 0 ? (
                <Alert>
                  <AlertDescription className='space-y-2'>
                    <p className='font-medium text-green-600'>
                      Equipment created successfully!
                    </p>
                    <p>Device ID: {response.data.device_id}</p>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant='destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertDescription>{response.error}</AlertDescription>
                </Alert>
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
