'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDevices } from '@/contexts/DevicesContext'
import { NewEquipmentSelector } from '@/components/new-equipment'
import { UpdateEquipmentForm } from '@/components/update-equipment-form'
import { QueryDatastreamsForm } from '@/components/query-datastreams'
import { DeviceDataVisualization } from '@/components/device-data-visualization' 
import { QueryDevicesForm } from '@/components/query-device-details' 
import { DeviceFileUpload } from '@/components/device-file-upload'
import {FileSpaceInfo} from '@/components/file-space-info'

export default function Home() {
  const [apiKey, setApiKey] = useState(
    'R1kwRk5tdXlSRXVXTkVGdjBYeU83UEhTWmlaVjNNRWs='
  )
  const [loading, setLoading] = useState(false)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const { setDevices, devices } = useDevices()
  // length of devices

  const fetchDevices = async () => {
    if (!apiKey) return

    setLoading(true)
    try {
      const response = await fetch('/api/devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          per_page: 100, // Get maximum devices
          page: 1,
        }),
      })

      const data = await response.json()
      console.log(data)
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
      title: 'Device Details',
      description: 'Query device information',
    },
    {
      id: 'upload',
      title: 'Upload File',
      description: 'Upload device-related files',
    },
  ]

  const renderSelectedComponent = () => {
    switch (selectedAction) {
      case 'new':
        return <NewEquipmentSelector apiKey={apiKey} />
      case 'update':
        return <UpdateEquipmentForm apiKey={apiKey} />
      case 'query':
        return <QueryDatastreamsForm apiKey={apiKey} />
      case 'data':
        return <DeviceDataVisualization apiKey={apiKey} />
      case 'details':
        return <QueryDevicesForm apiKey={apiKey} />
      case 'upload':
        return <FileSpaceInfo />
      default:
        return null
    }
  }

  return (
    <div className='container mx-auto p-20 space-y-6'>
      {/* API Key Card */}
      <Card>
        <CardHeader>
          <CardTitle>OneNET Equipment Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='api-key'>API Key</Label>
              <div className='flex gap-2'>
                <Input
                  id='api-key'
                  type='password'
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder='Enter your API key'
                />
                <Button onClick={fetchDevices} disabled={!apiKey || loading}>
                  {loading ? 'Getting Devices...' : 'Get Devices'}
                </Button>
              </div>
            </div>

            {/* {devices.length > 0 && (
              <Alert>
                <AlertDescription className='text-sm text-muted-foreground'>
                  Found {devices.length} devices for this API key
                </AlertDescription>
              </Alert>
            )} */}
          </div>
        </CardContent>
      </Card>

      {!apiKey && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            Please enter an API key to make requests
          </AlertDescription>
        </Alert>
      )}

      {/* Actions Grid */}
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
