// app/api/datapoints/history/route.ts
import { headers } from 'next/headers'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get authorization token
    const headersList = await headers()
    const token = headersList.get('authorization')

    if (!token) {
      return Response.json(
        {
          code: 401,
          msg: 'Authentication required',
          request_id: '',
          data: { count: 0, datastreams: [] },
        },
        { status: 401 }
      )
    }

    // Get all query parameters
    const searchParams = request.nextUrl.searchParams

    // Required parameters
    const product_id = searchParams.get('product_id')
    const device_name = searchParams.get('device_name')

    // Validate required parameters
    if (!product_id || !device_name) {
      return Response.json(
        {
          code: 400,
          msg: 'product_id and device_name are required',
          request_id: '',
          data: { count: 0, datastreams: [] },
        },
        { status: 400 }
      )
    }

    // Format ISO datetime string if present
    const formatDateTime = (dateStr?: string) => {
      if (!dateStr) return undefined
      try {
        const date = new Date(dateStr)
        return date.toISOString().replace('Z', '')
      } catch (e) {
        console.error('Error in formatDateTime:', e)
        return undefined
      }
    }

    // Build query parameters
    const queryParams = new URLSearchParams({
      product_id,
      device_name,
    })

    // Optional parameters
    const start = formatDateTime(searchParams.get('start') || undefined)
    if (start) queryParams.append('start', start)

    const end = formatDateTime(searchParams.get('end') || undefined)
    if (end) queryParams.append('end', end)

    const optionalParams = [
      'datastream_id',
      'imei',
      'duration',
      'limit',
      'cursor',
      'sort',
    ]

    optionalParams.forEach((param) => {
      const value = searchParams.get(param)
      if (value) {
        queryParams.append(param, value)
      }
    })

    // Make request to OneNET API
    const response = await fetch(
      `https://www.onenet.hk.chinamobile.com:2616/datapoint/history-datapoints?${queryParams.toString()}`,
      {
        headers: {
          Authorization: token,
        },
      }
    )

    const data = await response.json()

    // If response is not ok, return error
    if (!response.ok) {
      return Response.json(
        {
          code: data.code || response.status,
          msg: data.msg || 'Failed to fetch datapoints',
          request_id: data.request_id || '',
          data: { count: 0, datastreams: [] },
        },
        { status: response.status }
      )
    }

    // Return successful response
    return Response.json(data)
  } catch (error) {
    console.error('Error in datapoints history:', error)
    return Response.json(
      {
        code: 500,
        msg:
          error instanceof Error ? error.message : 'An internal error occurred',
        request_id: '',
        data: { count: 0, datastreams: [] },
      },
      { status: 500 }
    )
  }
}
