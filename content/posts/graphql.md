---
title: "Graphql"
date: 2018-01-10T15:21:52-05:00
draft: true
---

## Using GraphQL
GraphQL stands as the successor to REST. Apollo is a great open source initiative to provide implementations for both client and server. Because it's all bleeding edge, there's churn in the supporting tools libraries and packages. Here are some raw notes of how to get this stuff working.

I created this by reading the tutorial and going through the updated source code at [Full-stack Apollo + React](https://dev-blog.apollodata.com/full-stack-react-graphql-tutorial-582ac8d24e3b). There's so much churn that the article is out of date with the libraries but the source code is updated.

### The Client (React)
  * A package called `react-apollo` gives you two exposed objects: `graphql` and `ApolloProvider`.
  * `graphql` is the higher-order component that wraps a norma
  * There's a cool function JS tag that acts as a GQL parser called `gql` from the `graphql-tag` package.
  * `ApolloClient` comes from the `apollo-client` package.
  * `graphql-tools` contains `makeExecutableSchema`. Also, it contains `addMockFunctionsToSchema`.
  * `apollo-test-utils` contains `mockNetworkInterface`. Apollo client requires a "network interface" so that it can link to the server. This is deprecated in
  * Now there's a `apollo-client-preset` package that contains `apollo-client`, `apollo-cache-inmemory`, `apollo-link-http`, `react-apollo`, `graphql-tag`, and `graphql`.

  Setup of the client has changed with the latest updates. You can install the packages as

```
# installing the preset package and react integration
npm install apollo-client-preset react-apollo graphql-tag graphql --save

# installing each piece independently
npm install apollo-client apollo-cache-inmemory apollo-link-http react-apollo graphql-tag graphql --save
```

[Apollo Client Installation and Setup](https://www.apollographql.com/docs/react/basics/setup.html)

Looks like this has all changed. `ApolloClient` now wants a `Link` and `Cache`

This was part of the upgrade from Apollo 1 to 2 recently. Thows everything out of whack and most tutorials haven't caught up with it.

Man one of the packages is busted. There's an `asap` package that depends on another package called `events`. That package is not installed.

Also it seems like the `apollo-link` package is busted. It depends on `zen-observable` which is also not there.

The link was only required because I need to mock the http interface. The code that I stole from the [ApolloClient error template](https://github.com/apollographql/react-apollo-error-template/blob/master/src/graphql/link.js)


Starting Here >>>
Start by running `create-react-app` to generate a starter front-end.

First thing I'm going to do is define the types in my GraphQL schema. A GraphQL schema contains the schema for the types, queries, mutations, and subscriptions available. As of now the easiest way is just to define a string in a separate `typeDefs.js` file.

```
export const typeDefs = `
  type ChatMessage {
    id: ID!
    content: String
  }

  type Query {
    messages: [ChatMessage]
  }
`;
```

Then use the function `makeExecutableSchema` from the `graphql-tools` package (`yarn add graphql graphql-tools`).

```
import { makeExecutableSchema } from 'graphql-tools';

import { typeDefs } from './typeDefs';

const schema = makeExecutableSchema({ typeDefs });
```

At this point the `schema` object contains a parsed valid query and a definition for the chat message.

Just for fun, and because there's no backend yet, use the function `addMockFunctionsToSchema` from the `graphql-tools` package such as:

```
addMockFunctionsToSchema({ schema });
```

As the name applies, when a field in the schema is being resolved, a mock function is called instead of resolving to a field from the backend. For example, if a field is a `String` it well resolve to "Hello World".

In Apollo 2.0, we attach the schema to it's source by creating a client with the schema itself and a link. Typically this is an HTTP link. As we just want to use mock functions now, we'll have to be a little innovative at the moment and pass a fake link. I created a new file called `link.js` and ripped the code from the [Apollo Client Error Template](https://github.com/apollographql/react-apollo-error-template). You'll need the Apollo link package to provide the definition of the interface that we'll extend: `yarn add apollo-link`

Then the code for the mock link can be written as:

```
import { graphql, print } from "graphql";
import { ApolloLink, Observable } from "apollo-link";

export const link = (schema) => {
  return new ApolloLink(operation => {
    return new Observable(observer => {
      const { query, operationName, variables } = operation;
      delay(300)
        .then(() =>
          graphql(schema, print(query), null, null, variables, operationName)
        )
        .then(result => {
          observer.next(result);
          observer.complete();
        })
        .catch(observer.error.bind(observer));
    });
  });
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
```

In the `App.js` file, import an in-memory cache for the Apollo client (`yarn add apollo-cache-inmemory`) and the Apollo client itself (`yarn add apollo-client`);

It's an aside as to what the `link` code does, but essentially serves as a mock http server. Use it when creating the Apollo client like this:

```
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { link } from './link';
...

const client = new ApolloClient({
  link: link(schema),
  cache: new InMemoryCache()
});
```

Almost there. Let's make a basic component, right in the `App.js` file for now to see what we have.

```
const ChatMessageList = ({ data: { loading, error, messages } }) => {
  if(loading) return (<p>Loading...</p>);

  if(error) return (<p>{error.message}</p>);

  return (
    <ul className="chat-message-list">
      {messages.map(msg =>(<li key={msg.id}>{msg.content}</li>))}
    </ul>
  );
}
```

There's a lot of implicit knowledge happening in this component. The Apollo client will pass us an object with a `data` element as the result of executing the GraphQL query against the server (or in our case the mock server). The structure of the returned object, matches what you might see if executed the command using the GraphiQL tool. The `loading` and `error` attributes have been added so that we can use to return a different response as appropriate.

There is a standard Javascript API to create a GraphQL query. It's a lot easier to use a handy string template `gql`. Import the `graphql-tag` package: `yarn add graphql-tag`.

```
import gql from 'graphql-tag';
...
const chatMessages = gql`
query ChatMessagesQuery {
  messages {
    id
    content
  }
}
`;
```

What connects the world of Apollo to the world of React, is the Apollo provider and the "higher-order component" `graphql`. Import both from the `react-apollo` package: `yarn add react-apollo`.

```
import { ApolloProvider, graphql } from 'react-apollo';
...
const AllChatMessageList = graphql(chatMessages)(ChatMessageList);

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <AllChatMessageList />
        </div>
      </ApolloProvider>
    );
  }
}
```

The `graphql` function wraps the originally defined component and binds it to the query we defined with the `gql` tag. The Apollo provider binds the client interface with the components.

The Server
==========

Let's make a simple express server.

`yarn add express`

Just like the client you have to have a copy of the schema.

Then you need to compile the schema to an in-memory object using the function `makeExectuableSchema` from the `graphql-tools` package. You'll also need to install the `graphql` package as a peer dependency.

`yarn add graphql graphql-tools`

The GraphQL part of the server is implemented as express middleware. You'll need the express `body-parser` package as well.

`yarn add body-parser graphql-server-express`

So far the server is easier to setup and closer to the existing packages than the client.

You can setup the GraphiQL browser by using the `graphiqlExpress` middleware.

You can use the function `addMockFunctionsToSchema` from the `graphql-tools` package that you added above to seed some random data, but we'll customize this with our own resolvers.

Now the important part resolvers!

Use the `casual` package to generate random data.

`yarn add casual`

The GraphQL server uses the resolvers to lookup the value of any field in the defined schema. It's really a map between the fields and a function that runs as a result of looking that field up.

Here's my resolver for messages.

```
const casual = require('casual');

casual.seed(201801151555);

casual.define('message', () => {
  return {
    id: casual.uuid,
    content: casual.sentence
  };
})

const messages = [...Array(100)].map(_ => casual.message);

const resolvers = {
  Query: {
    messages: () => {
      return messages;
    }
  }
}

module.exports = {
  resolvers
}
```

This code fixes the randomness of the `casual` library by setting the seed to a fixed number. I defined a custom generate (i.e., a property) on the casual object called `message` that when accessed generates a random message. I generate a 100 of them just for kicks.

The resolvers function matches the shape of the schema. When the `messages` property is queried we return the random array of messages.

Here's the code for the server with subscription support
```
const express = require('express');
const bodyParser = require('body-parser');
const { createServer } = require('http');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const { execute, subscribe } = require('graphql');
const cors = require('cors');

const { typeDefs } = require('./typeDefs');
const { resolvers } = require('./resolvers');

const PORT = 4000; // TODO: read from env var.
const server = express();

server.use('*', cors({ origin: 'http://localhost:3000' }));

const schema = makeExecutableSchema({ typeDefs, resolvers });

server.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:4000/subscriptions`}));

const ws = createServer(server);
let ssserver;

ws.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);

  sserver = new SubscriptionServer({
    execute,
    subscribe,
    schema}, {
      server: ws,
      path: '/subscriptions'
    });
});
```

# Connecting the client to the server

You'll need CORS beause you are serving the client from port 3000 and the server is running on 4000 (a different origin). This goes on the server!

`yarn add cors`

```
server.use('*', cors({ origin: 'http://localhost:3000' }));
```

You need the real link.

`yarn add apollo-link-http`

On the client just remove all the mock stuff and link to the server.

```
const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:4000/graphql'}),
  cache: new InMemoryCache()
});
```

# Adding a mutation on the server

Add the definition of the mutation into the typedef

```
  type Mutation {
    postChatMessage(content: String!): ChatMessage
  }
```

Then you just add a resolver.

```
const resolvers = {
  Query: {
    messages: () => {
      return messages;
    }
  },
  Mutation: {
    postChatMessage: (root, args) => {
      const message = {
        id: casual.uuid,
        content: args.content
      };
      messages.push(message);
      return message;
    }
  }
}
```

# Write a React component to post a message


SUBSCRIPTIONS
=============
The SDL has to be added to the server's view of the schema

```
type Subscription {
  messageAdded: ChatMessage
}
```

Then add support for the subscriptions in the resolvers. The strategy here is to push the subscription when a mutation is triggered.

Publish to PubSub on the mutation

Add the `Subscription` node to the resolvers object.

Add the WS support in `yarn add subscriptions-transport-ws`
































