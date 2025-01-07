// app/api/equipment/route.ts
import { NextResponse } from 'next/server'

const BASE_URL = 'http://api.onenet.hk.chinamobile.com'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const apiKey = request.headers.get('api-key')

    if (!apiKey) {
      return NextResponse.json(
        { errno: -1, error: 'API key is required' },
        { status: 400 }
      )
    }

    const response = await fetch(`${BASE_URL}/devices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      {
        errno: -1,
        error: error instanceof Error ? error.message : 'An error occurred',
        data: { device_id: '' },
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const apiKey = request.headers.get('api-key')
    const { device_id, ...updateData } = body

    if (!apiKey) {
      return NextResponse.json(
        { errno: -1, error: 'API key is required' },
        { status: 400 }
      )
    }

    if (!device_id) {
      return NextResponse.json(
        { errno: -1, error: 'Device ID is required' },
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

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      {
        errno: -1,
        error: error instanceof Error ? error.message : 'An error occurred',
      },
      { status: 500 }
    )
  }
}

// GET route for datastreams
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const deviceId = searchParams.get('device_id')
    const datastreamIds = searchParams.get('datastream_ids')
    const apiKey = request.headers.get('api-key')

    if (!apiKey) {
      return NextResponse.json(
        { errno: -1, error: 'API key is required' },
        { status: 400 }
      )
    }

    if (!deviceId) {
      return NextResponse.json(
        { errno: -1, error: 'Device ID is required' },
        { status: 400 }
      )
    }

    let url = `${BASE_URL}/devices/${deviceId}/datastreams`
    if (datastreamIds) {
      url += `?datastream_ids=${datastreamIds}`
    }

    const response = await fetch(url, {
      headers: {
        'api-key': apiKey,
      },
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      {
        errno: -1,
        error: error instanceof Error ? error.message : 'An error occurred',
      },
      { status: 500 }
    )
  }
}
