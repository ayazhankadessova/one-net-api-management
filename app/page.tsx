'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { generateToken } from '@/lib/token'
import { useDevices } from '@/contexts/DevicesContext'
import { NewEquipmentSelector } from '@/components/new-equipment'
import { UpdateEquipmentForm } from '@/components/update-equipment-form'
import { QueryDatastreamsForm } from '@/components/query-datastreams'
import { DeviceDataVisualization } from '@/components/device-data-visualization'
import { QueryDevicesForm } from '@/components/query-device-details'
import { FileSpaceInfo } from '@/components/file-space-info'
import { DeviceFileUpload } from '@/components/device-file-upload'
import { AuthProps } from '@/types/common'

interface ApiConfig {
  version: 'v1' | 'v2'
  apiKey?: string
  userId?: string
  accessKey?: string
  token?: string
}

export default function Home() {
  const [apiConfig, setApiConfig] = useState<ApiConfig>({
    version: 'v1',
    apiKey: '',
  })
  const [loading, setLoading] = useState(false)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const { setDevices, devices } = useDevices()

  const generateAuthToken = () => {
    if (apiConfig.userId && apiConfig.accessKey) {
      generateToken(apiConfig.userId, apiConfig.accessKey).then((token) => {
        setApiConfig((prev) => ({ ...prev, token }))
      })
    }
  }

  const fetchDevices = async () => {
    if (!apiConfig.apiKey) return

    setLoading(true)
    try {
      const response = await fetch('/api/devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiConfig.apiKey,
        },
        body: JSON.stringify({
          per_page: 100,
          page: 1,
        }),
      })

      const data = await response.json()
      if (data.errno === 0) {
        setDevices(data.data.devices)
      }
    } catch (error) {
      console.error('Failed to fetch devices:', error)
    }
    setLoading(false)
  }

  const actions = [
    { id: 'new', title: 'New Equipment', description: 'Create a new device' },
    {
      id: 'update',
      title: 'Update Equipment',
      description: 'Modify existing device',
    },
    {
      id: 'query',
      title: 'Query DataStreams',
      description: 'View device datastreams',
    },
    {
      id: 'data',
      title: 'Historical Data',
      description: 'View historical device data',
    },
    {
      id: 'details',
      title: 'Batch Query Device Details',
      description: 'Query device information',
    },
    {
      id: 'upload',
      title: 'Upload File',
      description: 'Upload device-related files',
    },
    {
      id: 'space',
      title: 'Storage Space',
      description: 'View file storage information',
    },
  ]

  const renderSelectedComponent = () => {
    const auth: AuthProps = {
      version: apiConfig.version,
      ...(apiConfig.version === 'v1'
        ? { apiKey: apiConfig.apiKey }
        : { token: apiConfig.token }),
    }

    switch (selectedAction) {
      case 'new':
        return <NewEquipmentSelector auth={auth} />
      case 'update':
        return <UpdateEquipmentForm auth={auth} />
      case 'query':
        return <QueryDatastreamsForm auth={auth} />
      case 'data':
        return <DeviceDataVisualization auth={auth} />
      case 'details':
        return <QueryDevicesForm auth={auth} />
      case 'upload':
        return <DeviceFileUpload auth={auth} />
      case 'space':
        return <FileSpaceInfo auth={auth} />
      default:
        return null
    }
  }

  const isAuthValid =
    apiConfig.version === 'v1' ? !!apiConfig.apiKey : !!apiConfig.token

  return (
    <div className='container mx-auto p-20 space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>OneNET Equipment Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label>API Version</Label>
              <RadioGroup
                value={apiConfig.version}
                onValueChange={(value: 'v1' | 'v2') => {
                  setApiConfig({ version: value })
                }}
                className='flex space-x-4'
              >
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='v1' id='v1' />
                  <Label htmlFor='v1'>Legacy Version</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='v2' id='v2' />
                  <Label htmlFor='v2'>New Version (2024)</Label>
                </div>
              </RadioGroup>
            </div>

            {apiConfig.version === 'v1' ? (
              <div className='space-y-2'>
                <Label htmlFor='api-key'>API Key</Label>
                <div className='flex gap-2'>
                  <Input
                    id='api-key'
                    type='password'
                    value={apiConfig.apiKey}
                    onChange={(e) =>
                      setApiConfig((prev) => ({
                        ...prev,
                        apiKey: e.target.value,
                      }))
                    }
                    placeholder='Enter your API key'
                  />
                  <Button
                    onClick={fetchDevices}
                    disabled={!apiConfig.apiKey || loading}
                  >
                    {loading ? 'Getting Devices...' : 'Get Devices'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='user-id'>User ID</Label>
                  <Input
                    id='user-id'
                    value={apiConfig.userId}
                    onChange={(e) =>
                      setApiConfig((prev) => ({
                        ...prev,
                        userId: e.target.value,
                      }))
                    }
                    placeholder='Enter your user ID'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='access-key'>Access Key</Label>
                  <Input
                    id='access-key'
                    type='password'
                    value={apiConfig.accessKey}
                    onChange={(e) =>
                      setApiConfig((prev) => ({
                        ...prev,
                        accessKey: e.target.value,
                      }))
                    }
                    placeholder='Enter your access key'
                  />
                </div>
                <Button
                  onClick={generateAuthToken}
                  disabled={!apiConfig.userId || !apiConfig.accessKey}
                >
                  Generate Token
                </Button>
                {apiConfig.token && (
                  <Alert>
                    <AlertDescription className='font-mono text-xs break-all'>
                      {apiConfig.token}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {apiConfig.version === 'v1' && devices.length > 0 && (
              <Alert>
                <AlertDescription className='text-sm text-muted-foreground'>
                  Found {devices.length} devices
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {!isAuthValid && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            {apiConfig.version === 'v1'
              ? 'Please enter an API key to make requests'
              : 'Please generate a token to make requests'}
          </AlertDescription>
        </Alert>
      )}

      {!selectedAction ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {actions.map((action) => (
            <Card
              key={action.id}
              className='cursor-pointer hover:border-primary transition-colors'
              onClick={() => setSelectedAction(action.id)}
            >
              <CardHeader>
                <CardTitle className='text-lg'>{action.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>
                  {action.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className='space-y-4'>
          <Button variant='outline' onClick={() => setSelectedAction(null)}>
            ← Back to Actions
          </Button>
          {renderSelectedComponent()}
        </div>
      )}
    </div>
  )
}
