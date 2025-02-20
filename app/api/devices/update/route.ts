// app/api/devices/update/route.ts
import { headers } from 'next/headers'

export async function POST(request: Request) {
  try {
    const headersList = await headers()
    const token = headersList.get('authorization')

    if (!token) {
      return Response.json(
        {
          code: 401,
          msg: 'Authentication required!',
          request_id: '',
        },
        { status: 401 }
      )
    }

    const body = await request.json()

    const response = await fetch(
      'https://www.onenet.hk.chinamobile.com:2616/device/update',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(body),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return Response.json(
        {
          code: data.code || response.status,
          msg: data.msg || 'Request failed',
          request_id: data.request_id,
        },
        { status: response.status }
      )
    }

    return Response.json(data)
  } catch (error) {
    console.error('Error updating device:', error)
    return Response.json(
      {
        code: 500,
        msg: error instanceof Error ? error.message : 'An error occurred',
        request_id: '',
      },
      { status: 500 }
    )
  }
}
