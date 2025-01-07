// app/api/equipment/[id]/route.ts
import { NextResponse } from 'next/server'
import { BASE_URL } from '@/config/apiEndpoints'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const device_id = params.id
    const apiKey = request.headers.get('api-key')
    const updateData = await request.json()

    if (!apiKey) {
      return NextResponse.json(
        { errno: -1, error: 'API key is required' },
        { status: 400 }
      )
    }

    const response = await fetch(`${BASE_URL}/devices/${device_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(updateData),
    })

    // Check content type to ensure we're getting JSON
    const contentType = response.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      console.error('Unexpected response type:', contentType)
      return NextResponse.json(
        {
          errno: -1,
          error: 'Unexpected response from server',
        },
        { status: 500 }
      )
    }

    try {
      const data = await response.json()

      if (!response.ok) {
        return NextResponse.json(data, { status: response.status })
      }

      return NextResponse.json(data)
    } catch (parseError) {
      console.error('Error parsing response:', parseError)
      return NextResponse.json(
        {
          errno: -1,
          error: 'Invalid response from server',
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error updating equipment:', error)
    return NextResponse.json(
      {
        errno: -1,
        error: error instanceof Error ? error.message : 'An error occurred',
      },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const device_id = params.id
    const apiKey = request.headers.get('api-key')

    if (!apiKey) {
      return NextResponse.json(
        { errno: -1, error: 'API key is required' },
        { status: 400 }
      )
    }

    const response = await fetch(`${BASE_URL}/devices/${device_id}`, {
      headers: {
        'api-key': apiKey,
      },
    })

    // Check content type to ensure we're getting JSON
    const contentType = response.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      console.error('Unexpected response type:', contentType)
      return NextResponse.json(
        {
          errno: -1,
          error: 'Unexpected response from server',
        },
        { status: 500 }
      )
    }

    try {
      const data = await response.json()

      if (!response.ok) {
        return NextResponse.json(data, { status: response.status })
      }

      return NextResponse.json(data)
    } catch (parseError) {
      console.error('Error parsing response:', parseError)
      return NextResponse.json(
        {
          errno: -1,
          error: 'Invalid response from server',
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error fetching equipment:', error)
    return NextResponse.json(
      {
        errno: -1,
        error: error instanceof Error ? error.message : 'An error occurred',
      },
      { status: 500 }
    )
  }
}
