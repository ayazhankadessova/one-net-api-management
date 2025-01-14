// app/api/devices/route.ts
import { type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('api-key')
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key is required' }), {
        status: 401,
      })
    }

    const body = await request.json()

    // Build query parameters
    const queryParams = new URLSearchParams()
    if (body.key_words) queryParams.append('key_words', body.key_words)
    if (body.auth_info) queryParams.append('auth_info', body.auth_info)
    if (body.tag) queryParams.append('tag', body.tag.join(','))
    if (body.online !== undefined)
      queryParams.append('online', body.online.toString())
    if (body.private !== undefined)
      queryParams.append('private', body.private.toString())
    if (body.page) queryParams.append('page', body.page.toString())
    if (body.per_page) queryParams.append('per_page', body.per_page.toString())
    if (body.device_id) queryParams.append('device_id', body.device_id)
    if (body.begin) queryParams.append('begin', body.begin)
    if (body.end) queryParams.append('end', body.end)

    const response = await fetch(
      `http://api.onenet.hk.chinamobile.com/devices?${queryParams.toString()}`,
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
        data: { devices: [], total_count: 0, page: 1, per_page: 30 },
      },
      { status: 500 }
    )
  }
}
