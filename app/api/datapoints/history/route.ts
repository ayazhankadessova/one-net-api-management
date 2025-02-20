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
          msg: 'Authentication required!',
          request_id: '',
          data: { count: 0, datastreams: [] },
        },
        { status: 401 }
      )
    }

    // Get URL parameters
    const searchParams = request.nextUrl.searchParams
    const product_id = searchParams.get('product_id')
    const device_name = searchParams.get('device_name')

    // Validate required parameters
    if (!product_id || !device_name) {
      return Response.json(
        {
          code: 400,
          msg: 'Product ID and Device Name are required',
          request_id: '',
          data: { count: 0, datastreams: [] },
        },
        { status: 400 }
      )
    }

    // Build query parameters
    const queryParams = new URLSearchParams({
      product_id,
      device_name,
    })

    // Add optional parameters if they exist
    const optionalParams = [
      'datastream_id',
      'imei',
      'start',
      'end',
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
        method: 'GET',
        headers: {
          Authorization: token,
        },
      }
    )

    const data = await response.json()

    // Handle unsuccessful response
    if (!response.ok) {
      return Response.json(
        {
          code: data.code || response.status,
          msg: data.msg || 'Request failed',
          request_id: data.request_id || '',
          data: { count: 0, datastreams: [] },
        },
        { status: response.status }
      )
    }

    // Return successful response
    return Response.json(data)
  } catch (error) {
    console.error('Error fetching history datapoints:', error)
    return Response.json(
      {
        code: 500,
        msg: error instanceof Error ? error.message : 'An error occurred',
        request_id: '',
        data: { count: 0, datastreams: [] },
      },
      { status: 500 }
    )
  }
}
