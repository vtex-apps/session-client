import { QueryHookOptions, useMutation } from 'react-apollo'

import UpdateSesionMutation from './graphql/updateSession.graphql'
import type { Session } from './SessionTypes'

interface Data {
  updateSession: Session
}

interface Variables {
  fields: Record<string, string | number>
  items?: string[]
}

function useUpdateSessionInline(options?: QueryHookOptions<Data, Variables>) {
  return useMutation<Data, Variables>(UpdateSesionMutation, options)
}

export default useUpdateSessionInline
