// app/api/devices/file-upload/route.ts
import { NextRequest } from 'next/server'
import { generateToken } from '@/lib/token'

export async function POST(request: NextRequest) {
  try {

    const userId = '292608' // Your user ID
    const accessKey =
      'Hu7wiQmlo6FQIeRtU7w/KNQmBEnHg/RZ1pMEkCKbv11MfQxln6qYMq4BJi6vgdaWHFdI5HB6WovnN+1imDuP2w=='

    // Generate token using the utility function
    const token = await generateToken(userId, accessKey)
    console.log(token)
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

    console.log(response)
  
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