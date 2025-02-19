import crypto from 'crypto'

export function generateAuthorization(
  method: string,
  res: string,
  accessKey: string,
  et: number
): string {
  const version = '2022-05-01'
  const expirationTime = Math.ceil((Date.now() + et) / 1000) // The validity period of the token
  const base64Key = Buffer.from(accessKey, 'base64') // accessKey base 64 encoded
  const stringForSignature =
    expirationTime + '\n' + method + '\n' + res + '\n' + version
  const sign = encodeURIComponent(
    crypto
      .createHmac(method, base64Key)
      .update(stringForSignature)
      .digest('base64')
  )
  const encodedRes = encodeURIComponent(res)
//   console.log(`version=${version}&res=${encodedRes}&et=${expirationTime}&method=${method}&sign=${sign}`)
//       "authorization": "version=2022-05-01&res=userid%2F292608&et=1739782149&method=sha1&sign=dzKtFRxxBLhXiaNDmQXNsjhAU4U%3D"

  return "version=2022-05-01&res=userid%2F292608&et=1739782149&method=sha1&sign=dzKtFRxxBLhXiaNDmQXNsjhAU4U%3D"
}
