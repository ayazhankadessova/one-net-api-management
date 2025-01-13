// app/api/devices/[deviceId]/datapoints/route.ts
import { type NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ deviceId: string }> }
) {
  try {
    const { searchParams } = new URL(request.url)
    const apiKey = request.headers.get('api-key')
    const { deviceId : device_Id } = await params
    // const deviceId = params.deviceId

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key is required' }), {
        status: 401,
      })
    }

    const response = await fetch(
      `http://api.onenet.hk.chinamobile.com/devices/${
        device_Id
      }/datapoints?${searchParams.toString()}`,
      {
        headers: {
          'api-key': apiKey,
        },
      }
    )

    const data = await response.json()
    return Response.json(data)
  } catch (error) {
    return Response.json(
      {
        errno: -1,
        error: error instanceof Error ? error.message : 'An error occurred',
        data: { count: '0', datastreams: [] },
      },
      { status: 500 }
    )
  }
}
