// app/api/devices/file-upload/route.ts
import { NextRequest } from 'next/server'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Get authorization token from request headers
    const headersList = await headers()
    const token = headersList.get('authorization')

    if (!token) {
      return Response.json(
        {
          code: 401,
          msg: 'Authentication required!',
          request_id: '',
          data: { fid: '' },
        },
        { status: 401 }
      )
    }

    const formData = await request.formData()

    const response = await fetch(
      'https://www.onenet.hk.chinamobile.com:2616/device/file-upload',
      {
        method: 'POST',
        headers: {
          Authorization: token,
        },
        body: formData,
      }
    )

    const data = await response.json()
    if (!response.ok) {
      return Response.json(
        {
          code: data.code || response.status,
          msg: data.msg || 'Request failed',
          request_id: data.request_id || '',
          data: { fid: '' },
        },
        { status: response.status }
      )
    }

    return Response.json(data)
  } catch (error) {
    console.error('Error in file upload:', error)
    return Response.json(
      {
        code: -1,
        msg: error instanceof Error ? error.message : 'An error occurred',
        request_id: '',
        data: { fid: '' },
      },
      { status: 500 }
    )
  }
}
