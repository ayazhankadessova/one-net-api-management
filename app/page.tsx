// app/page.tsx
'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { NewEquipmentForm } from '@/components/new-equipment'
import { UpdateEquipmentForm } from '@/components/update-equipment-form'

export default function Home() {
  const [apiKey, setApiKey] = useState('')

  return (
    <div className='container mx-auto p-20 space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>OneNET Equipment Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <Label htmlFor='api-key'>API Key</Label>
            <Input
              id='api-key'
              type='password'
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder='Enter your API key'
            />
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
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='new'>New Equipment</TabsTrigger>
          <TabsTrigger value='update'>Update Equipment</TabsTrigger>
        </TabsList>
        <TabsContent value='new' className='mt-6'>
          <NewEquipmentForm apiKey={apiKey} />
        </TabsContent>
        <TabsContent value='update' className='mt-6'>
          <UpdateEquipmentForm apiKey={apiKey} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
