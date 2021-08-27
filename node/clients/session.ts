import { JanusClient } from '@vtex/api'
import parseCookie from 'cookie'

const SESSION_COOKIE = 'vtex_session'

const BASE_ROUTE = '/api/sessions'

interface SessionPostResponse {
  sessionToken: string
  segmentToken: string
}

export class Session extends JanusClient {
  /**
   * Get the session data using the given token
   */
  public getSession = async (token: string, items: string[] = ['*']) => {
    const { data: sessionData, headers } = await this.http.getRaw(BASE_ROUTE, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `vtex_session=${token};`,
      },
      metric: 'session-get',
      params: {
        items: items.join(','),
      },
    })

    return {
      sessionData,
      sessionToken: extractSessionCookie(headers) ?? token,
    }
  }

  /**
   * Update the public portion of this session
   */
  public updateSession = (publicFields: Record<string, any>, token: string) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `vtex_session=${token};`,
      },
      metric: 'session-update',
    }

    const fields = Object.entries(publicFields).reduce<
      Record<string, { value: string | number }>
    >((acc, [fieldName, fieldValue]) => {
      acc[fieldName] = { value: fieldValue }

      return acc
    }, {})

    const data = { public: fields }

    return this.http.patch<SessionPostResponse>(BASE_ROUTE, data, config)
  }
}

function extractSessionCookie(headers: Record<string, string>) {
  for (const setCookie of headers['set-cookie'] ?? []) {
    const parsedCookie = parseCookie.parse(setCookie)
    const sessionCookie = parsedCookie[SESSION_COOKIE]

    if (sessionCookie != null) {
      return sessionCookie
    }
  }

  return null
}
