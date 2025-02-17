// app/api/devices/file-upload/route.ts
import { NextRequest } from 'next/server'
import axios from 'axios'
import https from 'https'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const apiKey = request.headers.get('api-key')

    if (!apiKey) {
      return Response.json({ error: 'API key is required' }, { status: 401 })
    }

    // Create axios instance with custom config
    const instance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    })

    // Create form data
    const outgoingFormData = new FormData()
    outgoingFormData.append('did', formData.get('did') as string)
    outgoingFormData.append('upfile', formData.get('file') as Blob)
    outgoingFormData.append('platform_ver', '5.1')

    // Make request using axios
    const response = await instance.post(
      'https://onenet.hk.chinamobile.com/fuse/middlelayer/devicefile/upload',
      outgoingFormData,
      {
        headers: {
          Authorization: apiKey,
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    console.log('Response:', response.data)
    return Response.json(response.data)
  } catch (error) {
    console.error('Full error:', error)

    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data)
      console.error('Response status:', error.response?.status)
      console.error('Response headers:', error.response?.headers)

      return Response.json(
        {
          code: -1,
          msg: error.response?.data?.message || error.message,
          data: null,
        },
        { status: error.response?.status || 500 }
      )
    }

    return Response.json(
      {
        code: -1,
        msg: error instanceof Error ? error.message : 'An error occurred',
        data: null,
      },
      { status: 500 }
    )
  }
}
