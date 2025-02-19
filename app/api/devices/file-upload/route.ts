// app/api/devices/file-upload/route.ts
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const apiKey = request.headers.get('api-key')

    if (!apiKey) {
      return Response.json({ error: 'API key is required' }, { status: 401 })
    }

    // Forward the request to OneNET
    const response = await fetch(
      'https://www.onenet.hk.chinamobile.com:2616/device/file-upload',
      {
        method: 'POST',
        headers: {
          'api-key': apiKey,
        },
        body: formData,
      }
    )

    const data = await response.json()
    console.log(data)
    return Response.json(data)
  } catch (error) {
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
