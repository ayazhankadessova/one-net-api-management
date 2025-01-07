"use client"

import React, { useState } from 'react'
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { endpoints } from '@/config/apiEndpoints'
import { FormData, ApiResponse } from '@/types/apiEndpoint'


const ApiTester: React.FC = () => {
  const [activeEndpoint, setActiveEndpoint] = useState<string | null>(null)
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [apiKey, setApiKey] = useState<string>('')

  const [formData, setFormData] = useState<FormData>({
    'new-equipment': { ...endpoints[0].defaultBody },
    'update-equipment': { ...endpoints[1].defaultBody, device_id: '' },
  })

  const handleInputChange = (
    endpointId: keyof FormData,
    field: string,
    value: string
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [endpointId]: {
        ...prev[endpointId],
        [field]: value,
      },
    }))
  }

  const handleNestedInputChange = (
    endpointId: keyof FormData,
    parent: 'location' | 'other',
    field: string,
    value: string | number
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [endpointId]: {
        ...prev[endpointId],
        [parent]: {
          ...prev[endpointId][parent],
          [field]: value,
        },
      },
    }))
  }

  const handleTagsChange = (
    endpointId: keyof FormData,
    value: string
  ): void => {
    const tagsArray = value.split(',').map((tag) => tag.trim())
    handleInputChange(endpointId, 'tags', tagsArray as unknown as string)
  }

  const handleSubmit = async (endpoint: ApiEndpoint): Promise<void> => {
    setLoading(true)
    try {
      let url = endpoint.url
      if (endpoint.id === 'update-equipment') {
        url += (formData[endpoint.id] as UpdateEquipmentData).device_id
      }

      const response = await fetch(url, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify(formData[endpoint.id]),
      })

      const data: ApiResponse = await response.json()
      setResponse(data)
    } catch (error) {
      setResponse({ error: (error as Error).message })
    }
    setLoading(false)
  }

  return (
    <div className='max-w-4xl mx-auto p-6 space-y-6'>
      <div className='mb-6'>
        <label className='block text-sm font-medium mb-2'>API Key</label>
        <input
          type='text'
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className='w-full p-2 border rounded'
          placeholder='Enter your API key'
        />
      </div>

      {endpoints.map((endpoint) => (
        <div key={endpoint.id} className='border rounded-lg p-4'>
          <div
            className='flex justify-between items-center cursor-pointer'
            onClick={() =>
              setActiveEndpoint(
                activeEndpoint === endpoint.id ? null : endpoint.id
              )
            }
          >
            <div>
              <span className='inline-block px-2 py-1 text-xs font-bold rounded bg-blue-100 text-blue-800 mr-2'>
                {endpoint.method}
              </span>
              <span className='font-medium'>{endpoint.name}</span>
            </div>
            {activeEndpoint === endpoint.id ? <ChevronUp /> : <ChevronDown />}
          </div>

          {activeEndpoint === endpoint.id && (
            <div className='mt-4 space-y-4'>
              <div className='text-sm text-gray-600'>
                <strong>URL:</strong> {endpoint.url}
              </div>

              {endpoint.id === 'update-equipment' && (
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Device ID
                  </label>
                  <input
                    type='text'
                    value={formData[endpoint.id].device_id}
                    onChange={(e) =>
                      handleInputChange(
                        endpoint.id,
                        'device_id',
                        e.target.value
                      )
                    }
                    className='w-full p-2 border rounded'
                  />
                </div>
              )}

              <div>
                <label className='block text-sm font-medium mb-2'>Title</label>
                <input
                  type='text'
                  value={formData[endpoint.id].title}
                  onChange={(e) =>
                    handleInputChange(endpoint.id, 'title', e.target.value)
                  }
                  className='w-full p-2 border rounded'
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>
                  Description
                </label>
                <input
                  type='text'
                  value={formData[endpoint.id].desc}
                  onChange={(e) =>
                    handleInputChange(endpoint.id, 'desc', e.target.value)
                  }
                  className='w-full p-2 border rounded'
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>
                  Tags (comma-separated)
                </label>
                <input
                  type='text'
                  value={formData[endpoint.id].tags.join(', ')}
                  onChange={(e) =>
                    handleTagsChange(endpoint.id, e.target.value)
                  }
                  className='w-full p-2 border rounded'
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Longitude
                  </label>
                  <input
                    type='number'
                    value={formData[endpoint.id].location.lon || ''}
                    onChange={(e) =>
                      handleNestedInputChange(
                        endpoint.id,
                        'location',
                        'lon',
                        parseFloat(e.target.value)
                      )
                    }
                    className='w-full p-2 border rounded'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Latitude
                  </label>
                  <input
                    type='number'
                    value={formData[endpoint.id].location.lat || ''}
                    onChange={(e) =>
                      handleNestedInputChange(
                        endpoint.id,
                        'location',
                        'lat',
                        parseFloat(e.target.value)
                      )
                    }
                    className='w-full p-2 border rounded'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>
                  Auth Info
                </label>
                <input
                  type='text'
                  value={formData[endpoint.id].auth_info}
                  onChange={(e) =>
                    handleInputChange(endpoint.id, 'auth_info', e.target.value)
                  }
                  className='w-full p-2 border rounded'
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Version
                  </label>
                  <input
                    type='text'
                    value={formData[endpoint.id].other.version}
                    onChange={(e) =>
                      handleNestedInputChange(
                        endpoint.id,
                        'other',
                        'version',
                        e.target.value
                      )
                    }
                    className='w-full p-2 border rounded'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Manufacturer
                  </label>
                  <input
                    type='text'
                    value={formData[endpoint.id].other.manufacturer}
                    onChange={(e) =>
                      handleNestedInputChange(
                        endpoint.id,
                        'other',
                        'manufacturer',
                        e.target.value
                      )
                    }
                    className='w-full p-2 border rounded'
                  />
                </div>
              </div>

              <button
                onClick={() => handleSubmit(endpoint)}
                disabled={loading}
                className='w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300'
              >
                {loading ? 'Sending...' : 'Send Request'}
              </button>

              {response && (
                <div className='mt-4'>
                  <h3 className='font-medium mb-2'>Response:</h3>
                  <pre className='bg-gray-100 p-4 rounded overflow-x-auto'>
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {!apiKey && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            Please enter an API key to make requests
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default ApiTester
