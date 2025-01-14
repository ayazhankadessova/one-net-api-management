'use client'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDevices } from '@/contexts/DevicesContext'
import { NewEquipmentForm } from '@/components/new-equipment'
import { UpdateEquipmentForm } from '@/components/update-equipment-form'
import { QueryDatastreamsForm } from '@/components/query-datastreams'
import { DeviceDataVisualization } from '@/components/device-data-visualization' 
import { QueryDevicesForm } from '@/components/query-device-details' 

export default function Home() {
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(false)
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
      if (data.errno === 0) {
        setDevices(data.data.devices)
      }
    } catch (error) {
      console.error('Failed to fetch devices:', error)
    }
    setLoading(false)
  }

  return (
    <div className='container mx-auto p-20 space-y-6'>
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

            {/* Show devices count if available */}
            {devices.length > 0 && (
              <Alert>
                <AlertDescription className='text-sm text-muted-foreground'>
                  Found {devices.length} devices for this API key
                </AlertDescription>
              </Alert>
            )}
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

      <Tabs defaultValue='new' className='space-y-4'>
        <TabsList className='grid w-full grid-cols-5'>
          {' '}
          <TabsTrigger value='new'>New Equipmet</TabsTrigger>
          <TabsTrigger value='update'>Update Equipment</TabsTrigger>
          <TabsTrigger value='query'>Query DataStreams</TabsTrigger>
          <TabsTrigger value='data'>Historical Data</TabsTrigger>{' '}
          <TabsTrigger value='details'>Batch Query Device Details</TabsTrigger>
          {/* New tab */}
        </TabsList>

        <TabsContent value='new' className='mt-6'>
          <NewEquipmentForm apiKey={apiKey} />
        </TabsContent>
        <TabsContent value='update' className='mt-6'>
          <UpdateEquipmentForm apiKey={apiKey} />
        </TabsContent>
        <TabsContent value='query' className='mt-6'>
          <QueryDatastreamsForm apiKey={apiKey} />
        </TabsContent>
        <TabsContent value='data' className='mt-6'>
          <DeviceDataVisualization apiKey={apiKey} />
        </TabsContent>
        <TabsContent value='details' className='mt-6'>
          <QueryDevicesForm apiKey={apiKey} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
