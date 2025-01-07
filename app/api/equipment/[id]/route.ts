// app/api/equipment/[id]/route.ts
import { NextResponse } from 'next/server'
import { BASE_URL } from '@/config/apiEndpoints'

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const device_id = await context.params.id
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

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(errorData, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
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
