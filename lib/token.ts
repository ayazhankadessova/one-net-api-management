// lib/token.ts
interface TokenResponse {
  success: boolean
  token: string
}

export async function generateToken(
  userId: string,
  accessKey: string
): Promise<string> {
  const tokenResponse = await fetch('http://127.0.0.1:8000/api/py/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      access_key: accessKey,
    }),
  })

  if (!tokenResponse.ok) {
    throw new Error('Failed to generate token')
  }

  const tokenData: TokenResponse = await tokenResponse.json()
  return tokenData.token
}

// You might want to add caching later
export async function getOrGenerateToken(
  userId: string,
  accessKey: string
): Promise<string> {
  // For now, just generate a new token each time
  return generateToken(userId, accessKey)
}
