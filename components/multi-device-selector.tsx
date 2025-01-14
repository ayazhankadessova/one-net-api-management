// components/multi-device-selector.tsx
'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDevices } from '@/contexts/DevicesContext'

interface MultiDeviceSelectorProps {
  selectedIds: string[]
  onChange: (ids: string[]) => void
  placeholder?: string
}

export function MultiDeviceSelector({
  selectedIds = [],
  onChange,
  placeholder = 'Select a device...',
}: MultiDeviceSelectorProps) {
  const { devices = [] } = useDevices()

  const handleSelect = (deviceId: string) => {
    if (!selectedIds.includes(deviceId)) {
      onChange([...selectedIds, deviceId])
    }
  }

  const removeDevice = (deviceId: string) => {
    onChange(selectedIds.filter((id) => id !== deviceId))
  }

  return (
    <div className='space-y-2'>
      <Select onValueChange={handleSelect} value=''>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {devices.map((device) => (
            <SelectItem
              key={device.id}
              value={device.id}
              disabled={selectedIds.includes(device.id)}
            >
              {device.title || device.id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedIds.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {selectedIds.map((id) => {
            const device = devices.find((d) => d.id === id)
            if (!device) return null

            return (
              <Badge
                key={id}
                variant='secondary'
                className='flex items-center gap-1'
              >
                {device.title || device.id}
                <X
                  className='h-3 w-3 cursor-pointer hover:text-destructive'
                  onClick={() => removeDevice(id)}
                />
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}
