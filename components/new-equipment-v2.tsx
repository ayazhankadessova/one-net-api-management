// components/new-equipment-v2.tsx
'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
// import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { AlertCircle } from 'lucide-react'
import { FieldLabel } from '@/components/field-label'
// import { validateCoordinates } from '@/lib/utils'

interface NewEquipmentV2Request {
  product_id: string
  device_name: string
  desc?: string
  lon?: string
  lat?: string
  tags?: string[]
  imei?: string
  imsi?: string
  psk?: string
  auth_code?: string
}

interface NewEquipmentV2Response {
  code: number
  msg: string
  request_id: string
  data: {
    did: string | number
    pid: string
    access_pt: number
    data_pt: number
    name: string
    desc?: string
    status: number
    create_time: string
    imsi?: string
    imei?: string
    psk?: string
    lat?: string
    lon?: string
    auth_code?: string
    sec_key: string
    intelligent_way: number
  }
}

const initialFormData: NewEquipmentV2Request = {
  product_id: '',
  device_name: '',
  desc: '',
  lon: '',
  lat: '',
  tags: [],
  imei: '',
  imsi: '',
  psk: '',
  auth_code: '',
}

interface Props {
  apiKey: string | undefined
}

export function NewEquipmentFormV2({ apiKey }: Props) {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<NewEquipmentV2Response | null>(null)
  const [formData, setFormData] =
    useState<NewEquipmentV2Request>(initialFormData)

  const isFormValid = () => {
    // Device name validation: letters, digits, dashes-, and underscores _
    const deviceNameRegex = /^[a-zA-Z0-9-_]{1,64}$/

    return (
      !!formData.product_id &&
      !!formData.device_name &&
      deviceNameRegex.test(formData.device_name) &&
      (!formData.desc || formData.desc.length <= 100) &&
      (!formData.imei || /^\d{15}$/.test(formData.imei)) &&
      (!formData.imsi || /^\d{1,15}$/.test(formData.imsi)) &&
      (!formData.psk || /^[a-zA-Z0-9]{8,16}$/.test(formData.psk)) &&
      (!formData.auth_code || /^[a-zA-Z0-9]{1,16}$/.test(formData.auth_code))
    )
  }

  const handleSubmit = async () => {
    if (!isFormValid()) return

    setLoading(true)
    try {
      const response = await fetch(
        'https://www.onenet.hk.chinamobile.com:2616/device/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(apiKey && { Authorization: apiKey }),
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
          access_pt: 0,
          data_pt: 0,
          name: '',
          status: 0,
          create_time: '',
          sec_key: '',
          intelligent_way: 0,
        },
      })
    }
    setLoading(false)
  }

  return (
    <div className='space-y-6'>
      {/* Required Fields */}
      <div className='space-y-4'>
        <h3 className='font-medium'>Required Information</h3>

        <div className='space-y-2'>
          <FieldLabel
            label='Product ID'
            required
            description='Your product identifier'
          />
          <Input
            value={formData.product_id}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, product_id: e.target.value }))
            }
            placeholder='Enter product ID'
            required
          />
        </div>

        <div className='space-y-2'>
          <FieldLabel
            label='Device Name'
            required
            description='Letters, numbers, dashes and underscores only (max 64 characters)'
          />
          <Input
            value={formData.device_name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, device_name: e.target.value }))
            }
            placeholder='Enter device name'
            pattern='[a-zA-Z0-9-_]+'
            maxLength={64}
            required
          />
        </div>
      </div>

      <Separator />

      {/* Optional Fields - Basic Information */}
      <div className='space-y-4'>
        <h3 className='font-medium'>Basic Information</h3>

        <div className='space-y-2'>
          <FieldLabel
            label='Description'
            description='Device description (max 100 characters)'
          />
          <Input
            value={formData.desc}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, desc: e.target.value }))
            }
            placeholder='Enter device description'
            maxLength={100}
          />
        </div>

        <div className='space-y-2'>
          <FieldLabel
            label='Tags'
            description='Device labels (comma-separated)'
          />
          <Input
            value={formData.tags?.join(', ')}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                tags: e.target.value.split(',').map((tag) => tag.trim()),
              }))
            }
            placeholder='e.g. tag1, tag2'
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

      <Separator />

      {/* LwM2M Device Settings */}
      <div className='space-y-4'>
        <h3 className='font-medium'>LwM2M Device Settings</h3>

        <div className='space-y-2'>
          <FieldLabel
            label='IMEI'
            description='15-digit number (required for LwM2M devices)'
          />
          <Input
            value={formData.imei}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, imei: e.target.value }))
            }
            placeholder='15-digit number'
            pattern='\d{15}'
            maxLength={15}
          />
        </div>

        <div className='space-y-2'>
          <FieldLabel
            label='IMSI'
            description='1-15 digit number (required for LwM2M devices)'
          />
          <Input
            value={formData.imsi}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, imsi: e.target.value }))
            }
            placeholder='1-15 digit number'
            pattern='\d{1,15}'
            maxLength={15}
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
            maxLength={16}
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
              setFormData((prev) => ({ ...prev, auth_code: e.target.value }))
            }
            placeholder='Enter auth code'
            pattern='[a-zA-Z0-9]{1,16}'
            maxLength={16}
          />
        </div>
      </div>

      <Button
        className='w-full'
        onClick={handleSubmit}
        disabled={loading || !isFormValid() || !apiKey}
      >
        {loading ? 'Creating Equipment...' : 'Create Equipment'}
      </Button>

      {/* Response Display */}
      {response && (
        <div className='space-y-4'>
          {response.code === 0 ? (
            <Alert>
              <AlertDescription className='space-y-2'>
                <p className='font-medium text-green-600'>
                  Equipment created successfully!
                </p>
                <p>Device ID: {response.data.did}</p>
                <p>Security Key: {response.data.sec_key}</p>
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
  )
}
