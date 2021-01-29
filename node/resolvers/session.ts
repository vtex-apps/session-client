import { ServiceContext } from '@vtex/api'

import { Clients } from '../clients'
import { getSessionToken } from '../modules/sessionToken'

export const VTEX_SESSION = 'vtex_session'

interface Args {
  items?: string[]
}

export async function session(
  _: any,
  { items }: Args,
  context: ServiceContext<Clients>
) {
  const {
    clients: { customSession },
  } = context

  const sessionCookie = getSessionToken(context.cookies)

  const { sessionData } = await customSession.getSession(sessionCookie, items)

  return sessionData
}
