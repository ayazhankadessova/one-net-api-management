// app/api/devices/file-space/route.ts
import { headers } from 'next/headers'

export async function GET() {
  try {
    const headersList = await headers()
    const token = headersList.get('authorization')
    const apiKey = headersList.get('api-key')

    if (!token && !apiKey) {
      return Response.json(
        {
          code: 401,
          msg: 'Authentication required!',
          request_id: '',
          data: null,
        },
        { status: 401 }
      )
    }

    const authHeaders: Record<string, string> = {}
    if (token) {
      authHeaders['Authorization'] = token
    }
    if (apiKey) {
      authHeaders['api-key'] = apiKey
    }

    const response = await fetch(
      'https://www.onenet.hk.chinamobile.com:2616/device/file-space',
      {
        method: 'GET',
        headers: authHeaders,
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return Response.json(
        {
          code: data.code || response.status,
          msg: data.msg || 'Request failed',
          request_id: data.request_id,
          data: null,
        },
        { status: response.status }
      )
    }

    return Response.json(data)
  } catch (error) {
    console.error('Error fetching file space:', error)
    return Response.json(
      {
        code: 500,
        msg: error instanceof Error ? error.message : 'An error occurred',
        request_id: '',
        data: null,
      },
      { status: 500 }
    )
  }
}
