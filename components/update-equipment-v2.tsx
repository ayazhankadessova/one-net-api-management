// components/update-equipment-v2-form.tsx
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
  UpdateEquipmentV2Request,
  UpdateEquipmentV2Response,
} from '@/types/updateEquipmentv2'

const initialFormData: UpdateEquipmentV2Request = {
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

interface Props {
  apiKey: string
}

export function UpdateEquipmentFormV2({ apiKey }: Props) {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<UpdateEquipmentV2Response | null>(
    null
  )
  const [formData, setFormData] =
    useState<UpdateEquipmentV2Request>(initialFormData)

  const isFormValid = () => {
    // At least one identifier is required
    const hasIdentifier = !!(
      formData.product_id &&
      (formData.device_name || formData.imei)
    )

    // Validation for optional fields
    const isImsiValid = !formData.imsi || /^\d{1,15}$/.test(formData.imsi)
    const isPskValid = !formData.psk || /^[a-zA-Z0-9]{8,16}$/.test(formData.psk)
    const isAuthCodeValid =
      !formData.auth_code || /^[a-zA-Z0-9]{1,16}$/.test(formData.auth_code)

    return hasIdentifier && isImsiValid && isPskValid && isAuthCodeValid
  }

  const handleSubmit = async () => {
    if (!isFormValid()) return

    setLoading(true)
    try {
      const response = await fetch(
        'https://www.onenet.hk.chinamobile.com:2616/device/update',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey,
          },
          body: JSON.stringify(formData),
        }
      )
      const data = await response.json()
      setResponse(data)
    } catch (error) {
      setResponse({
        code: -1,
        msg: error instanceof Error ? error.message : 'An error occurred',
        request_id: '',
        data: {
          did: '',
          pid: '',
          device_name: '',
        },
      })
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Equipment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {/* Device Identification */}
          <div className='space-y-4'>
            <h3 className='font-medium'>Device Identification (Required)</h3>

            <div className='space-y-2'>
              <FieldLabel
                label='Product ID'
                required
                description='Your product identifier'
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
                required
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <FieldLabel
                  label='Device Name'
                  description='Device name (required if IMEI not provided)'
                />
                <Input
                  value={formData.device_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      device_name: e.target.value,
                    }))
                  }
                  placeholder='Enter device name'
                />
              </div>
              <div className='space-y-2'>
                <FieldLabel
                  label='IMEI'
                  description='15-digit number (required if device name not provided)'
                />
                <Input
                  value={formData.imei}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, imei: e.target.value }))
                  }
                  placeholder='15-digit number'
                  pattern='\d{15}'
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* LwM2M Settings */}
          <div className='space-y-4'>
            <h3 className='font-medium'>LwM2M Device Settings</h3>

            <div className='space-y-2'>
              <FieldLabel
                label='IMSI'
                description='1-15 digits (for LwM2M devices)'
              />
              <Input
                value={formData.imsi}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, imsi: e.target.value }))
                }
                placeholder='1-15 digit number'
                pattern='\d{1,15}'
              />
            </div>

            <div className='space-y-2'>
              <FieldLabel
                label='PSK'
                description='8-16 characters (letters and numbers only)'
              />
              <Input
                value={formData.psk}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, psk: e.target.value }))
                }
                placeholder='Enter PSK'
                pattern='[a-zA-Z0-9]{8,16}'
              />
            </div>

            <div className='space-y-2'>
              <FieldLabel
                label='Auth Code'
                description='Up to 16 characters (letters and numbers only)'
              />
              <Input
                value={formData.auth_code}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    auth_code: e.target.value,
                  }))
                }
                placeholder='Enter auth code'
                pattern='[a-zA-Z0-9]{1,16}'
              />
            </div>
          </div>

          <Separator />

          {/* Device Information */}
          <div className='space-y-4'>
            <h3 className='font-medium'>Device Information</h3>

            <div className='space-y-2'>
              <FieldLabel
                label='Description'
                description='Device description'
              />
              <Input
                value={formData.desc}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, desc: e.target.value }))
                }
                placeholder='Enter device description'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <FieldLabel
                  label='Longitude'
                  description='Geographic longitude coordinate'
                />
                <Input
                  value={formData.lon}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, lon: e.target.value }))
                  }
                  placeholder='e.g. 123.45678'
                />
              </div>
              <div className='space-y-2'>
                <FieldLabel
                  label='Latitude'
                  description='Geographic latitude coordinate'
                />
                <Input
                  value={formData.lat}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, lat: e.target.value }))
                  }
                  placeholder='e.g. 23.54321'
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            className='w-full'
            onClick={handleSubmit}
            disabled={loading || !isFormValid() || !apiKey}
          >
            {loading ? 'Updating Equipment...' : 'Update Equipment'}
          </Button>

          {/* Response Display */}
          {response && (
            <div className='space-y-4'>
              {response.code === 0 ? (
                <Alert>
                  <AlertDescription className='space-y-2'>
                    <p className='font-medium text-green-600'>
                      Equipment updated successfully!
                    </p>
                    <p>Device ID: {response.data.did}</p>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant='destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertDescription>{response.msg}</AlertDescription>
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
