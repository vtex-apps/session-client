import { QueryHookOptions, useLazyQuery } from 'react-apollo'

import type { Session } from './SessionTypes'
import SessionQuery from './graphql/session.graphql'

interface Data {
  session: Session
}

interface Variables {
  items?: string[]
}

function useLazyFullSession(options?: QueryHookOptions<Data, Variables>) {
  return useLazyQuery<Data>(SessionQuery, options)
}

export default useLazyFullSession
