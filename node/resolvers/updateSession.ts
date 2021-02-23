import { ServiceContext } from '@vtex/api'

import { Clients } from '../clients'
import { getSessionToken } from '../modules/sessionToken'

interface Args {
  fields: Array<{ name: string; value: string | number }>
  items?: string[]
}

export async function updateSession(
  _: any,
  { fields, items }: Args,
  context: ServiceContext<Clients>
) {
  const {
    clients: { customSession },
  } = context

  const sessionCookie = getSessionToken(context.cookies)

  await customSession.updateSession(fields, sessionCookie)

  const { sessionData } = await customSession.getSession(sessionCookie, items)

  return sessionData
}
