'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { NewEquipmentForm } from './new-equipment-old' // Rename existing form
import { NewEquipmentFormV2 } from './new-equipment-v2' // New version
import { AuthProps } from '@/types/common'

export function NewEquipmentSelector({ auth }: { auth: AuthProps }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Equipment</CardTitle>
      </CardHeader>
      <CardContent>
        {auth.version === 'v1' ? (
          <NewEquipmentForm apiKey={auth.apiKey} />
        ) : (
          <NewEquipmentFormV2 apiKey={auth.token} />
        )}
      </CardContent>
    </Card>
  )
}
