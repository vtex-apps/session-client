# Session Client

The Session Client app provides React hooks and GraphQL queries for your components to read and update the [VTEX Session cookie](https://help.vtex.com/en/tutorial/vtex-session-sessions-system-overview--6C4Edou6bYqqEAOCAg2MQQ), responsible for saving data of a specific session of a user browsing in your store. 

## Installation

In your React app's `manifest.json` file, add the Session Client app to the dependency list:

```
"dependencies": {
    "vtex.session-client": "1.x"
  }
```

> ℹ️ You can have full TypeScript support running `vtex setup --typings` in your CLI afterwards.

## Configuration

The Session Client's React hooks allow you to read and update the VTEX Session cookie as desired. On the other hand, the GraphQL query and mutation enable your app to fetch and change the current user session.

### React hooks

To read the VTEX Session cookie:

- [`useRenderSession`](#useRenderSession)
- [`useFullSession`](#useFullSession)
- [`useLazyFullSession`](#useLazyFullSession)

To update the VTEX Session cookie:

- [`useUpdateSession`](#useUpdateSession)
- [`useUpdateSessionInline`](#useUpdateSessionInline)

#### `useRenderSession` hook

This hook is the fastest way to access session data, using the session response from `render-session`. One caveat: the session values are limited to a [set of values](https://github.com/vtex-apps/render-session/blob/master/src/constants.ts). If you need fields that are not in this set, you can use [`useFullSession`](#useFullSession) or [`useLazyFullSession`](#useLazyFullSession).

```tsx
import React from 'react'
import { useRenderSession } from 'vtex.session-client'

function MyComponent() {
  const { loading, session, error } = useRenderSession()

  if (loading) {
    return <>Session is loading</>
  }

  if (error) {
    return <>Session has errors</>
  }

  console.log({ session })

  return <>Session is ready</>
}

export default MyComponent
```

#### `useFullSession` hook

> ⚠️ It's not possible to return the session during Server Side Rendering since it is a private query.

Runs a GraphQL query on the client side to query the full user session.

Under the hood, it's a wrapper of React Apollo's `useQuery` passing the GraphQL session query. You can read more about the `useQuery` API [here](https://www.apollographql.com/docs/react/api/react/hooks/#usequery).


```tsx
import React from 'react'
import { useFullSession } from 'vtex.session-client'

function MyComponent() {
  const { loading, data, error } = useFullSession()

  if (loading) {
    return <>Session is loading</>
  }

  if (error) {
    return <>Session has errors</>
  }

  console.log({ session: data?.session })

  return <>Session is ready</>
}

export default MyComponent
```

It also accepts a GraphQL variable called `items` which is an array of strings. These strings should match attributes inside the Session object, and only those attributes will be then fetched and returned.

For example:

```tsx
useFullSession({
  variables: {
    items: ['store.channel', 'store.countryCode']
  }
})
```

#### `useLazyFullSession` hook

The same as [`useFullSession`](#useFullSession), but it uses React Apollo's `useLazyQuery` hook instead. You can read more about `useLazyQuery` API [here](https://www.apollographql.com/docs/react/api/react/hooks/#uselazyquery).

```tsx
import React from 'react'
import { useLazyFullSession } from 'vtex.session-client'

function MyComponent() {
  const [getSession, session] = useLazyFullSession()

  console.log({ session })

  return <button onClick={() => getSession()}>Get session</button>
}

export default MyComponent
```

It also accepts a GraphQL variable called `items`, which is an array of strings. These strings should match attributes inside the Session object, and only those attributes will be then fetched and returned.

For example:

```tsx
useLazyFullSession({
  variables: {
    items: ['store.channel', 'store.countryCode']
  }
})
```

#### `useUpdateSession` hook

Updates the values of a session. Under the hood, it uses React Apollo's `useMutation` hook. You can read more about `useMutation` API [here](https://www.apollographql.com/docs/react/api/react/hooks/#usemutation).

Unlike the `useMutation` hook, this one only returns the mutation function (called in the example below as `updateSession`) — it does not return the mutation result. 

After calling the mutation function, the hook reloads the page, guaranteeing that the whole page data is updated to the new session parameters. This is extremely useful in pages where the content changes according to the session values, such as the search results. 

```tsx
import React from 'react'
import { useUpdateSession } from 'vtex.session-client'

function MyComponent() {
  const updateSession = useUpdateSession()

  return (
    <button
      onClick={() =>
        updateSession({
          variables: {
            fields: { foo: 'bar', baz: 123 },
          },
        })
      }
    >
      Update session
    </button>
  )
}

export default MyComponent
```

#### `useUpdateSessionInline` hook

Updates the values of a session. Under the hood, it uses React Apollo's `useMutation` hook. You can read more about `useMutation` API [here](https://www.apollographql.com/docs/react/api/react/hooks/#usemutation).

Differently from the [`useUpdateSession`](#useUpdateSession), this hook will not reload the page after calling the mutation function.

```tsx
import React from 'react'
import { useUpdateSessionInline } from 'vtex.session-client'

function MyComponent() {
  const [updateSession, updatedSession] = useUpdateSessionInline()

  console.log({ updatedSession })

  return (
    <button
      onClick={() =>
        updateSession({
          variables: {
            fields: { foo: 'bar', baz: 123 },
          },
        })
      }
    >
      Update session
    </button>
  )
}

export default MyComponent
```

It also accepts a GraphQL variable called `items`, which is an array of strings. These strings should match attributes inside of the Session object, and only those attributes will be then fetched and returned.

For example:

```tsx
updateSession({
  variables: {
    fields: { foo: 'bar', baz: 123 },
    items: ['store.channel', 'store.countryCode']
  }
})
```

### GraphQL query and mutation

#### `session` query

Gets the current user session.

```graphql
query session($items: [String]) {
  session(items: $items) @context(provider: "vtex.session-client") {
    ... on SessionSuccess {
      id
      namespaces
    }
    ... on SessionError {
      type
      message
    }
  }
}
```

#### `updateSession` mutation

Changes the current user session using the following variables: `{ "fields": { "foo": 123, "baz": "abc" } }`

```graphql
mutation updateSession($fields: SessionFieldsJSONInput!, $items: [String]) {
  updateSession(fields: $fields, items: $items)
    @context(provider: "vtex.session-client") {
    ... on SessionSuccess {
      id
      namespaces
    }
    ... on SessionError {
      type
      message
    }
  }
}
```
