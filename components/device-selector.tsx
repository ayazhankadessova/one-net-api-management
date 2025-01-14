// components/device-selector.tsx
'use client'

import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDevices } from '@/contexts/DevicesContext'

interface DeviceSelectorProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
}

export function DeviceSelector({
  value,
  onValueChange,
  placeholder = 'Select a device',
}: DeviceSelectorProps) {
  const { devices } = useDevices()

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {devices.map((device) => (
          <SelectItem key={device.id} value={device.id}>
            {device.title} ({device.id})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
