'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { NewEquipmentForm } from './new-equipment-old' // Rename existing form
import { NewEquipmentFormV2 } from './new-equipment-v2' // New version
import { AuthProps } from '@/types/common'

export function NewEquipmentSelector({ auth }: { auth: AuthProps }) {
  const [version, setVersion] = useState<'v1' | 'v2'>('v2')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Equipment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          <div className='space-y-2'>
            <Label>API Version</Label>
            <RadioGroup
              defaultValue='v2'
              onValueChange={(value) => setVersion(value as 'v1' | 'v2')}
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

          <Separator />

          {version === 'v1' ? (
            <NewEquipmentForm apiKey={auth.apiKey} />
          ) : (
            <NewEquipmentFormV2 apiKey={auth.token} />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
