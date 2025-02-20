// app/api/devices/file-space/route.ts
import { generateToken } from '@/lib/token'

export async function GET() {
  try {
    const userId = '292608' // Your user ID
    const accessKey = 'Hu7wiQmlo6FQIeRtU7w/KNQmBEnHg/RZ1pMEkCKbv11MfQxln6qYMq4BJi6vgdaWHFdI5HB6WovnN+1imDuP2w=='

    // Generate token using the utility function
    const token = await generateToken(userId, accessKey)
    console.log(token)

    const response = await fetch(
      'https://www.onenet.hk.chinamobile.com:2616/device/file-space',
      {
        method: 'GET',
        headers: {
          Authorization: token,
        },
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
