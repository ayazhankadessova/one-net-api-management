// app/api/devices/file-space/route.ts
import { generateAuthorization } from '@/lib/auth'

export async function GET() {
  try {
    const accessKey = '84/fp/v9n4XNT48ndy1DU6HveauHJaltgf/TgU8Nocs=' // Your access key
    const et = 3600 * 1000

    // // Generate authorization token
    // const authorization = generateAuthorization(
    //   'sha1',
    //   'userid/292608',
    //   accessKey,
    //   et
    // )
    //     "authorization": "version=2022-05-01&res=userid%2F292608&et=1739782149&method=sha1&sign=dzKtFRxxBLhXiaNDmQXNsjhAU4U%3D"
    // "authorization": "version=2022-05-01&res=userid%2F292608&et=1739782149&method=sha1&sign=dzKtFRxxBLhXiaNDmQXNsjhAU4U%3D"

    // Make request to OneNET
    const response = await fetch(
      'https://www.onenet.hk.chinamobile.com:2616/device/file-space',
      {
        method: 'GET',
        headers: {
          Authorization:
            'version=2022-05-01&res=userid%2F292608&et=1739786450&method=sha1&sign=Nbxm7%2B9PKR3kONZrGDX9Z7in%2Fqk%3D',
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
