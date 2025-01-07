"use client"

import React, { useState } from 'react'
import { AlertCircle, ChevronDown, ChevronUp, Info} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { endpoints } from '@/config/apiEndpoints'
import {
  FormData,
  ApiResponse,
  ApiEndpoint,
  UpdateEquipmentData,
  BaseEquipmentData, Other, Location
} from '@/types/apiEndpoint'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'



const ApiTester: React.FC = () => {
  const [activeEndpoint, setActiveEndpoint] = useState<string | null>(null)
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [apiKey, setApiKey] = useState<string>('')

  const [formData, setFormData] = useState<FormData>({
    'new-equipment': { ...endpoints[0].defaultBody },
    'update-equipment': { ...endpoints[1].defaultBody, device_id: '' },
  })

  const renderFieldDescription = (description: string) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className='h-4 w-4 ml-2 inline cursor-help' />
        </TooltipTrigger>
        <TooltipContent>
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  type BaseEquipmentKeys = keyof BaseEquipmentData
  type UpdateEquipmentKeys = keyof UpdateEquipmentData
  type AllEquipmentKeys = BaseEquipmentKeys | UpdateEquipmentKeys

  // Update the renderField function with proper typing
  const renderField = (
    endpointId: keyof FormData,
    field: AllEquipmentKeys, // specify that field must be a key of our data types
    label: string,
    required: boolean,
    description: string,
    type: string = 'text'
  ) => {
    // Use type assertion to handle the index signature
    const value = (formData[endpointId] as any)[field]

    return (
      <div className='space-y-2'>
        <div className='flex items-center'>
          <Label htmlFor={String(`${endpointId}-${String(field)}`)}>
            {label}
            {required && <span className='text-red-500 ml-1'>*</span>}
          </Label>
          {renderFieldDescription(description)}
        </div>
        <Input
          id={`${endpointId}-${String(field)}`}
          type={type}
          value={value}
          onChange={(e) => handleInputChange(endpointId, field, e.target.value)}
          required={required}
        />
      </div>
    )
  }

  const handleInputChange = (
    endpointId: keyof FormData,
    field: AllEquipmentKeys,
    value: string | boolean
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [endpointId]: {
        ...prev[endpointId],
        [field]: value,
      } as BaseEquipmentData | UpdateEquipmentData,
    }))
  }

  // Update handleNestedInputChange for nested objects
  type NestedKeys = 'location' | 'other'
  type LocationKeys = keyof Location
  type OtherKeys = keyof Other

  const handleNestedInputChange = (
    endpointId: keyof FormData,
    parent: NestedKeys,
    field: LocationKeys | OtherKeys,
    value: string | number
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [endpointId]: {
        ...prev[endpointId],
        [parent]: {
          ...(prev[endpointId][parent] as any),
          [field]: value,
        },
      } as BaseEquipmentData | UpdateEquipmentData,
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
      <Card>
        <CardHeader>
          <CardTitle>API Testing Interface</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='mb-6'>
            <Label htmlFor='api-key'>API Key</Label>
            <Input
              id='api-key'
              type='text'
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder='Enter your API key'
              className='mt-2'
            />
          </div>

          <Accordion type='single' collapsible>
            {endpoints.map((endpoint) => (
              <AccordionItem key={endpoint.id} value={endpoint.id}>
                <AccordionTrigger>
                  <div className='flex items-center'>
                    <Badge
                      variant={
                        endpoint.method === 'POST' ? 'default' : 'secondary'
                      }
                    >
                      {endpoint.method}
                    </Badge>
                    <span className='ml-2'>{endpoint.name}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className='space-y-4'>
                    <Alert>
                      <AlertDescription>
                        <strong>Endpoint URL:</strong> {endpoint.url}
                        {endpoint.id === 'update-equipment' && ' + device_id'}
                      </AlertDescription>
                    </Alert>

                    {/* Device ID (only for update endpoint) */}
                    {endpoint.id === 'update-equipment' && (
                      <div className='space-y-2'>
                        {renderField(
                          endpoint.id,
                          'device_id',
                          'Device ID',
                          true,
                          'The unique identifier of the device you want to update'
                        )}
                      </div>
                    )}

                    {renderField(
                      endpoint.id,
                      'title',
                      'Device Name',
                      endpoint.id === 'new-equipment',
                      'Name of your device'
                    )}

                    {renderField(
                      endpoint.id,
                      'desc',
                      'Description',
                      false,
                      'Optional description of your device'
                    )}

                    <div className='space-y-2'>
                      <Label>
                        Tags
                        {renderFieldDescription(
                          'Comma-separated tags for categorizing your device'
                        )}
                      </Label>
                      <Input
                        value={formData[endpoint.id].tags.join(', ')}
                        onChange={(e) =>
                          handleTagsChange(endpoint.id, e.target.value)
                        }
                        placeholder='e.g. china, mobile'
                      />
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                      {/* Location fields */}
                      <div className='space-y-2'>
                        <Label>Longitude</Label>
                        <Input
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
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label>Latitude</Label>
                        <Input
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
                        />
                      </div>
                    </div>

                    {/* Other fields */}
                    {/* ... Rest of your fields using the same pattern ... */}

                    <Button
                      onClick={() => handleSubmit(endpoint)}
                      disabled={loading}
                      className='w-full'
                    >
                      {loading ? 'Sending...' : 'Send Request'}
                    </Button>

                    {response && (
                      <div className='mt-4'>
                        <h3 className='font-medium mb-2'>Response:</h3>
                        <pre className='bg-slate-100 p-4 rounded-md overflow-x-auto'>
                          {JSON.stringify(response, null, 2)}
                        </pre>

                        {/* Response explanation */}
                        <div className='mt-4 text-sm text-gray-600'>
                          <h4 className='font-medium'>Response Explanation:</h4>
                          <ul className='list-disc pl-5 mt-2'>
                            <li>
                              <strong>errno:</strong> 0 indicates success, other
                              values indicate errors
                            </li>
                            <li>
                              <strong>error:</strong> "succ" means the operation
                              was successful
                            </li>
                            {endpoint.id === 'new-equipment' && (
                              <li>
                                <strong>device_id:</strong> The unique
                                identifier assigned to your new device
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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
    </div>
  )
}

export default ApiTester
