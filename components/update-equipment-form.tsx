'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { AlertCircle } from 'lucide-react'
import { FieldLabel } from '@/components/field-label'
import { validateCoordinates } from '@/lib/utils'
import { DeviceSelector } from '@/components/device-selector'
import { AuthProps } from '@/types/common'
import { ApiResponse } from '@/types/apiEndpoint'

// V1 interfaces remain the same
interface UpdateEquipmentRequestV1 {
  device_id: string
  title?: string
  desc?: string
  tags?: string[]
  location?: {
    lon: number | null
    lat: number | null
  }
  private?: boolean
  auth_info?: string
  other?: Record<string, string>
}

// New V2 interface based on API documentation
interface UpdateEquipmentRequestV2 {
  product_id?: string
  device_name?: string
  imei?: string
  imsi?: string
  psk?: string
  auth_code?: string
  desc?: string
  lat?: string
  lon?: string
}

const initialFormDataV1: UpdateEquipmentRequestV1 = {
  device_id: '',
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

const initialFormDataV2: UpdateEquipmentRequestV2 = {
  product_id: '',
  device_name: '',
  imei: '',
  imsi: '',
  psk: '',
  auth_code: '',
  desc: '',
  lat: '',
  lon: '',
}

// Interface for V2 response based on API documentation
interface UpdateEquipmentResponseV2 {
  code: number
  msg: string
  request_id: string
  data?: {
    did: number | string
    pid: string
    device_name: string
    imei?: string
  }
}

type UpdateEquipmentResponse =
  | ApiResponse
  | UpdateEquipmentResponseV2


export function UpdateEquipmentForm({ auth }: { auth: AuthProps }) {
  const { version, token, apiKey } = auth
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<UpdateEquipmentResponse | null>(null)
  const [locationErrors, setLocationErrors] = useState({ lon: '', lat: '' })
  const [formDataV1, setFormDataV1] =
    useState<UpdateEquipmentRequestV1>(initialFormDataV1)
  const [formDataV2, setFormDataV2] =
    useState<UpdateEquipmentRequestV2>(initialFormDataV2)

  const handleLocationChange = (field: 'lon' | 'lat', value: string) => {
    if (version === 'v1') {
      const numValue = value ? parseFloat(value) : null
      const error = validateCoordinates(field, numValue)

      setLocationErrors((prev) => ({ ...prev, [field]: error }))
      setFormDataV1((prev) => ({
        ...prev,
        location: {
          ...(prev.location || { lon: null, lat: null }),
          [field]: numValue,
        },
      }))
    } else {
      setFormDataV2((prev) => ({ ...prev, [field]: value }))
    }
  }

  const isFormValid = () => {
    if (version === 'v1') {
      return (
        !!formDataV1.device_id && !locationErrors.lat && !locationErrors.lon
      )
    } else {
      // V2 validation: At least one identifier is required
      return !!(
        formDataV2.product_id ||
        formDataV2.device_name ||
        formDataV2.imei
      )
    }
  }

  const handleSubmit = async () => {
    if (!isFormValid()) return

    setLoading(true)
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(version === 'v2'
          ? { Authorization: token || '' }
          : { 'api-key': apiKey || '' }),
      }

      let url, method, requestData
      if (version === 'v1') {
        url = `/api/equipment/${formDataV1.device_id}`
        method = 'PUT'
        requestData = {
          ...(formDataV1.title && { title: formDataV1.title }),
          ...(formDataV1.desc && { desc: formDataV1.desc }),
          ...(formDataV1.tags?.length && { tags: formDataV1.tags }),
          ...(formDataV1.location?.lon || formDataV1.location?.lat
            ? { location: formDataV1.location }
            : {}),
          ...(formDataV1.private !== undefined && {
            private: formDataV1.private,
          }),
          ...(formDataV1.auth_info && { auth_info: formDataV1.auth_info }),
          ...(Object.keys(formDataV1.other || {}).length > 0 && {
            other: formDataV1.other,
          }),
        }
      } else {
        url = '/api/devices/update'
        method = 'POST'
        requestData = Object.fromEntries(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          Object.entries(formDataV2).filter(([_, v]) => v !== '')
        )
      }

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(requestData),
      })

      const data: UpdateEquipmentResponse = await response.json()
      setResponse(data)
    } catch (error) {
      setResponse(
        version === 'v2'
          ? {
              code: -1,
              msg: error instanceof Error ? error.message : 'An error occurred',
              request_id: '',
            }
          : {
              errno: -1,
              error:
                error instanceof Error ? error.message : 'An error occurred',
            }
      )
    }
    setLoading(false)
  }

  // Helper function to check success status based on version
  const isSuccessResponse = (response: UpdateEquipmentResponse): boolean => {
    if ('errno' in response) {
      return response.errno === 0
    }
    return true
  }

  // Helper function to get error message based on version
  const getErrorMessage = (response: UpdateEquipmentResponse): string => {
    if ('errno' in response) {
      return response.error || 'Unknown error'
    }
    return 'Unknown error'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Equipment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {version === 'v1' ? (
            // V1 Form
            <>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <FieldLabel
                    label='Device ID'
                    required
                    description='The unique identifier of the device to update'
                  />
                  <DeviceSelector
                    value={formDataV1.device_id}
                    onValueChange={(value) =>
                      setFormDataV1((prev) => ({ ...prev, device_id: value }))
                    }
                  />
                </div>
              </div>

              <Separator />

              {/* Basic Information */}
              <div className='space-y-4'>
                <h3 className='font-medium'>Basic Information</h3>
                <div className='space-y-2'>
                  <FieldLabel
                    label='Device Name'
                    description='Updated name of your device'
                  />
                  <Input
                    value={formDataV1.title}
                    onChange={(e) =>
                      setFormDataV1((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder='Enter device name'
                  />
                </div>

                <div className='space-y-2'>
                  <FieldLabel
                    label='Description'
                    description='Updated description of your device'
                  />
                  <Input
                    value={formDataV1.desc}
                    onChange={(e) =>
                      setFormDataV1((prev) => ({
                        ...prev,
                        desc: e.target.value,
                      }))
                    }
                    placeholder='Enter device description'
                  />
                </div>

                <div className='space-y-2'>
                  <FieldLabel
                    label='Tags'
                    description='Updated comma-separated list of tags'
                  />
                  <Input
                    value={formDataV1.tags?.join(', ')}
                    onChange={(e) =>
                      setFormDataV1((prev) => ({
                        ...prev,
                        tags: e.target.value
                          .split(',')
                          .map((tag) => tag.trim()),
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
                      description='Geographic longitude coordinate (-180 to 180)'
                    />
                    <Input
                      type='number'
                      value={formDataV1.location?.lon ?? ''}
                      onChange={(e) =>
                        handleLocationChange('lon', e.target.value)
                      }
                      step='any'
                      placeholder='e.g. 109'
                      className={locationErrors.lon ? 'border-red-500' : ''}
                    />
                    {locationErrors.lon && (
                      <p className='text-sm text-red-500'>
                        {locationErrors.lon}
                      </p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <FieldLabel
                      label='Latitude'
                      description='Geographic latitude coordinate (-90 to 90)'
                    />
                    <Input
                      type='number'
                      value={formDataV1.location?.lat ?? ''}
                      onChange={(e) =>
                        handleLocationChange('lat', e.target.value)
                      }
                      step='any'
                      placeholder='e.g. 23.54'
                      className={locationErrors.lat ? 'border-red-500' : ''}
                    />
                    {locationErrors.lat && (
                      <p className='text-sm text-red-500'>
                        {locationErrors.lat}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            // V2 Form
            <div className='space-y-6'>
              <div className='space-y-4'>
                {/* Device Identifiers */}
                <div className='space-y-2'>
                  <FieldLabel
                    label='Product ID'
                    description='Product ID (required if Device Name and IMEI not provided)'
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
                    description='Device Name (required if Product ID and IMEI not provided)'
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
                    description='Device IMEI (required for NB suite products)'
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

                {/* LwM2M Specific Fields */}
                <h3 className='font-medium'>LwM2M Device Settings</h3>

                <div className='space-y-2'>
                  <FieldLabel
                    label='IMSI'
                    description='LwM2M device IMSI (1-15 digits)'
                  />
                  <Input
                    value={formDataV2.imsi}
                    onChange={(e) =>
                      setFormDataV2((prev) => ({
                        ...prev,
                        imsi: e.target.value,
                      }))
                    }
                    placeholder='Enter IMSI'
                    maxLength={15}
                  />
                </div>

                <div className='space-y-2'>
                  <FieldLabel
                    label='PSK'
                    description='LwM2M device PSK (8-16 alphanumeric characters)'
                  />
                  <Input
                    value={formDataV2.psk}
                    onChange={(e) =>
                      setFormDataV2((prev) => ({
                        ...prev,
                        psk: e.target.value,
                      }))
                    }
                    placeholder='Enter PSK'
                    maxLength={16}
                  />
                </div>

                <div className='space-y-2'>
                  <FieldLabel
                    label='Auth Code'
                    description='LwM2M device auth code (max 16 alphanumeric characters)'
                  />
                  <Input
                    value={formDataV2.auth_code}
                    onChange={(e) =>
                      setFormDataV2((prev) => ({
                        ...prev,
                        auth_code: e.target.value,
                      }))
                    }
                    placeholder='Enter Auth Code'
                    maxLength={16}
                  />
                </div>

                <Separator />

                {/* Basic Information */}
                <h3 className='font-medium'>Basic Information</h3>

                <div className='space-y-2'>
                  <FieldLabel
                    label='Description'
                    description='Device Description'
                  />
                  <Input
                    value={formDataV2.desc}
                    onChange={(e) =>
                      setFormDataV2((prev) => ({
                        ...prev,
                        desc: e.target.value,
                      }))
                    }
                    placeholder='Enter Description'
                  />
                </div>

                {/* Location */}
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <FieldLabel
                      label='Longitude'
                      description='Geographic longitude coordinate'
                    />
                    <Input
                      value={formDataV2.lon}
                      onChange={(e) =>
                        handleLocationChange('lon', e.target.value)
                      }
                      placeholder='Enter Longitude'
                    />
                  </div>
                  <div className='space-y-2'>
                    <FieldLabel
                      label='Latitude'
                      description='Geographic latitude coordinate'
                    />
                    <Input
                      value={formDataV2.lat}
                      onChange={(e) =>
                        handleLocationChange('lat', e.target.value)
                      }
                      placeholder='Enter Latitude'
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            className='w-full'
            onClick={handleSubmit}
            disabled={loading || !isFormValid()}
          >
            {loading ? 'Updating Equipment...' : 'Update Equipment'}
          </Button>

          {/* Response Display */}
          {response && (
            <div className='space-y-4'>
              {isSuccessResponse(response) ? (
                <Alert>
                  <AlertDescription className='space-y-2'>
                    <p className='font-medium text-green-600'>
                      Equipment updated successfully!
                    </p>
                    {version === 'v2' &&
                      'data' in response &&
                      response.data && (
                        <div className='text-sm'>
                          {'did' in response.data && (
                            <p>Device ID: {response.data.did}</p>
                          )}
                          {'pid' in response.data && (
                            <p>Product ID: {response.data.pid}</p>
                          )}
                          {'device_name' in response.data && (
                            <p>Device Name: {response.data.device_name}</p>
                          )}
                          {'imei' in response.data && (
                            <p>IMEI: {response.data.imei}</p>
                          )}
                        </div>
                      )}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant='destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertDescription>
                    {getErrorMessage(response)}
                  </AlertDescription>
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
