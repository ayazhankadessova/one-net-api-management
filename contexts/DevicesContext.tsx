// contexts/DevicesContext.tsx
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Device } from '@/types/deviceDetails'

interface DeviceContextType {
  devices: Device[]
  setDevices: (devices: Device[]) => void
  addDevices: (newDevices: Device[]) => void
  clearDevices: () => void
}

const DevicesContext = createContext<DeviceContextType | undefined>(undefined)

export function DevicesProvider({ children }: { children: React.ReactNode }) {
  // Try to load saved devices from localStorage on mount
  const [devices, setDevices] = useState<Device[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('devices')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  // Save devices to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('devices', JSON.stringify(devices))
  }, [devices])

  const addDevices = (newDevices: Device[]) => {
    setDevices((prevDevices) => {
      // Create a Map with existing devices for efficient lookup
      const existingDevices = new Map(prevDevices.map((d) => [d.id, d]))

      // Add or update devices
      newDevices.forEach((device) => {
        existingDevices.set(device.id, device)
      })

      // Convert back to array
      return Array.from(existingDevices.values())
    })
  }

  const clearDevices = () => {
    setDevices([])
    localStorage.removeItem('devices')
  }

  return (
    <DevicesContext.Provider
      value={{ devices, setDevices, addDevices, clearDevices }}
    >
      {children}
    </DevicesContext.Provider>
  )
}

export function useDevices() {
  const context = useContext(DevicesContext)
  if (context === undefined) {
    throw new Error('useDevices must be used within a DevicesProvider')
  }
  return context
}
