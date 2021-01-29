import { QueryHookOptions, useQuery } from 'react-apollo'

import type { Session } from './SessionTypes'
import SessionQuery from './graphql/session.graphql'

interface Data {
  session: Session
}

interface Variables {
  items?: string[]
}

function useFullSession(options?: Omit<QueryHookOptions<Data>, 'ssr'>) {
  return useQuery<Data, Variables>(SessionQuery, {
    ...options,
    ssr: false,
  })
}

export default useFullSession
